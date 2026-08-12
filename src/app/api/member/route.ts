import { NextResponse } from "next/server";

import { memberWriteSchema } from "@/lib/memberValidation";
import prisma from "@/lib/prismaDB";
import { requireAdmin } from "@/utilities/requireAdmin";

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = memberWriteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.errors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const member = await prisma.member.create({
      data: {
        slug: data.slug,
        name: data.name,
        role: data.role?.trim() || null,
        bio: data.bio,
        image: data.image,
        imageObjectPosition: data.imageObjectPosition?.trim() || null,
        socials: data.socials ?? [],
        sortOrder: data.sortOrder ?? 0,
        published: data.published ?? true,
        position: data.role?.trim() || "",
        description: data.bio,
        avatar: [],
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (err) {
    console.error("Failed to create member:", err);
    const message =
      err instanceof Error ? err.message : "Failed to create team member";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const members = await prisma.member.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json(members, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch members:", err);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}
