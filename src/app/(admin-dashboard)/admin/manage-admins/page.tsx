import React from "react";
import prisma from "@/lib/prismaDB";
import ManageAdminTable from "./ManageAdminTable";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/utilities/getCurrentUser";

export default async function ManageTeamMembersPage() {
  const users = await prisma.user.findMany();
  const currentUser = await getCurrentUser();
  const allUsers = users.filter((user) => user.email !== currentUser?.email);
  async function toggleAdminRole(userId: string) {
    "use server";

    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error("User not found");

      const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";

      await prisma.user.update({
        where: { id: userId },
        data: { role: newRole },
      });

      revalidatePath("/admin");

      return { success: true, message: `User role updated to ${newRole}` };
    } catch (error) {
      console.error("Error toggling admin role:", error);

      return { success: false, message: "Failed to update user role" };
    }
  }

  

  return (
    <div>
      <ManageAdminTable
        users={allUsers}
        handleToggleAdminRole={toggleAdminRole}
      />
    </div>
  );
}
