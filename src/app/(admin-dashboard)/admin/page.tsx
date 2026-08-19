import Summary from "./Summary";
import { Metadata } from "next";
import prisma from "@/lib/prismaDB";
import { getAdminMemberCount } from "@/lib/adminMembers";
import { getCurrentUser } from "@/utilities/getCurrentUser";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your blog and team in one place",
};

export default async function AdminDashboard() {
  const currentUser = await getCurrentUser();

  const [users, posts, numMembers, opportunities] = await Promise.all([
    prisma.user.findMany(),
    prisma.post.findMany(),
    getAdminMemberCount(),
    prisma.opportunity.findMany(),
  ]);

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold text-primary-50 mb-10">
        Hi there 👋 welcome!
      </h1>
      <Summary
        numUsers={users.length}
        numPosts={posts.length}
        numMembers={numMembers}
        numAdmins={users.filter((user) => user.role === "ADMIN").length}
        numOpportunities={opportunities.length}
        currentUser={currentUser}
      />
    </div>
  );
}

export const revalidate = 0;
