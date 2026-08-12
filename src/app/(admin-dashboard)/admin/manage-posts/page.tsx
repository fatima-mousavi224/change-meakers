import React from "react";
import ManagePostTable from "./ManagePostTable";
import { Metadata } from "next";
import prisma from "@/lib/prismaDB";

export const metadata: Metadata = {
  title: "Manage Updates",
  description: "Manage updates shown on the /updates page",
};

export default async function ManagePostsPage() {
  const posts = await prisma.post.findMany({
    include: { Category: true },
    orderBy: { createdAt: "desc" },
  });
  const categories = await prisma.category.findMany();

  return (
    <div className=" ">
      <ManagePostTable posts={posts} categories={categories} />
    </div>
  );
}

export const revalidate = 0;
