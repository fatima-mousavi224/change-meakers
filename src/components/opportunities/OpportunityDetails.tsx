import { ClockIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import SiteContainer from "@/components/common/SiteContainer";
import type { OpportunityItem } from "@/constant/opportunities";
import { getOpportunityById } from "@/lib/opportunities";
import { cn } from "@/utilities/cn";

const FALLBACK_IMAGE = "/images/update-component-image.jpg";

function formatDeadline(deadline: string) {
  return new Date(deadline).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getDeadlineTone(deadline: string) {
  const daysUntilDeadline = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  if (daysUntilDeadline <= 14) return "text-[#D92D20]";
  return "text-[#039855]";
}

type OpportunityDetailsProps = {
  opportunity: OpportunityItem;
};

export default function OpportunityDetails({
  opportunity,
}: OpportunityDetailsProps) {
  const imageSrc = opportunity.image?.trim() || FALLBACK_IMAGE;
  const isRemoteImage = imageSrc.startsWith("http");

  return (
    <SiteContainer as="main" className="pb-12 pt-8">
      <Link
        href="/apply"
        className="mb-6 inline-flex font-plusJakartaSans text-[14px] font-medium text-primary-50 hover:underline"
      >
        ← Back to Opportunity Hub
      </Link>

      <article className="overflow-hidden rounded-[24px] border border-[#E4E7EC] bg-white shadow-sm">
        <div className="relative aspect-[16/7] w-full sm:aspect-[16/6]">
          <Image
            src={imageSrc}
            alt={opportunity.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1440px) 100vw, 1440px"
            unoptimized={isRemoteImage}
          />
        </div>

        <div className="space-y-6 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-secondary_color px-3 py-1 font-plusJakartaSans text-[13px] font-medium text-primary-50">
              {opportunity.category}
            </span>
            <span className="font-plusJakartaSans text-[14px] text-[#667085]">
              {opportunity.location}
            </span>
          </div>

          <h1 className="font-plusJakartaSans text-[28px] font-bold leading-tight text-[#252525] sm:text-[36px]">
            {opportunity.title}
          </h1>

          <div
            className={cn(
              "flex items-center gap-2 font-plusJakartaSans text-[14px] font-medium",
              getDeadlineTone(opportunity.deadline),
            )}
          >
            <ClockIcon className="size-4 shrink-0" aria-hidden />
            <span>Deadline: {formatDeadline(opportunity.deadline)}</span>
          </div>

          <div className="space-y-4 font-plusJakartaSans text-[16px] leading-[28px] text-[#252525]">
            {opportunity.content.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {opportunity.applicationUrl ? (
            <a
              href={opportunity.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-[12px] bg-primary-50 px-6 py-3 font-plusJakartaSans text-[14px] font-medium text-white transition-colors hover:bg-primary-100"
            >
              Apply Now
            </a>
          ) : null}
        </div>
      </article>
    </SiteContainer>
  );
}

export async function loadOpportunityDetails(id: string) {
  const opportunity = await getOpportunityById(id);

  if (!opportunity) {
    notFound();
  }

  return opportunity;
}
