import type { OpportunityContentBlock } from "@/constant/opportunityContentBlocks";
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
  postImages: { image: string }[],
): OpportunityContentBlock[] {
  const blocks: OpportunityContentBlock[] = [];

  for (const item of postImages) {
    const src = item.image?.trim();
    if (src) {
      blocks.push({ type: "image", src });
    }
  }

  const normalized = description
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n\n");

  const stripped = normalized
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ");

  const paragraphs = stripped
    .split(/\n\n+/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  for (const body of paragraphs) {
    blocks.push({ type: "text", body });
  }

  return blocks;
}

function serializeUpdate(post: {
  id: string;
  title: string;
  description: string;
  author: string;
  authorImage: { image: string } | null;
  postImages: { image: string }[];
  postDate: Date | null;
  createdAt: Date;
  Category: { title: string } | null;
}): UpdateDetailItem {
  const postDate = post.postDate ?? post.createdAt;
  const excerpt = stripHtml(post.description);

  return {
    id: post.id,
    title: post.title,
    excerpt,
    category: post.Category?.title ?? "Updates",
    author: post.author,
    authorImage: post.authorImage?.image?.trim() || null,
    postDate: postDate.toISOString(),
    createdAt: post.createdAt.toISOString(),
    contentBlocks: htmlDescriptionToBlocks(post.description, post.postImages),
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

  return serializeUpdate(post);
}
