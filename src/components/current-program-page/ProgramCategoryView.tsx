import ProgramPage from "@/components/current-program-page/ProgramPage";
import ProgramRelatedSections from "@/components/current-program-page/ProgramRelatedSections";
import type { UpdatePost } from "@/components/home/latest-updates/LatestUpdateCard";
import type { ProgramCategoryId } from "@/constant/programTabs";

type ProgramCategoryViewProps = {
  activeCategoryId: ProgramCategoryId;
  posts: UpdatePost[];
};

export default function ProgramCategoryView({
  activeCategoryId,
  posts,
}: ProgramCategoryViewProps) {
  return (
    <>
      <ProgramPage activeCategoryId={activeCategoryId} />
      <ProgramRelatedSections
        posts={posts}
        activeCategoryId={activeCategoryId}
      />
    </>
  );
}
