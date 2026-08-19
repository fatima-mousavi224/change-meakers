import {
  CATEGORY_TITLE_ALIASES,
  UPDATES_PER_PAGE,
  type UpdateListItem,
  type UpdateListResponse,
  type UpdateSort,
} from "@/constant/updatesListing";
import prisma from "@/lib/prismaDB";

type GetUpdatesParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: UpdateSort;
};

function stripHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildCategoryFilter(category: string) {
  if (category === "All Updates") {
    return {};
  }

  const titles = CATEGORY_TITLE_ALIASES[category] ?? [category];

  return {
    Category: {
      is: {
        title: { in: titles },
      },
    },
  };
}

function serializeUpdate(post: {
  id: string;
  shortId?: string | null;
  slug?: string | null;
  title: string;
  excerpt?: string | null;
  description: string;
  authorImage?: { image: string } | null;
  postImages: { image: string }[];
  postDate: Date | null;
  createdAt: Date;
  Category: { title: string } | null;
}): UpdateListItem {
  const postDate = post.postDate ?? post.createdAt;

  return {
    id: post.id,
    shortId: post.shortId ?? null,
    slug: post.slug ?? null,
    title: post.title,
    excerpt: post.excerpt?.trim() || stripHtml(post.description),
    category: post.Category?.title ?? "Updates",
    image:
      post.authorImage?.image?.trim() ||
      post.postImages[0]?.image?.trim() ||
      "/images/update-component-image.jpg",
    postDate: postDate.toISOString(),
    createdAt: post.createdAt.toISOString(),
  };
}

export async function getUpdates({
  page = 1,
  limit = UPDATES_PER_PAGE,
  search = "",
  category = "All Updates",
  sort = "recent",
}: GetUpdatesParams = {}): Promise<UpdateListResponse> {
  const where = {
    ...buildCategoryFilter(category),
    ...(search
      ? {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {}),
  };

  const orderBy =
    sort === "oldest"
      ? { createdAt: "asc" as const }
      : { createdAt: "desc" as const };

  const [total, items] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        Category: true,
      },
    }),
  ]);

  return {
    items: items.map(serializeUpdate),
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}
