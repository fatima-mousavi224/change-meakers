import { NextResponse } from "next/server";

import { deleteMemberById, updateMemberById } from "@/lib/memberDb";
import { memberUpdateSchema } from "@/lib/memberValidation";
import prisma from "@/lib/prismaDB";
import { requireAdmin } from "@/utilities/requireAdmin";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const member = await prisma.member.findUnique({
      where: { id: params.id },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json(member, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch member:", err);
    return NextResponse.json(
      { error: "Failed to fetch team member" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = memberUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.errors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const updateData: Record<string, unknown> = {};

    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.role !== undefined) updateData.role = data.role?.trim() || null;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.imageObjectPosition !== undefined) {
      updateData.imageObjectPosition = data.imageObjectPosition?.trim() || null;
    }
    if (data.socials !== undefined) updateData.socials = data.socials;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
    if (data.published !== undefined) updateData.published = data.published;

    const member = await updateMemberById(params.id, updateData);

    if (member) {
      return NextResponse.json(member, { status: 200 });
    }

    const refreshed = await prisma.member.findUnique({
      where: { id: params.id },
    });

    return NextResponse.json(refreshed, { status: 200 });
  } catch (err) {
    console.error("Failed to update member:", err);
    const message =
      err instanceof Error ? err.message : "Failed to update team member";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await deleteMemberById(params.id);
    return NextResponse.json(
      { message: "Member deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Failed to delete member:", err);
    const message =
      err instanceof Error ? err.message : "Failed to delete team member";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
