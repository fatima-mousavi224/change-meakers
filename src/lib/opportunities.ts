import {
  OPPORTUNITIES_PER_PAGE,
  type OpportunityItem,
  type OpportunityListResponse,
  type OpportunitySort,
} from "@/constant/opportunities";
import {
  legacyContentToBlocks,
  parseOpportunityContentBlocks,
  type OpportunityContentBlock,
} from "@/constant/opportunityContentBlocks";
import prisma from "@/lib/prismaDB";

type GetOpportunitiesParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  location?: string;
  sort?: OpportunitySort;
};

function serializeOpportunity(
  opportunity: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    contentBlocks: unknown;
    category: string;
    location: string;
    image: string;
    deadline: Date;
    applicationUrl: string | null;
    resourceProvider: string | null;
    mainSource: string | null;
    postedDate: Date | null;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
  },
  resolvedBlocks?: OpportunityContentBlock[],
): OpportunityItem {
  const parsedBlocks = parseOpportunityContentBlocks(opportunity.contentBlocks);
  const contentBlocks =
    resolvedBlocks ??
    (parsedBlocks.length ? parsedBlocks : legacyContentToBlocks(opportunity.content));

  return {
    id: opportunity.id,
    title: opportunity.title,
    excerpt: opportunity.excerpt,
    content: opportunity.content,
    contentBlocks,
    category: opportunity.category,
    location: opportunity.location,
    image: opportunity.image,
    deadline: opportunity.deadline.toISOString(),
    applicationUrl: opportunity.applicationUrl,
    resourceProvider: opportunity.resourceProvider,
    mainSource: opportunity.mainSource,
    postedDate: opportunity.postedDate?.toISOString() ?? null,
    published: opportunity.published,
    createdAt: opportunity.createdAt.toISOString(),
    updatedAt: opportunity.updatedAt.toISOString(),
  };
}

async function resolveContentBlocks(
  id: string,
  contentBlocks: unknown,
  content: string,
) {
  const parsed = parseOpportunityContentBlocks(contentBlocks);
  if (parsed.length) {
    return parsed;
  }

  try {
    const raw = await prisma.opportunity.findRaw({
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
    console.error("Failed to load opportunity content blocks:", error);
  }

  return legacyContentToBlocks(content);
}

export async function getOpportunities({
  page = 1,
  limit = OPPORTUNITIES_PER_PAGE,
  search = "",
  category = "All Opportunities",
  location = "All Locations",
  sort = "recent",
}: GetOpportunitiesParams = {}): Promise<OpportunityListResponse> {
  const where = {
    published: true,
    ...(category !== "All Opportunities" ? { category } : {}),
    ...(location !== "All Locations" ? { location } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search } },
            { excerpt: { contains: search } },
            { content: { contains: search } },
            { location: { contains: search } },
          ],
        }
      : {}),
  };

  const orderBy =
    sort === "oldest"
      ? { createdAt: "asc" as const }
      : sort === "deadline"
        ? { deadline: "asc" as const }
        : { createdAt: "desc" as const };

  const [total, items] = await Promise.all([
    prisma.opportunity.count({ where }),
    prisma.opportunity.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return {
    items: items.map(serializeOpportunity),
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getOpportunityById(id: string) {
  const opportunity = await prisma.opportunity.findFirst({
    where: { id, published: true },
  });

  if (!opportunity) {
    return null;
  }

  const contentBlocks = await resolveContentBlocks(
    id,
    (opportunity as { contentBlocks?: unknown }).contentBlocks,
    opportunity.content,
  );

  return serializeOpportunity(opportunity, contentBlocks);
}
