import { getServerSession } from "next-auth";
import prisma from "@/lib/prismaDB";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

const getSession = async () => {
  return await getServerSession(authOptions);
};

export const getCurrentUser = async () => {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return null;
    }
    const currentUser = await prisma?.user.findUnique({
      where: { email: session.user.email },
    });
    if (!currentUser) {
      return null;
    }

    return currentUser;
  } catch (error: any) {
    console.log(error);

    return null;
  }
};
