import { notFound } from "next/navigation";

import SiteContainer from "@/components/common/SiteContainer";
import OpportunityContentBlocks from "@/components/opportunities/OpportunityContentBlocks";
import OpportunityShareFooter from "@/components/opportunities/OpportunityShareFooter";
import type { UpdateDetailItem } from "@/constant/updatesDetail";
import { OPPORTUNITY_DETAIL_SECTION_CLASS } from "@/constant/opportunityDetailLayout";
import { getUpdateById } from "@/lib/updateDetails";
import UpdateDetailHero from "./UpdateDetailHero";

type UpdateDetailsProps = {
  update: UpdateDetailItem;
};

export default function UpdateDetails({ update }: UpdateDetailsProps) {
  const sharePath = `/updates/${update.id}`;

  return (
    <>
      <UpdateDetailHero update={update} />

      <SiteContainer
        as="main"
        className={`pb-12 pt-8 lg:pt-10 ${OPPORTUNITY_DETAIL_SECTION_CLASS}`}
      >
        <article className="w-full">
          <OpportunityContentBlocks blocks={update.contentBlocks} />

          <OpportunityShareFooter
            title={update.title}
            sharePath={sharePath}
            shareLabel="SHARE"
          />
        </article>
      </SiteContainer>
    </>
  );
}

export async function loadUpdateDetails(id: string) {
  const update = await getUpdateById(id);

  if (!update) {
    notFound();
  }

  return update;
}
