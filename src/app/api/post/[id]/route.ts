import { NextResponse } from "next/server";



import { postUpdateSchema, resolvePostContent } from "@/lib/postValidation";

import prisma from "@/lib/prismaDB";

import { requireAdmin } from "@/utilities/requireAdmin";

import { formatDateToISOString } from "@/utilities/formatDateToISOString";



type RouteContext = {

  params: {

    id: string;

  };

};



export async function GET(_request: Request, { params }: RouteContext) {

  const { error } = await requireAdmin();

  if (error) return error;



  try {

    const post = await prisma.post.findUnique({

      where: { id: params.id },

      include: { Category: true },

    });



    if (!post) {

      return NextResponse.json({ error: "Update not found" }, { status: 404 });

    }



    return NextResponse.json(post, { status: 200 });

  } catch (err) {

    console.error("Failed to fetch post:", err);

    return NextResponse.json(

      { error: "Failed to fetch update" },

      { status: 500 }

    );

  }

}



export async function PATCH(request: Request, { params }: RouteContext) {

  const { error } = await requireAdmin();

  if (error) return error;



  try {

    const body = await request.json();

    const parsed = postUpdateSchema.safeParse(body);



    if (!parsed.success) {

      return NextResponse.json(

        { error: "Validation failed", details: parsed.error.errors },

        { status: 400 }

      );

    }



    const data = parsed.data;

    const updateData: Record<string, unknown> = {};



    if (data.title !== undefined) updateData.title = data.title;

    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;

    if (data.author !== undefined) updateData.author = data.author;

    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;

    if (data.showInHome !== undefined) {

      updateData.showInHome = Boolean(data.showInHome);

    }

    if (data.authorImage !== undefined) updateData.authorImage = data.authorImage;

    if (data.postDate) {

      updateData.postDate = formatDateToISOString(data.postDate);

    }



    if (data.description !== undefined || data.contentBlocks !== undefined) {

      const resolved = resolvePostContent({

        description: data.description,

        contentBlocks: data.contentBlocks,

      });

      updateData.description = resolved.description;

      updateData.contentBlocks = resolved.contentBlocks;

    }



    if (data.contentBlocks !== undefined) {

      updateData.postImages = [];

    }



    const post = await prisma.post.update({

      where: { id: params.id },

      data: updateData,

    });



    return NextResponse.json(post, { status: 200 });

  } catch (err) {

    console.error("Failed to update post:", err);

    const message =

      err instanceof Error ? err.message : "Failed to update update";

    return NextResponse.json({ error: message }, { status: 500 });

  }

}



export async function DELETE(_request: Request, { params }: RouteContext) {

  const { error } = await requireAdmin();

  if (error) return error;



  try {

    await prisma.post.delete({ where: { id: params.id } });

    return NextResponse.json(

      { message: "Update deleted successfully" },

      { status: 200 }

    );

  } catch (err) {

    console.error("Failed to delete post:", err);

    return NextResponse.json(

      { error: "Failed to delete update" },

      { status: 500 }

    );

  }

}

