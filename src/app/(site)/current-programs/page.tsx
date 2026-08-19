import { Metadata } from "next";

import ProgramCategoryView from "@/components/current-program-page/ProgramCategoryView";
import {
  getProgramCategory,
  getProgramUpdateCategory,
  resolveProgramCategoryId,
} from "@/constant/programTabs";
import { getLatestPostsByCategory } from "@/lib/getLatestPosts";

type CurrentProgramsPageProps = {
  searchParams: {
    tab?: string;
  };
};

export async function generateMetadata({
  searchParams,
}: CurrentProgramsPageProps): Promise<Metadata> {
  const activeCategoryId = resolveProgramCategoryId(searchParams.tab);
  const category = getProgramCategory(activeCategoryId);

  return {
    title: `${category.label} Programs`,
    description: `${category.label} programs at Change Makers of the World`,
  };
}

export default async function CurrentProgramsPage({
  searchParams,
}: CurrentProgramsPageProps) {
  const activeCategoryId = resolveProgramCategoryId(searchParams.tab);
  const posts = await getLatestPostsByCategory(
    getProgramUpdateCategory(activeCategoryId),
    12,
  );

  return (
    <ProgramCategoryView activeCategoryId={activeCategoryId} posts={posts} />
  );
}
