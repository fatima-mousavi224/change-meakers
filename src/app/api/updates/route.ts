import { NextResponse } from "next/server";

import { UPDATES_PER_PAGE } from "@/constant/updatesListing";

export const dynamic = "force-dynamic";
import type { UpdateSort } from "@/constant/updatesListing";
import { getUpdates } from "@/lib/updatesListing";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
    const limit = Math.max(
      1,
      Number(searchParams.get("limit") ?? UPDATES_PER_PAGE) || UPDATES_PER_PAGE,
    );
    const search = searchParams.get("search") ?? "";
    const category = searchParams.get("category") ?? "All Updates";
    const sort = (searchParams.get("sort") ?? "recent") as UpdateSort;

    const data = await getUpdates({
      page,
      limit,
      search,
      category,
      sort,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch updates:", error);
    return NextResponse.json(
      { error: "Failed to fetch updates" },
      { status: 500 },
    );
  }
}
