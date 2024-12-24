import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/prismaDB";
import { getCurrentUser } from "@/utilities/getCurrentUser";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  try {
    const body = await request.json();

    const { email } = body;
    if (!email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const emailBody = `<img src="https://res.cloudinary.com/diyxhx8mz/image/upload/v1725367950/new-logo_znadff.jpg" alt="You Change Makers of the World" style="width: 80px; height: auto; margin-bottom: 20px; display:block;" />
  
<h1>
Verify Your Email Address
</h1>

Hi dear ${user?.name || "User"},

<p>Thank you for signing up! To complete the registration process, please verify your email address by entering the verification code below:</p>

<h2>Your Verification Code: [ ${verifyCode} ]</h2>

<p>This code is valid for the next 10 minutes. If you didn’t request this, please ignore this email.</p>

<p>We’re excited to have you on board!</p>

Regards, <br/>
Your Change Makers of the World Team
`;
    await prisma.code.create({ data: { verifyCode } });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      html: emailBody,
    });

    return NextResponse.json({ message: "Verification code sent" });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
