import SiteContainer from "@/components/common/SiteContainer";
import type { UpdatePost } from "@/components/home/latest-updates/LatestUpdateCard";
import OurInitiatives from "@/components/home/our-initiatives/OurInitiatives";
import LatestUpdates from "@/components/home/latest-updates/LatestUpdates";
import {
  getProgramRelatedInitiativeIds,
  getProgramUpdateCategory,
  type ProgramCategoryId,
} from "@/constant/programTabs";

type ProgramRelatedSectionsProps = {
  posts: UpdatePost[];
  activeCategoryId: ProgramCategoryId;
};

export default function ProgramRelatedSections({
  posts,
  activeCategoryId,
}: ProgramRelatedSectionsProps) {
  const relatedInitiativeIds = getProgramRelatedInitiativeIds(activeCategoryId);

  return (
    <SiteContainer className="pb-4">
      <OurInitiatives
        title="Related Initiatives"
        initiativeIds={relatedInitiativeIds}
        className="py-0 pb-6 pt-12 lg:pb-8 lg:pt-16"
      />
      <LatestUpdates
        title="Related Updates"
        posts={posts}
        expandCategory={getProgramUpdateCategory(activeCategoryId)}
        viewAllText="View More"
        collapseText="Show Less"
        viewAllMode="expand"
        className="py-0 pb-0 pt-6 lg:pt-8"
        viewAllClassName="mt-6"
      />
    </SiteContainer>
  );
}
