import { NextResponse } from "next/server";



import { postWriteSchema, resolvePostContent } from "@/lib/postValidation";
import { assignPublicCode } from "@/lib/contentSlug";
import prisma from "@/lib/prismaDB";

import { buildCategoryFilter } from "@/lib/updatesListing";

import { requireAdmin } from "@/utilities/requireAdmin";

import { formatDateToISOString } from "@/utilities/formatDateToISOString";



export async function POST(request: Request) {

  const { error } = await requireAdmin();

  if (error) return error;



  try {

    const body = await request.json();

    const parsed = postWriteSchema.safeParse(body);



    if (!parsed.success) {

      return NextResponse.json(

        { error: "Validation failed", details: parsed.error.errors },

        { status: 400 }

      );

    }



    const data = parsed.data;

    const { description, contentBlocks } = resolvePostContent(data);

    const postDate = data.postDate ? new Date(data.postDate) : new Date();
    const shortId = await assignPublicCode("post", postDate);



    const post = await prisma.post.create({

      data: {

        title: data.title,

        shortId,

        excerpt: data.excerpt,

        description,

        contentBlocks,

        author: data.author,

        authorImage: data.authorImage,

        categoryId: data.categoryId,

        postDate: formatDateToISOString(data.postDate),

        showInHome: Boolean(data.showInHome),

        postImages: [],

      },

    });



    return NextResponse.json(post, { status: 201 });

  } catch (err) {

    console.error("Failed to create post:", err);

    const message =

      err instanceof Error ? err.message : "Failed to create update";

    return NextResponse.json({ error: message }, { status: 500 });

  }

}



export async function GET(request: Request) {

  try {

    const { searchParams } = new URL(request.url);

    const categoryId = searchParams.get("categoryId");
    const categoryTitle = searchParams.get("categoryTitle");

    const where =
      categoryTitle && categoryTitle.trim() !== ""
        ? buildCategoryFilter(categoryTitle)
        : categoryId && categoryId.trim() !== ""
          ? { categoryId }
          : undefined;



    const posts = await prisma.post.findMany({

      where,

      include: { Category: true },

      orderBy: { createdAt: "desc" },

    });



    return NextResponse.json(posts, { status: 200 });

  } catch (err) {

    console.error("Failed to fetch posts:", err);

    return NextResponse.json(

      { error: "Failed to fetch updates" },

      { status: 500 }

    );

  }

}

