import type { OpportunityContentBlock } from "@/constant/opportunityContentBlocks";
import prisma from "@/lib/prismaDB";

type PostExtendedFields = {
  excerpt?: string;
  contentBlocks?: OpportunityContentBlock[];
};

function toObjectId(id: string) {
  return { $oid: id };
}

export async function savePostExtendedFields(
  id: string,
  fields: PostExtendedFields
) {
  const setFields: Record<string, unknown> = {};

  if (fields.excerpt !== undefined) {
    setFields.excerpt = fields.excerpt;
  }

  if (fields.contentBlocks !== undefined) {
    setFields.contentBlocks = fields.contentBlocks;
  }

  if (!Object.keys(setFields).length) {
    return;
  }

  await prisma.$runCommandRaw({
    update: "Post",
    updates: [
      {
        q: { _id: toObjectId(id) },
        u: { $set: setFields },
      },
    ],
  } as Parameters<typeof prisma.$runCommandRaw>[0]);
}

export async function loadPostExtendedFields(
  id: string
): Promise<PostExtendedFields> {
  const raw = await prisma.post.findRaw({
    filter: {
      _id: { $eq: toObjectId(id) },
    },
    options: {
      projection: { excerpt: 1, contentBlocks: 1 },
    },
  });

  if (!Array.isArray(raw) || !raw[0]) {
    return {};
  }

  const doc = raw[0] as {
    excerpt?: string;
    contentBlocks?: unknown;
  };

  return {
    excerpt: typeof doc.excerpt === "string" ? doc.excerpt : undefined,
    contentBlocks: Array.isArray(doc.contentBlocks)
      ? (doc.contentBlocks as OpportunityContentBlock[])
      : undefined,
  };
}

export async function mergePostExtendedFields<T extends { id: string }>(
  post: T
): Promise<T & PostExtendedFields> {
  const extended = await loadPostExtendedFields(post.id);
  return { ...post, ...extended };
}
