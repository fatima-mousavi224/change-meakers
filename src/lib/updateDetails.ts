import type { OpportunityContentBlock } from "@/constant/opportunityContentBlocks";
import {
  htmlContentToBlocks,
  parseOpportunityContentBlocks,
} from "@/constant/opportunityContentBlocks";
import type { UpdateDetailItem } from "@/constant/updatesDetail";
import prisma from "@/lib/prismaDB";

function stripHtml(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function htmlDescriptionToBlocks(
  description: string,
  postImages: { image: string }[]
): OpportunityContentBlock[] {
  const blocks: OpportunityContentBlock[] = [];

  for (const item of postImages) {
    const src = item.image?.trim();
    if (src) {
      blocks.push({ type: "image", src });
    }
  }

  blocks.push(...htmlContentToBlocks(description));
  return blocks;
}

async function resolveContentBlocks(
  id: string,
  contentBlocks: unknown,
  description: string,
  postImages: { image: string }[]
) {
  const parsed = parseOpportunityContentBlocks(contentBlocks);
  if (parsed.length) {
    return parsed;
  }

  try {
    const raw = await prisma.post.findRaw({
      filter: {
        _id: { $eq: { $oid: id } },
      },
      options: {
        projection: { contentBlocks: 1 },
      },
    });

    if (Array.isArray(raw) && raw[0]) {
      const fromDb = (raw[0] as { contentBlocks?: unknown }).contentBlocks;
      const parsedFromDb = parseOpportunityContentBlocks(fromDb);
      if (parsedFromDb.length) {
        return parsedFromDb;
      }
    }
  } catch (error) {
    console.error("Failed to load update content blocks:", error);
  }

  return htmlDescriptionToBlocks(description, postImages);
}

function serializeUpdate(
  post: {
    id: string;
    title: string;
    excerpt?: string | null;
    description: string;
    contentBlocks?: unknown;
    author: string;
    authorImage: { image: string } | null;
    postImages: { image: string }[];
    postDate: Date | null;
    createdAt: Date;
    Category: { title: string } | null;
  },
  resolvedBlocks?: OpportunityContentBlock[]
): UpdateDetailItem {
  const postDate = post.postDate ?? post.createdAt;
  const parsedBlocks = parseOpportunityContentBlocks(post.contentBlocks);
  const contentBlocks =
    resolvedBlocks ??
    (parsedBlocks.length
      ? parsedBlocks
      : htmlDescriptionToBlocks(post.description, post.postImages));

  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt?.trim() || stripHtml(post.description),
    category: post.Category?.title ?? "Updates",
    author: post.author,
    authorImage: post.authorImage?.image?.trim() || null,
    postDate: postDate.toISOString(),
    createdAt: post.createdAt.toISOString(),
    contentBlocks,
  };
}

export async function getUpdateById(id: string): Promise<UpdateDetailItem | null> {
  const post = await prisma.post.findUnique({
    where: { id },
    include: { Category: true },
  });

  if (!post) {
    return null;
  }

  const contentBlocks = await resolveContentBlocks(
    id,
    (post as { contentBlocks?: unknown }).contentBlocks,
    post.description,
    post.postImages
  );

  return serializeUpdate(post, contentBlocks);
}
