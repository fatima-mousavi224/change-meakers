import prisma from "@/lib/prismaDB";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, password, verificationCode } = body;
    if (!name || !email || !password || !verificationCode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Email Verification",
        text: `Your verification code is ${code}`,
      });

      return NextResponse.json({ message: "Verification code sent" });
    } else {
      const newUser = await prisma.user.create({
        data: { name, email, password: hashedPassword },
      });

      return NextResponse.json({ user: newUser });
    }
  } catch (error) {
    return NextResponse.json({ error });
  }
}
