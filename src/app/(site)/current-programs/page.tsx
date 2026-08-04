import { Metadata } from "next";

import ProgramCategoryView from "@/components/current-program-page/ProgramCategoryView";
import { getProgramCategory } from "@/constant/programTabs";
import { getLatestPosts } from "@/lib/getLatestPosts";

const category = getProgramCategory("youth-empowerment");

export const metadata: Metadata = {
  title: `${category.label} Programs`,
  description: `${category.label} programs at Change Makers of the World`,
};

export default async function CurrentProgramsPage() {
  const posts = await getLatestPosts(12);

  return (
    <ProgramCategoryView activeCategoryId="youth-empowerment" posts={posts} />
  );
}
