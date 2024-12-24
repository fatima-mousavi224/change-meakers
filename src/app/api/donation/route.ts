import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prismaDB';



export async function POST(request: NextRequest) {
  try {
    const {
      first_name,
      last_name,
      email,
      donationFrequency,
      donationType,
      amount
    } = await request.json();
    console.log(  first_name,
      last_name, email, donationFrequency, donationType, amount);
    


    const res = await prisma.paymentInfo.create({
      data: {
        amount,
        first_name,
        last_name,
        email,
        donationFrequency,
        donationType
      }
    });

    return NextResponse.json(res);
  } catch (error) {
    console.error('Error creating payment info:', error);

    return NextResponse.json(
      { message: 'Internal Server Error:)' },
      { status: 500 }
    );
  }
}
