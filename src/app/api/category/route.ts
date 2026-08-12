import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaDB';
import { getCurrentUser } from '@/utilities/getCurrentUser';

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "User is not Admin or User not found!" },
        { status: 401 }
      );
    }
    const body = await request.json();
    const { title } =
      body;

    if (!title) {
      return NextResponse.json(
        { error: 'Missing required fields!' },
        { status: 400 }
      );
    }
    const category = await prisma.category.create({
      data: {
        title,
      }
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    // const currentUser = await getCurrentUser();

    // if (!currentUser || currentUser.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: 'User is not Admin or User not found!' },
    //     { status: 404 }
    //   );
    // }
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories, { status: 201 });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}