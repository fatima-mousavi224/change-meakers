import prisma from "@/lib/prismaDB";
import type { Post } from "@/types/database";

const NAVBAR_POSTS_TIMEOUT_MS = 5000;

async function withTimeout<T>(promise: Promise<T>, fallback: T): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((resolve) => {
        timeoutId = setTimeout(() => resolve(fallback), NAVBAR_POSTS_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

export async function getNavbarPosts(): Promise<Post[]> {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    const posts = await withTimeout(
      prisma.post.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          author: true,
          authorImage: true,
          categoryId: true,
          postImages: true,
          postDate: true,
          showInHome: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          postDate: "desc",
        },
        take: 50,
      }),
      []
    );

    return posts as Post[];
  } catch (error) {
    console.error("Failed to load navbar posts:", error);
    return [];
  }
}
