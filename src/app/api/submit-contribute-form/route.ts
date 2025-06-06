import { NextRequest, NextResponse } from "next/server";
import nodemailer, { Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const data = await request.json();
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

  const htmlContent = `
    <h2>New Contributor Application Submission</h2>
    <p><strong>Full Name:</strong> ${data.firstName} ${data.lastName}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Date of Birth:</strong> ${data.date_birth}</p>
    <p><strong>Gender:</strong> ${data.gender}</p>
    <p><strong>Country:</strong> ${data.country}</p>
    <p><strong>Nationality:</strong> ${data.nationality}</p>
    <p><strong>Education Status:</strong> ${data.educationStatus}</p>
    <p><strong>Education Level:</strong> ${data.educationLevel}</p>
    <p><strong>Professional Role:</strong> ${data.professionalRole}</p>
    <p><strong>Program:</strong> ${data.program}</p>
    <p><strong>Field of Study:</strong> ${data.fieldOfStudy}</p>
    <p><strong>English Level:</strong> ${data.englishLevel}</p>
    <p><strong>Interest in Teaching:</strong> ${data.interestTeaching}</p>
    <p><strong>Interest Area:</strong> ${data.interestArea}</p>
    <p><strong>Message:</strong> ${data.message}</p>
    <p><strong>Referred:</strong> ${data.referred}</p>
    <p><strong>Notes:</strong> ${data.notes}</p>
    <p><strong>Employment Status:</strong> ${data.employmentStatus}</p>
    <p><strong>Consent:</strong> ${data.consent}</p>
    <p><strong>Signature Name:</strong> ${data.signatureName}</p>
    <p><strong>Signature Date:</strong> ${data.signatureDate}</p>
    <p><strong>ID Photo:</strong> <a href="${
      data.idPhotoUrl
    }" target="_blank">View Photo</a></p>
    <p><strong>Identity Document(s):</strong> ${
      Array.isArray(data.identityDocsUrls)
        ? data.identityDocsUrls
            .map(
              (url: string) =>
                `<a href="${url}" target="_blank">View Document</a>`
            )
            .join(", ")
        : `<a href="${data.identityDocsUrls}" target="_blank">View Document</a>`
    }</p>
    <p><strong>Supporting Document(s):</strong> ${
      Array.isArray(data.supportingDocsUrls)
        ? data.supportingDocsUrls
            .map(
              (url: string) =>
                `<a href="${url}" target="_blank">View Document</a>`
            )
            .join(", ")
        : `<a href="${data.supportingDocsUrls}" target="_blank">View Document</a>`
    }</p>
  `;

  const adminMailOptions = (adminEmail: string): Mail.Options => ({
    from: process.env.EMAIL,
    to: adminEmail,
    subject: `New Contributor Application from ${data.firstName} ${data.lastName}`,
    html: htmlContent,
  });

  const customerMailOptions: Mail.Options = {
    from: process.env.EMAIL,
    to: data.email,
    subject: "Thank you for contacting us!",
    text: "Thank you for contacting us! We have received your application and will get back to you soon.",
  };

  try {
    await Promise.all(
      adminEmails.map((adminEmail) =>
        transport.sendMail(adminMailOptions(adminEmail))
      )
    );
    await transport.sendMail(customerMailOptions);

    return NextResponse.json({ message: "Emails sent" });
  } catch (err) {
    console.error("Error sending email:", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
