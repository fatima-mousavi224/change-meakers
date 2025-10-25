/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextRequest, NextResponse } from "next/server";
import nodemailer, { Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import prisma from "@/lib/prismaDB";

interface EmailRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { firstName, lastName, email, message, subject }: EmailRequestBody =
    await request.json();

  if (!firstName || !lastName || !email || !message) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const transport: Transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

  const adminMailOptions = (adminEmail: string): Mail.Options => ({
    from: process.env.EMAIL,
    to: adminEmail,
    subject: `Message from ${firstName} (${lastName}) ${email}`,
    text: `Subject: ${subject}\n\nMessage: ${message}`,
  });

  const customerMailOptions: Mail.Options = {
    from: process.env.EMAIL, // Use a different from address for the customer
    to: email,
    subject: "Thank you for contacting us!",
    text: "Thank you for contacting us! We will get back to you as soon as possible.",
  };

  try {
    // Send emails to all admins
    await Promise.all(
      adminEmails.map(async (adminEmail) => {
        await transport.sendMail(adminMailOptions(adminEmail));
      })
    );

    // Send email to the customer
    await transport.sendMail(customerMailOptions);

    // Save customer info to the database
    await prisma.customer.create({
      data: {
        firstName,
        email,
        lastName,
        message,
        subject,
      },
    });

    return NextResponse.json({ message: "Emails sent" });
  } catch (err) {
    console.error("Error sending email:", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
