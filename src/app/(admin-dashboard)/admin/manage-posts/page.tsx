import React from "react";
import ManagePostTable from "./ManagePostTable";
import { Metadata } from "next";
import prisma from "@/lib/prismaDB";

export const metadata: Metadata = {
  title: "Manage Posts",
  description: "Manage all the posts in your blog",
};

export default async function ManagePostsPage() {
  const posts = await prisma.post.findMany();
  const categories = await prisma.category.findMany();

  return (
    <div className=" ">
      <ManagePostTable posts={posts} categories={categories} />
    </div>
  );
}

export const revalidate = 0;
