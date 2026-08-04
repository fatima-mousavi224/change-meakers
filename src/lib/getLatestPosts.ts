import prisma from "@/lib/prismaDB";

export async function getLatestPosts(limit = 3) {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    return await prisma.post.findMany({
      take: limit,
      orderBy: {
        postDate: "desc",
      },
      include: {
        Category: true,
      },
    });
  } catch (error) {
    console.error("Failed to load posts:", error);
    return [];
  }
}
