import { NextResponse } from "next/server";
import prisma from "@/lib/prismaDB";
import { getCurrentUser } from "@/utilities/getCurrentUser";
import { formatDateToISOString } from "@/utilities/formatDateToISOString";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const {
    title,
    description,
    postImages,
    authorImage,
    author,
    postDate,
    categoryId,
  } = body;
  if (
    !title ||
    !author ||
    !authorImage ||
    !description ||
    !postImages ||
    !postDate ||
    !categoryId
  ) {
    return new Response("all fields are required!", { status: 400 });
  }
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  const formattedPostDate = formatDateToISOString(postDate);
  if (post) {
    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        title,
        description,
        postImages,
        authorImage,
        author,
        postDate: formattedPostDate,
        categoryId,
      },
    });

    return NextResponse.json(updatedPost);
  } else {
    return new Response("Post not found", { status: 404 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }
  await prisma.post.delete({ where: { id: params.id } });

  return NextResponse.json("deleted", { status: 204 });
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }
  const post = await prisma.post.findMany({ where: { id: params.id } });

  return NextResponse.json(post, { status: 200 });
}
