import { buildCategoryFilter } from "@/lib/updatesListing";
import prisma from "@/lib/prismaDB";

const postInclude = { Category: true } as const;

async function fetchPosts(
  where: Record<string, unknown> | undefined,
  limit?: number,
) {
  return prisma.post.findMany({
    ...(where ? { where } : {}),
    ...(limit ? { take: limit } : {}),
    orderBy: {
      postDate: "desc",
    },
    include: postInclude,
  });
}

export async function getLatestPosts(limit = 3) {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    return await fetchPosts(undefined, limit);
  } catch (error) {
    console.error("Failed to load posts:", error);
    return [];
  }
}

export async function getLatestPostsByCategory(category: string, limit = 12) {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    return await fetchPosts(buildCategoryFilter(category), limit);
  } catch (error) {
    console.error("Failed to load posts by category:", error);
    return [];
  }
}
