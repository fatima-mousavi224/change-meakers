import { notFound } from "next/navigation";

import SiteContainer from "@/components/common/SiteContainer";
import type { OpportunityItem } from "@/constant/opportunities";
import { OPPORTUNITY_DETAIL_SECTION_CLASS } from "@/constant/opportunityDetailLayout";
import { getOpportunityById } from "@/lib/opportunities";
import OpportunityContentBlocks from "./OpportunityContentBlocks";
import OpportunityDetailHero from "./OpportunityDetailHero";
import OpportunityShareFooter from "./OpportunityShareFooter";

type OpportunityDetailsProps = {
  opportunity: OpportunityItem;
};

export default function OpportunityDetails({
  opportunity,
}: OpportunityDetailsProps) {
  const sharePath = `/apply/${opportunity.id}`;

  return (
    <>
      <OpportunityDetailHero opportunity={opportunity} />

      <SiteContainer
        as="main"
        className={`pb-12 pt-8 lg:pt-10 ${OPPORTUNITY_DETAIL_SECTION_CLASS}`}
      >
        <article className="w-full">
          <OpportunityContentBlocks blocks={opportunity.contentBlocks} />

          {opportunity.applicationUrl && !isDeadlineExpired(opportunity.deadline) ? (
            <a
              href={opportunity.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex rounded-[12px] bg-primary-50 px-6 py-3 font-plusJakartaSans text-[14px] font-medium text-white transition-colors hover:bg-primary-100"
            >
              Apply Now
            </a>
          ) : null}

          <OpportunityShareFooter
            title={opportunity.title}
            sharePath={sharePath}
          />
        </article>
      </SiteContainer>
    </>
  );
}

function isDeadlineExpired(deadline: string) {
  return new Date(deadline).getTime() < Date.now();
}

export async function loadOpportunityDetails(id: string) {
  const opportunity = await getOpportunityById(id);

  if (!opportunity) {
    notFound();
  }

  return opportunity;
}
