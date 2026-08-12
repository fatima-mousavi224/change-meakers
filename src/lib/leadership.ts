import type {
  LeadershipMember,
  LeadershipSocialLink,
} from "@/constant/aboutLeadership";
import { EXECUTIVE_TEAM } from "@/constant/aboutLeadership";
import prisma from "@/lib/prismaDB";

function stripHtml(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseSocials(value: unknown): LeadershipSocialLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is LeadershipSocialLink =>
      typeof item === "object" &&
      item !== null &&
      "type" in item &&
      "href" in item &&
      typeof item.type === "string" &&
      typeof item.href === "string" &&
      item.href.trim().length > 0
  );
}

type DbMember = {
  slug: string;
  name: string;
  role?: string | null;
  bio?: string | null;
  image?: string | null;
  imageObjectPosition?: string | null;
  socials?: unknown;
  position?: string | null;
  description?: string | null;
  avatar?: { image: string }[];
};

export function mapMemberToLeadership(member: DbMember): LeadershipMember {
  const image =
    member.image?.trim() ||
    member.avatar?.find((item) => item.image?.trim())?.image?.trim() ||
    "";

  const bio =
    member.bio?.trim() ||
    stripHtml(member.description ?? "") ||
    "";

  const role = member.role?.trim() || member.position?.trim() || undefined;

  return {
    id: member.slug,
    name: member.name,
    role,
    bio,
    image,
    imageObjectPosition: member.imageObjectPosition?.trim() || undefined,
    socials: parseSocials(member.socials),
  };
}

export async function getExecutiveTeam(): Promise<LeadershipMember[]> {
  if (!process.env.DATABASE_URL) {
    return EXECUTIVE_TEAM;
  }

  try {
    const members = await prisma.member.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    const mapped = members
      .map(mapMemberToLeadership)
      .filter((member) => member.image && member.bio);

    if (mapped.length) {
      return mapped;
    }
  } catch (error) {
    console.error("Failed to load executive team:", error);

    try {
      const raw = await prisma.member.findRaw({
        filter: { published: { $ne: false } },
        options: { sort: { sortOrder: 1, createdAt: 1 } },
      });

      if (Array.isArray(raw)) {
        const mapped = raw
          .map((doc) =>
            mapMemberToLeadership({
              slug: String((doc as { slug?: string }).slug ?? ""),
              name: String((doc as { name?: string }).name ?? ""),
              role: (doc as { role?: string | null }).role,
              bio: (doc as { bio?: string | null }).bio,
              image: (doc as { image?: string | null }).image,
              imageObjectPosition: (doc as { imageObjectPosition?: string | null })
                .imageObjectPosition,
              socials: (doc as { socials?: unknown }).socials,
              position: (doc as { position?: string | null }).position,
              description: (doc as { description?: string | null }).description,
              avatar: (doc as { avatar?: { image: string }[] }).avatar,
            })
          )
          .filter((member) => member.image && member.bio);

        if (mapped.length) {
          return mapped;
        }
      }
    } catch (rawError) {
      console.error("Failed raw executive team fallback:", rawError);
    }
  }

  return EXECUTIVE_TEAM;
}
