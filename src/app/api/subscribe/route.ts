import { NextRequest, NextResponse } from 'next/server';
import nodemailer, { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import prisma from '@/lib/prismaDB';

interface EmailRequestBody {
  email: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { email }: EmailRequestBody = await request.json();

  if (!email) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }
  console.log("pass", process.env.EMAIL_PASSWORD);
  
  const transport: Transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user:process.env.EMAIL,
      pass:process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions: Mail.Options = {
    from: process.env.EMAIL,
    subject: `Welcome to Change Makers of the World`,
    text: 'Thank you for subscribing to our newsletter!',
    to: email
  };

  const sendMailPromise = (): Promise<string> =>
    new Promise<string>((resolve, reject) => {
      transport.sendMail(mailOptions, function (err) {
        if (!err) {
          resolve('Email sent');
        } else {
          reject(err.message);
        }
      });
    });

  try {
    await sendMailPromise();
    await prisma.subscribers.create({
      data: {
        email
      }
    });
    return NextResponse.json({ message: 'Email sent' });
  } catch (err) {
    console.log("Error: ", err);
    
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
