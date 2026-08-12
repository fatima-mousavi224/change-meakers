import { getCurrentUser } from "@/utilities/getCurrentUser";
import prisma from "../../../../../lib/prismaDB";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function PUT(request: NextRequest) {
  const { name, password, email, image } = await request.json();
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ errors: "Unauthorized" }, { status: 401 });
  }

  try {
    const updateData: {
      name?: string;
      email?: string;
      image?: string | null;
      password?: string;
    } = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (image !== undefined) updateData.image = image;
    if (password && password.trim().length > 0) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedProfile = await prisma.user.update({
      where: { email: currentUser.email },
      data: updateData,
    });

    return NextResponse.json({ updatedProfile }, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);

    return NextResponse.json(
      { errors: (error as Error).message },
      { status: 500 }
    );
  }
}
