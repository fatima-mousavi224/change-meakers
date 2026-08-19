import type { Member } from "@prisma/client";

import prisma from "@/lib/prismaDB";

const ADMIN_MEMBERS_TIMEOUT_MS = 10000;

async function withTimeout<T>(promise: Promise<T>, fallback: T): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((resolve) => {
        timeoutId = setTimeout(() => resolve(fallback), ADMIN_MEMBERS_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

function mapRawMember(doc: Record<string, unknown>): Member {
  const id =
    typeof doc._id === "object" &&
    doc._id !== null &&
    "$oid" in doc._id &&
    typeof doc._id.$oid === "string"
      ? doc._id.$oid
      : "";

  const createdAt =
    typeof doc.createdAt === "object" &&
    doc.createdAt !== null &&
    "$date" in doc.createdAt
      ? new Date(String(doc.createdAt.$date))
      : new Date();

  const updatedAt =
    typeof doc.updatedAt === "object" &&
    doc.updatedAt !== null &&
    "$date" in doc.updatedAt
      ? new Date(String(doc.updatedAt.$date))
      : createdAt;

  const avatar = Array.isArray(doc.avatar)
    ? doc.avatar.filter(
        (item): item is { image: string } =>
          typeof item === "object" &&
          item !== null &&
          "image" in item &&
          typeof item.image === "string"
      )
    : [];

  const role = typeof doc.role === "string" ? doc.role : null;
  const bio = typeof doc.bio === "string" ? doc.bio : "";
  const image =
    (typeof doc.image === "string" ? doc.image : "") ||
    avatar[0]?.image ||
    "";

  return {
    id,
    slug: typeof doc.slug === "string" ? doc.slug : id,
    name: typeof doc.name === "string" ? doc.name : "",
    role,
    bio,
    image,
    imageObjectPosition:
      typeof doc.imageObjectPosition === "string"
        ? doc.imageObjectPosition
        : null,
    socials: doc.socials ?? null,
    sortOrder: typeof doc.sortOrder === "number" ? doc.sortOrder : 0,
    published: doc.published !== false,
    position:
      typeof doc.position === "string"
        ? doc.position
        : role || "",
    description:
      typeof doc.description === "string" ? doc.description : bio,
    avatar,
    createdAt,
    updatedAt,
  } as Member;
}

async function loadMembersFromRaw(): Promise<Member[]> {
  const raw = await prisma.member.findRaw({
    filter: {},
    options: {
      sort: { sortOrder: 1, createdAt: 1 },
    },
  });

  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.map((doc) => mapRawMember(doc as Record<string, unknown>));
}

export async function getAdminMembers(): Promise<Member[]> {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    const members = await withTimeout(
      prisma.member.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      }),
      []
    );

    if (members.length) {
      return members;
    }
  } catch (error) {
    console.error("member.findMany failed, using raw fallback:", error);
  }

  try {
    return await withTimeout(loadMembersFromRaw(), []);
  } catch (error) {
    console.error("member.findRaw failed:", error);
    return [];
  }
}

export async function getAdminMemberCount(): Promise<number> {
  const members = await getAdminMembers();
  return members.length;
}
