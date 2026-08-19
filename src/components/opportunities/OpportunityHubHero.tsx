import PageHero from "@/components/common/PageHero";

const OPPORTUNITY_HUB_DESCRIPTION =
  "The Opportunity Hub connects Afghan women and girls with carefully selected scholarships, online courses, educational programs, fellowships, mentorships, and other useful opportunities. We review opportunities before sharing them and prioritize reliable sources to help protect our audience from misleading information and scams.";

export default function OpportunityHubHero() {
  return (
    <PageHero
      title="Opportunity Hub"
      description={OPPORTUNITY_HUB_DESCRIPTION}
      image="/images/opportunitiespage-hero-image.jpg"
      imageAlt="Opportunity Hub"
      imagePosition="center"
    />
  );
}
