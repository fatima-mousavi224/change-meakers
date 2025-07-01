import { getCurrentUser } from "@/utilities/getCurrentUser";
import prisma from "../../../../../lib/prismaDB";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function PUT(request: NextRequest) {
  const { name, password, email, image } = await request.json();
  const currentUser = await getCurrentUser();
  const currentEmail = currentUser?.email;

  try {
    if (currentUser?.email) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedProfile = await prisma.user.update({
        where: { email: currentEmail ?? undefined },
        data: { name, image, email, password: hashedPassword },
      });

      return NextResponse.json({ updatedProfile }, { status: 200 });
    }

    return NextResponse.json({ errors: "User not found" }, { status: 404 });
  } catch (error) {
    console.error("Error updating profile:", error);

    return NextResponse.json(
      { errors: (error as Error).message },
      { status: 500 }
    );
  }
}
