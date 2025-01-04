import { NextResponse } from "next/server";
import prisma from "@/lib/prismaDB";
import { getCurrentUser } from "@/utilities/getCurrentUser";
import { formatDateToISOString } from "@/utilities/formatDateToISOString";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "User is not Admin or User not found!" },
        { status: 404 }
      );
    }
    const body = await request.json();
    const { title, description, postImages, postDate, categoryId } = body;

    if (!title || !description || !postImages) {
      return NextResponse.json(
        { error: "Missing required fields!" },
        { status: 400 }
      );
    }
    const formattedPostDate = formatDateToISOString(postDate);
    const post = await prisma.post.create({
      data: {
        ...body,
        postDate: formattedPostDate,
        categoryId: categoryId,
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.log(error.message);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    // Parse the query string from the URL
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    // Check if categoryId is valid and not null or empty
    if (categoryId && categoryId.trim() !== "") {
      const posts = await prisma.post.findMany({
        where: {
          categoryId, // categoryId is a string and not null
        },
        include: {
          Category: true,
        },
      });

      return NextResponse.json(posts, { status: 200 });
    }

    const posts = await prisma.post.findMany({
      include: {
        Category: true,
      },
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
