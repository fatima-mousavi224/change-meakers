import { notFound } from "next/navigation";

import SiteContainer from "@/components/common/SiteContainer";
import OpportunityContentBlocks from "@/components/opportunities/OpportunityContentBlocks";
import OpportunityShareFooter from "@/components/opportunities/OpportunityShareFooter";
import type { UpdateDetailItem } from "@/constant/updatesDetail";
import { OPPORTUNITY_DETAIL_SECTION_CLASS } from "@/constant/opportunityDetailLayout";
import { getUpdateByParam } from "@/lib/updateDetails";
import { getUpdateDetailPath } from "@/utilities/updateDetailHref";
import UpdateDetailHero from "./UpdateDetailHero";

type UpdateDetailsProps = {
  update: UpdateDetailItem;
  returnTo?: string | null;
};

export default function UpdateDetails({ update, returnTo }: UpdateDetailsProps) {
  const sharePath = getUpdateDetailPath(update);

  return (
    <>
      <UpdateDetailHero update={update} returnTo={returnTo} />

      <SiteContainer
        as="main"
        className={`bg-white pb-12 pt-8 lg:pt-10 ${OPPORTUNITY_DETAIL_SECTION_CLASS}`}
      >
        <article className="mx-auto w-full max-w-6xl lg:max-w-7xl">
          <OpportunityContentBlocks blocks={update.contentBlocks} />

          <OpportunityShareFooter
            title={update.title}
            sharePath={sharePath}
            shareLabel="Share the update with others"
          />
        </article>
      </SiteContainer>
    </>
  );
}

export async function loadUpdateDetails(param: string) {
  const update = await getUpdateByParam(param);

  if (!update) {
    notFound();
  }

  return update;
}
