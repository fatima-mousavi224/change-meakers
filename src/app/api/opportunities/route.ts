import { NextResponse } from "next/server";

import { OPPORTUNITIES_PER_PAGE } from "@/constant/opportunities";
import { getOpportunities } from "@/lib/opportunities";
import {
  opportunityWriteSchema,
  resolveOpportunityContent,
} from "@/lib/opportunityValidation";
import type { OpportunitySort } from "@/constant/opportunities";
import prisma from "@/lib/prismaDB";
import { requireAdmin } from "@/utilities/requireAdmin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
    const limit = Math.max(
      1,
      Number(searchParams.get("limit") ?? OPPORTUNITIES_PER_PAGE) ||
        OPPORTUNITIES_PER_PAGE
    );
    const search = searchParams.get("search") ?? "";
    const category = searchParams.get("category") ?? "All Opportunities";
    const location = searchParams.get("location") ?? "All Locations";
    const sort = (searchParams.get("sort") ?? "recent") as OpportunitySort;

    const data = await getOpportunities({
      page,
      limit,
      search,
      category,
      location,
      sort,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch opportunities:", error);
    return NextResponse.json(
      { error: "Failed to fetch opportunities" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = opportunityWriteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.errors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const { content, contentBlocks } = resolveOpportunityContent(data);

    const opportunity = await prisma.opportunity.create({
      data: {
        title: data.title,
        excerpt: data.excerpt,
        content,
        contentBlocks,
        category: data.category,
        location: data.location,
        image: data.image,
        detailImage: data.detailImage || null,
        videoUrl: null,
        deadline: new Date(data.deadline),
        applicationUrl: data.applicationUrl || null,
        resourceProvider: data.resourceProvider || null,
        mainSource: data.mainSource || null,
        postedDate: data.postedDate ? new Date(data.postedDate) : null,
        published: data.published ?? true,
      },
    });

    return NextResponse.json(opportunity, { status: 201 });
  } catch (err) {
    console.error("Failed to create opportunity:", err);
    return NextResponse.json(
      { error: "Failed to create opportunity" },
      { status: 500 }
    );
  }
}
