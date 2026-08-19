import { Metadata } from "next";
import { redirect } from "next/navigation";

import OpportunityDetails, {
  loadOpportunityDetails,
} from "@/components/opportunities/OpportunityDetails";
import { getOpportunityHref } from "@/constant/opportunities";
import { getOpportunityByParam } from "@/lib/opportunities";

type OpportunityDetailPageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params,
}: OpportunityDetailPageProps): Promise<Metadata> {
  const opportunity = await getOpportunityByParam(params.id);

  if (!opportunity) {
    return { title: "Opportunity Not Found" };
  }

  return {
    title: opportunity.title,
    description: opportunity.excerpt,
  };
}

export default async function OpportunityDetailPage({
  params,
}: OpportunityDetailPageProps) {
  const opportunity = await loadOpportunityDetails(params.id);

  const canonicalSegment = getOpportunityHref(opportunity).replace(
    "/opportunities/",
    "",
  );

  if (params.id !== canonicalSegment) {
    redirect(getOpportunityHref(opportunity));
  }

  return <OpportunityDetails opportunity={opportunity} />;
}
