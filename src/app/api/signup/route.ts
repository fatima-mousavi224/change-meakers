import prisma from "@/lib/prismaDB";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, password, verifyCode } = body;
    if (!name || !email || !password || !verifyCode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const code = await prisma.code.findFirst({ where: { verifyCode } });
    if (!code) {
      return NextResponse.json({
        message: "Invalid verification code",
        status: 400,
      });
    } else {
      await prisma.code.delete({ where: { id: code.id } });
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        const newUser = await prisma.user.create({
          data: { name, email, password: hashedPassword },
        });

        return NextResponse.json({ user: newUser, status: 201 });
      } else {
        return NextResponse.json({ message: "User already exists" });
      }
    }
  } catch (error) {
    return NextResponse.json({ error });
  }
}
