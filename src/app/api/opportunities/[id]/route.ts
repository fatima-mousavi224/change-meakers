import { NextResponse } from "next/server";

import {
  getOpportunityById,
  getOpportunityByIdForAdmin,
} from "@/lib/opportunities";
import { assignPublicCode } from "@/lib/contentSlug";
import {
  opportunityUpdateSchema,
  resolveOpportunityContent,
} from "@/lib/opportunityValidation";
import prisma from "@/lib/prismaDB";
import { requireAdmin } from "@/utilities/requireAdmin";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdminRequest = searchParams.get("admin") === "true";

    if (isAdminRequest) {
      const { error } = await requireAdmin();
      if (error) return error;

      const opportunity = await getOpportunityByIdForAdmin(params.id);
      if (!opportunity) {
        return NextResponse.json(
          { error: "Opportunity not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(opportunity, { status: 200 });
    }

    const opportunity = await getOpportunityById(params.id);

    if (!opportunity) {
      return NextResponse.json(
        { error: "Opportunity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(opportunity, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch opportunity:", err);
    return NextResponse.json(
      { error: "Failed to fetch opportunity" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = opportunityUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.errors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const updateData: Record<string, unknown> = { ...data };

    const existingOpportunity = await prisma.opportunity.findUnique({
      where: { id: params.id },
      select: { shortId: true, postedDate: true, createdAt: true },
    });

    if (existingOpportunity && !existingOpportunity.shortId) {
      updateData.shortId = await assignPublicCode(
        "opportunity",
        existingOpportunity.postedDate ?? existingOpportunity.createdAt,
      );
    }

    if (data.deadline) {
      updateData.deadline = new Date(data.deadline);
    }

    if (data.postedDate !== undefined) {
      updateData.postedDate = data.postedDate
        ? new Date(data.postedDate)
        : null;
    }

    if (data.content !== undefined || data.contentBlocks !== undefined) {
      const resolved = resolveOpportunityContent({
        content: data.content,
        contentBlocks: data.contentBlocks,
      });
      updateData.content = resolved.content;
      updateData.contentBlocks = resolved.contentBlocks;
    }

    if (data.videoUrl !== undefined) {
      updateData.videoUrl = null;
    }

    const opportunity = await prisma.opportunity.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(opportunity, { status: 200 });
  } catch (err) {
    console.error("Failed to update opportunity:", err);
    return NextResponse.json(
      { error: "Failed to update opportunity" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await prisma.opportunity.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Opportunity deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Failed to delete opportunity:", err);
    return NextResponse.json(
      { error: "Failed to delete opportunity" },
      { status: 500 }
    );
  }
}
