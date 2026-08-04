import { NextResponse } from "next/server";

import { OPPORTUNITIES_PER_PAGE } from "@/constant/opportunities";
import { getOpportunities } from "@/lib/opportunities";
import type { OpportunitySort } from "@/constant/opportunities";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
    const limit = Math.max(
      1,
      Number(searchParams.get("limit") ?? OPPORTUNITIES_PER_PAGE) ||
        OPPORTUNITIES_PER_PAGE,
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
      { status: 500 },
    );
  }
}
