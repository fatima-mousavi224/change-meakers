import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismaDB";
import { getCurrentUser } from "@/utilities/getCurrentUser";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return new Response("Unauthorized", { status: 401 });
    }
    const user = await prisma.user.delete({ where: { id: params.id } });

    return NextResponse.json(user, { status: 204 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
