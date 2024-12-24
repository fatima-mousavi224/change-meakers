import { NextResponse } from "next/server";
import prisma from "@/lib/prismaDB";
import { getCurrentUser } from "@/utilities/getCurrentUser";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { name, position, description, avatar } = body;
  if (!name || !description || !position || !avatar) {
    return new Response("all fields are required!", { status: 400 });
  }
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const member = await prisma.member.findUnique({ where: { id: params.id } });
  if (member) {
    const updatedPost = await prisma.member.update({
      where: { id: params.id },
      data: { name, position, description, avatar },
    });

    return NextResponse.json(updatedPost);
  } else {
    return new Response("Member not found", { status: 404 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }
  const member = await prisma.member.delete({ where: { id: params.id } });

  return NextResponse.json(member, { status: 204 });
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }
  const member = await prisma.member.findMany({ where: { id: params.id } });

  return NextResponse.json(member[0], { status: 200 });
}
