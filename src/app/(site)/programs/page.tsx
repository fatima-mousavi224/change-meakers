import { Metadata } from "next";

import ProgramCategoryView from "@/components/current-program-page/ProgramCategoryView";
import {
  getProgramCategory,
  getProgramUpdateCategory,
} from "@/constant/programTabs";
import { getLatestPostsByCategory } from "@/lib/getLatestPosts";

export async function generateMetadata(): Promise<Metadata> {
  const category = getProgramCategory("youth-empowerment");

  return {
    title: `${category.label} Programs`,
    description: `${category.label} programs at Change Makers of the World`,
  };
}

export default async function ProgramsPage() {
  const posts = await getLatestPostsByCategory(
    getProgramUpdateCategory("youth-empowerment"),
    12,
  );

  return (
    <ProgramCategoryView activeCategoryId="youth-empowerment" posts={posts} />
  );
}
