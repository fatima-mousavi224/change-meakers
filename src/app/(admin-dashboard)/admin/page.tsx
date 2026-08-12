import Summary from "./Summary";
import { Metadata } from "next";
import prisma from "@/lib/prismaDB";
import { getCurrentUser } from "@/utilities/getCurrentUser";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your blog and team in one place",
};

export default async function AdminDashboard() {
  const users = await prisma.user.findMany();
  const posts = await prisma.post.findMany();
  const members = await prisma.member.findMany();
  const donations = await prisma.paymentInfo.findMany();
  const opportunities = await prisma.opportunity.findMany();
  const currentUser = await getCurrentUser();

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold text-primary-50 mb-10">
        Hi there 👋 welcome!
      </h1>
      <Summary
        numUsers={users.length}
        numPosts={posts.length}
        numMembers={members.length}
        numAdmins={users.filter((user) => user.role === "ADMIN").length}
        numOpportunities={opportunities.length}
        donations={donations}
        currentUser={currentUser}
      />
    </div>
  );
}

export const revalidate = 0;
