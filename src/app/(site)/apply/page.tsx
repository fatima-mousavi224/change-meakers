import { Metadata } from "next";

import OpportunityHubHero from "@/components/opportunities/OpportunityHubHero";
import OpportunityListing from "@/components/opportunities/OpportunityListing";

export const metadata: Metadata = {
  title: "Opportunity Hub",
  description:
    "The Opportunity Hub connects Afghan women and girls with carefully selected scholarships, online courses, educational programs, fellowships, mentorships, and other useful opportunities.",
};

export default function OpportunitiesPage() {
  return (
    <>
      <OpportunityHubHero />
      <OpportunityListing />
    </>
  );
}
