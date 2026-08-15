import { Metadata } from "next";
import { notFound } from "next/navigation";

import ProgramCategoryView from "@/components/current-program-page/ProgramCategoryView";
import {
  getProgramCategory,
  isProgramCategoryId,
  type ProgramCategoryId,
} from "@/constant/programTabs";
import { getLatestPosts } from "@/lib/getLatestPosts";

type ProgramCategoryPageProps = {
  params: {
    category: string;
  };
};

export function generateStaticParams() {
  return [{ category: "girls-education" }, { category: "advocacy" }];
}

export function generateMetadata({
  params,
}: ProgramCategoryPageProps): Metadata {
  if (!isProgramCategoryId(params.category)) {
    return { title: "Programs" };
  }

  const category = getProgramCategory(params.category);

  return {
    title: `${category.label} Programs`,
    description: `${category.label} programs at Change Makers of the World`,
  };
}

export default async function ProgramCategoryPage({
  params,
}: ProgramCategoryPageProps) {
  if (
    !isProgramCategoryId(params.category) ||
    params.category === "youth-empowerment"
  ) {
    notFound();
  }

  const posts = await getLatestPosts(12);

  return (
    <ProgramCategoryView
      activeCategoryId={params.category as ProgramCategoryId}
      posts={posts}
    />
  );
}
