import Banner from "@/components/common/Banner";
import BlogPosts from "@/components/updates/UpdatePosts";
import prisma from "@/lib/prismaDB";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Updates",
  description: "Updates of Change Makers of the World",
};

export default async function UpdatePage() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Category: true,
    },
  });

  const categories = await prisma.category.findMany({});

  return (
    <main>
      <Suspense fallback={"loading..."}>
        <section className="mt-4 max-w-screen-2xl px-4 mx-auto">
          <Banner>
            <span>Updates</span>
          </Banner>
          <div className="flex items-center justify-center flex-col gap-2 py-14">
            <div className="bg-primary-50 bg-opacity-10 rounded-full w-fit px-4 h-10 flex items-center justify-center gap-4">
              <span className="size-2 rounded-full bg-primary-50"></span>
              <p className="text-primary-50 font-semibold text-base">
                News and Stories
              </p>
            </div>
            <h2 className="lg:text-4xl text-lg font-semibold text-center">
              Our Latest Updates
            </h2>
          </div>
          <BlogPosts posts={posts} categories={categories} />
        </section>
      </Suspense>
    </main>
  );
}
