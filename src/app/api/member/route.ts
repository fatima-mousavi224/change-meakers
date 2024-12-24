import { NextResponse } from "next/server";
import prisma from "@/lib/prismaDB";
import { getCurrentUser } from "@/utilities/getCurrentUser";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "User is not Admin or User not found!" },
        { status: 404 }
      );
    }
    const body = await request.json();
    const { name, position, description, avatar } = body;

    if (!name || !description || !position || !avatar) {
      return NextResponse.json(
        { error: "Missing required fields!" },
        { status: 400 }
      );
    }
    const member = await prisma.member.create({
      data: {
        name,
        position,
        description,
        avatar,
      },
    });

    console.log(member);

    return NextResponse.json(member, { status: 201 });
  } catch (error: any) {
    console.log(error.message);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
