import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import nodemailer, { Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import prisma from "@/lib/prismaDB"; // Adjust the path to your Prisma client instance

export const POST = async (request: NextRequest) => {
  const { email } = await request.json();

  try {
    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return NextResponse.json({ message: "Email not found" }, { status: 400 });
    }

    // Generate reset token and expiry time
    const resetToken = crypto.randomBytes(20).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const passwordResetExpires = new Date(Date.now() + 600000); // 10 minutes

    // Update user with the reset token and expiry time
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: passwordResetToken,
        resetTokenExpiry: passwordResetExpires,
      },
    });

    const resetUrl = `https://www.cmworld.org/reset-password/${resetToken}`;
    const body = `<img src="https://res.cloudinary.com/diyxhx8mz/image/upload/v1725367950/new-logo_znadff.jpg" alt="You Change Makers of the World" style="width: 80px; height: auto; margin-bottom: 20px; display:block;" />
  
<h1>
Password Reset Request
</h1>

Hi dear ${existingUser.name},

<p>We understand you're having trouble logging into your account. We received a request that you forgot your password. If that was you, you can quickly regain access or reset your password now.</p>

<a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #E7E5E4; color: #000; text-decoration: none; border-radius: 200px; font-weight: medium; display: inline-block; ">Reset Your Password
</a>

<p>Please note that this password reset link will expire after 10 minutes for security reasons.</p>

<p>If you didn't request a login link or password reset, you can ignore this message. For more information on why you might have received it, feel free to contact us at <a href='mailto:info@cmworld.org' target="_blank">info@cmworld.org</a> or via WhatsApp at <a href="https://wa.me/14172685815" target="_blank" rel="noopener noreferrer">+1 (417) 268-5815</a>.</p>

<p>Please note, only those who know your password or click the login link in this email can access your account.</p>


Regards, <br/>
Your Change Makers of the World Team
`;

    // Configure the email transport
    const transport: Transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions: Mail.Options = {
      from: "info@cmworld.org",
      to: email,
      subject: "Reset Password",
      html: body,
    };

    // Send the email
    await new Promise<string>((resolve, reject) => {
      transport.sendMail(mailOptions, async (err) => {
        if (err) {
          // Reset the token fields if sending the email fails
          await prisma.user.update({
            where: { email },
            data: {
              resetToken: null,
              resetTokenExpiry: null,
            },
          });
          reject(err.message);
        } else {
          resolve("Email sent");
        }
      });
    });

    return NextResponse.json({ message: "Email sent" });
  } catch (error) {
    console.error("Error in POST request:", error);

    return NextResponse.json({ error }, { status: 500 });
  }
};
