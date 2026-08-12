import Image from "next/image";
import Link from "next/link";

import SiteContainer from "@/components/common/SiteContainer";
import type { OpportunityItem } from "@/constant/opportunities";
import { OPPORTUNITY_DETAIL_SECTION_CLASS } from "@/constant/opportunityDetailLayout";
import { cn } from "@/utilities/cn";

const DETAIL_HERO_BACKGROUND = "/images/detailscard-background-image.png";

type OpportunityDetailHeroProps = {
  opportunity: OpportunityItem;
};

function formatPostedDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDeadline(deadline: string) {
  return new Date(deadline).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function isDeadlineExpired(deadline: string) {
  return new Date(deadline).getTime() < Date.now();
}

function formatSourceLabel(url: string) {
  return url.replace(/^https?:\/\//, "");
}

function DetailField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <p className="font-plusJakartaSans text-[15px] leading-relaxed text-white sm:text-[16px]">
      <span className="font-bold">{label}: </span>
      {children}
    </p>
  );
}

export default function OpportunityDetailHero({
  opportunity,
}: OpportunityDetailHeroProps) {
  const postedDate = opportunity.postedDate ?? opportunity.createdAt;
  const mainSource = opportunity.mainSource ?? opportunity.applicationUrl;
  const deadlineExpired = isDeadlineExpired(opportunity.deadline);

  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[480px] sm:min-h-[520px] lg:min-h-[590px]">
        <Image
          src={DETAIL_HERO_BACKGROUND}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          aria-hidden
        />

        <SiteContainer
          className={`relative py-10 sm:py-12 lg:py-16 ${OPPORTUNITY_DETAIL_SECTION_CLASS}`}
        >
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 font-plusJakartaSans text-[15px] font-medium text-white transition-opacity hover:opacity-80 sm:text-[16px]"
          >
            <span aria-hidden>←</span>
            <span>Back</span>
          </Link>

          <p className="mt-8 font-plusJakartaSans text-[15px] font-medium text-white sm:text-[16px]">
            {opportunity.category}
          </p>

          <div className="mt-5 border-t border-white" />

          <time
            dateTime={postedDate}
            className="mt-6 block font-plusJakartaSans text-[15px] font-normal text-white sm:text-[20px]"
          >
            {formatPostedDate(postedDate)}
          </time>

          <h1 className="mt-5 max-w-5xl font-plusJakartaSans text-[30px] font-bold leading-[1.2] text-white sm:text-[36px] lg:text-[48px]">
            {opportunity.title}
          </h1>

          <p className="mt-5 max-w-4xl font-plusJakartaSans text-[16px] leading-relaxed text-white/90 sm:text-[20px]">
            {opportunity.excerpt}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:gap-4 lg:flex-row lg:flex-wrap lg:gap-x-10">
            {opportunity.resourceProvider ? (
              <DetailField label="Resource Provider">
                {opportunity.resourceProvider}
              </DetailField>
            ) : null}

            <DetailField label="Location">{opportunity.location}</DetailField>

            <DetailField label="Deadline">
              <span
                className={cn(
                  deadlineExpired
                    ? "font-medium text-[#FF4D4F]"
                    : "text-white/90"
                )}
              >
                {deadlineExpired
                  ? "No longer available"
                  : formatDeadline(opportunity.deadline)}
              </span>
            </DetailField>

            {mainSource ? (
              <DetailField label="Main Source">
                <a
                  href={mainSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 transition-opacity hover:opacity-80"
                >
                  {formatSourceLabel(mainSource)}
                </a>
              </DetailField>
            ) : null}
          </div>
        </SiteContainer>
      </div>
    </section>
  );
}
