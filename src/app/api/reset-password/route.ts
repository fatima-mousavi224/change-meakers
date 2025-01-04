import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prismaDB"; // Adjust the path to your Prisma client instance

export const POST = async (request: any) => {
  const { email, password } = await request.json();

  try {
   

    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password and clear reset token fields
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST request:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
};
