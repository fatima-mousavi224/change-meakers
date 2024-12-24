import { NextResponse } from 'next/server';
import prisma from '@/lib/prismaDB';
import { getCurrentUser } from '@/utilities/getCurrentUser';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { title} =
    body;
  if (!title) {
    return new Response('all fields are required!', { status: 400 });
  }

  // const user = await getCurrentUser();
  // if (user?.role !== 'ADMIN') {
  //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  // }

  const post = await prisma.category.findUnique({ where: { id: params.id } });
  if (post) {
    const updatedCategory = await prisma.category.update({
      where: { id: params.id },
      data: {
        title
      }
    });

    return NextResponse.json(updatedCategory);
  } else {
    return new Response('Post not found', { status: 404 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  // const currentUser = await getCurrentUser();
  // if (!currentUser || currentUser.role !== 'ADMIN') {
  //   return new Response('Unauthorized', { status: 401 });
  // }
  console.log(params.id);
  
  const category = await prisma.category.delete({ where: { id: params.id } });

  return NextResponse.json(category, { status: 204 });
}
