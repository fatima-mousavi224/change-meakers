import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaDB";

export const POST = async (request: NextRequest) => {
  try {
    const { token } = await request.json();
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return new NextResponse("Invalid or expired token", { status: 400 });
    }

    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Error in POST request:", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
