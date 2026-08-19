import { NextRequest, NextResponse } from "next/server";
import nodemailer, { Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

import prisma from "@/lib/prismaDB";
import type { GetInvolvedFormId } from "@/constant/getInvolvedForms";
import { GET_INVOLVED_FORM_CONFIGS } from "@/constant/getInvolvedForms";

type GetInvolvedRequestBody = {
  formType: GetInvolvedFormId;
  emailSubject: string;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  company?: string;
  position?: string;
};

function formatMessage(body: GetInvolvedRequestBody) {
  const lines = [
    `Form: ${GET_INVOLVED_FORM_CONFIGS[body.formType]?.title ?? body.formType}`,
    "",
    `Name: ${body.firstName} ${body.lastName}`,
    `Email: ${body.email}`,
  ];

  if (body.company?.trim()) {
    lines.push(`Company: ${body.company.trim()}`);
  }

  if (body.position?.trim()) {
    lines.push(`Position: ${body.position.trim()}`);
  }

  lines.push("", `Description:`, body.description.trim());

  return lines.join("\n");
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as GetInvolvedRequestBody;
  const {
    formType,
    firstName,
    lastName,
    email,
    description,
    company,
    position,
    emailSubject,
  } = body;

  if (
    !formType ||
    !GET_INVOLVED_FORM_CONFIGS[formType] ||
    !firstName?.trim() ||
    !lastName?.trim() ||
    !email?.trim() ||
    !description?.trim()
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
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
  const message = formatMessage(body);
  const subject =
    emailSubject ||
    GET_INVOLVED_FORM_CONFIGS[formType]?.emailSubject ||
    "Get Involved form submission";

  const adminMailOptions = (adminEmail: string): Mail.Options => ({
    from: email,
    to: adminEmail,
    subject: `${subject} from ${firstName} ${lastName}`,
    text: message,
  });

  const customerMailOptions: Mail.Options = {
    from: process.env.EMAIL,
    to: email,
    subject: "Thank you for contacting us!",
    text: "Thank you for contacting us! We have received your submission and will get back to you soon.",
  };

  try {
    await Promise.all(
      adminEmails.map(async (adminEmail) => {
        await transport.sendMail(adminMailOptions(adminEmail));
      }),
    );

    await transport.sendMail(customerMailOptions);

    await prisma.customer.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        subject,
        message,
      },
    });

    return NextResponse.json({ message: "Form submitted" });
  } catch (error) {
    console.error("Error sending get involved form:", error);
    return NextResponse.json({ error: "Failed to send form" }, { status: 500 });
  }
}
