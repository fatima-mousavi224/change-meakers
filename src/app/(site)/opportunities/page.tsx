import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import OpportunityHubHero from "@/components/opportunities/OpportunityHubHero";
import OpportunityListing from "@/components/opportunities/OpportunityListing";
import { getOpportunityHref } from "@/constant/opportunities";
import { getOpportunityByParam } from "@/lib/opportunities";

type OpportunitiesPageProps = {
  searchParams: {
    id?: string;
  };
};

export async function generateMetadata({
  searchParams,
}: OpportunitiesPageProps): Promise<Metadata> {
  if (searchParams.id) {
    const opportunity = await getOpportunityByParam(searchParams.id);

    if (!opportunity) {
      return { title: "Opportunity Not Found" };
    }

    return {
      title: opportunity.title,
      description: opportunity.excerpt,
    };
  }

  return {
    title: "Opportunity Hub",
    description:
      "The Opportunity Hub connects Afghan women and girls with carefully selected scholarships, online courses, educational programs, fellowships, mentorships, and other useful opportunities.",
  };
}

export default async function OpportunitiesPage({
  searchParams,
}: OpportunitiesPageProps) {
  if (searchParams.id) {
    const opportunity = await getOpportunityByParam(searchParams.id);

    if (!opportunity) {
      notFound();
    }

    redirect(getOpportunityHref(opportunity));
  }

  return (
    <>
      <OpportunityHubHero />
      <OpportunityListing />
    </>
  );
}
