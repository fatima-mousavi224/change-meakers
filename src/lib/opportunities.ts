import {
  OPPORTUNITIES_PER_PAGE,
  type OpportunityItem,
  type OpportunityListResponse,
  type OpportunitySort,
} from "@/constant/opportunities";
import prisma from "@/lib/prismaDB";

type GetOpportunitiesParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  location?: string;
  sort?: OpportunitySort;
};

function serializeOpportunity(opportunity: {
  id: string;
  title: string;
  excerpt: string;
  content: string;
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
}): OpportunityItem {
  return {
    id: opportunity.id,
    title: opportunity.title,
    excerpt: opportunity.excerpt,
    content: opportunity.content,
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

  return opportunity ? serializeOpportunity(opportunity) : null;
}
