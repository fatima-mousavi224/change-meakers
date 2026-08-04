import { notFound } from "next/navigation";

import SiteContainer from "@/components/common/SiteContainer";
import type { OpportunityItem } from "@/constant/opportunities";
import { getOpportunityById } from "@/lib/opportunities";
import OpportunityDetailHero from "./OpportunityDetailHero";

type OpportunityDetailsProps = {
  opportunity: OpportunityItem;
};

export default function OpportunityDetails({
  opportunity,
}: OpportunityDetailsProps) {
  return (
    <>
      <OpportunityDetailHero opportunity={opportunity} />

      <SiteContainer
        as="main"
        className="px-6 pb-12 pt-8 sm:px-10 md:px-14 lg:px-20 lg:pt-10"
      >
        <article className="max-w-4xl">
          <div className="space-y-5 font-plusJakartaSans text-[16px] leading-[28px] text-[#252525]">
            {opportunity.content.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {opportunity.applicationUrl && !isDeadlineExpired(opportunity.deadline) ? (
            <a
              href={opportunity.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-[12px] bg-primary-50 px-6 py-3 font-plusJakartaSans text-[14px] font-medium text-white transition-colors hover:bg-primary-100"
            >
              Apply Now
            </a>
          ) : null}
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
