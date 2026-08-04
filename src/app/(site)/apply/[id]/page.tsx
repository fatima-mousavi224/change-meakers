import { Metadata } from "next";
import { notFound } from "next/navigation";

import OpportunityDetails, {
  loadOpportunityDetails,
} from "@/components/opportunities/OpportunityDetails";
import { getOpportunityById } from "@/lib/opportunities";

type OpportunityDetailPageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params,
}: OpportunityDetailPageProps): Promise<Metadata> {
  const opportunity = await getOpportunityById(params.id);

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

  if (!opportunity) {
    notFound();
  }

  return <OpportunityDetails opportunity={opportunity} />;
}
