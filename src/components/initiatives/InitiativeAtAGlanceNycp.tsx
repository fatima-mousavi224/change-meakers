"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import ContentDetailModal from "@/components/common/ContentDetailModal";
import ScrollReveal from "@/components/common/ScrollReveal";
import SectionHeading from "@/components/common/SectionHeading";
import SiteContainer from "@/components/common/SiteContainer";
import StaggerReveal, { StaggerItem } from "@/components/common/StaggerReveal";
import type { InitiativeAtAGlanceNycpSection } from "@/constant/initiativeDetailsContent";
import type { ContentDetailModalContent } from "@/types/contentDetailModal";
import { cn } from "@/utilities/cn";

const CARD_CLASS =
  "flex flex-col overflow-hidden rounded-[12px] border border-[#E6E6E6] bg-white lg:rounded-[18px]";

type InitiativeAtAGlanceNycpProps = {
  section: InitiativeAtAGlanceNycpSection;
};

function LearnMoreTrigger({
  href,
  onClick,
  className,
}: {
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  const content = (
    <>
      <span>Learn More</span>
      <ArrowRightIcon
        className={cn(
          "size-4 stroke-[2]",
          (href || onClick) &&
            "transition-transform duration-200 group-hover:translate-x-1",
        )}
        aria-hidden
      />
    </>
  );

  const triggerClassName = cn(
    "group inline-flex items-center gap-1.5 font-plusJakartaSans text-[14px] font-medium text-primary-50 sm:text-[15px]",
    className,
  );

  if (href) {
    const isExternal = href.startsWith("http");

    return (
      <Link
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className={triggerClassName}
      >
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={triggerClassName}>
        {content}
      </button>
    );
  }

  return null;
}

export default function InitiativeAtAGlanceNycp({
  section,
}: InitiativeAtAGlanceNycpProps) {
  const [modalContent, setModalContent] =
    useState<ContentDetailModalContent | null>(null);
  const { organizationsCard, provincialConsultations, youthRepresentatives } =
    section;
  const showLearnMore = Boolean(
    organizationsCard.readMoreHref || organizationsCard.readMoreModal,
  );

  return (
    <>
      <SiteContainer as="section" className="pb-4 md:py-3">
        <ScrollReveal>
          <SectionHeading title="At a Glance" />
        </ScrollReveal>

        <StaggerReveal className="grid grid-cols-2 items-stretch gap-3 lg:grid-cols-3 lg:grid-rows-2 lg:gap-3">
          <StaggerItem className="col-start-1 row-span-2 row-start-1 h-full lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <article
              className={cn(
                CARD_CLASS,
                "flex h-full min-h-0 flex-col px-3 py-3.5 sm:px-4 sm:py-4 lg:px-6 lg:py-6",
              )}
            >
              <h3 className="shrink-0 text-center font-plusJakartaSans text-[12px] font-bold leading-snug text-[#000000] sm:text-[13px] lg:text-[20px]">
                {organizationsCard.title}
              </h3>

              <div className="flex min-h-0 flex-1 items-center justify-center py-1 sm:py-2 lg:py-2">
                <div className="relative mx-auto h-[112px] w-full max-w-none shrink-0 overflow-hidden sm:h-[124px] lg:h-[174px] lg:max-w-[295px]">
                  <Image
                    src={organizationsCard.image}
                    alt={organizationsCard.imageAlt}
                    fill
                    className="object-contain object-center scale-[1.88] sm:scale-[1.94] lg:scale-[1.96]"
                    sizes="(max-width: 1024px) 50vw, 300px"
                  />
                </div>
              </div>

              <div className="mt-auto flex shrink-0 flex-col items-center gap-2 sm:gap-2.5 lg:gap-3">
                <p className="mx-auto max-w-none text-center font-plusJakartaSans text-[10px] leading-[15px] text-[#9E9E9E] sm:text-[11px] sm:leading-[16px] lg:max-w-[280px] lg:text-[16px] lg:leading-[28px]">
                  {organizationsCard.description}
                </p>

                {showLearnMore ? (
                  <LearnMoreTrigger
                    href={organizationsCard.readMoreHref}
                    onClick={
                      organizationsCard.readMoreModal
                        ? () => {
                            window.scrollTo({ top: 0, behavior: "auto" });
                            setModalContent(organizationsCard.readMoreModal!);
                          }
                        : undefined
                    }
                    className="text-[11px] sm:text-[12px] lg:text-[15px]"
                  />
                ) : null}
              </div>
            </article>
          </StaggerItem>

          <StaggerItem className="col-start-2 row-start-1 h-full lg:col-start-2 lg:row-start-1">
            <article
              className={cn(
                CARD_CLASS,
                "flex h-full flex-col px-3 py-3.5 sm:px-4 sm:py-4 lg:px-6 lg:py-5",
              )}
            >
              <h3 className="text-center font-plusJakartaSans text-[12px] font-bold leading-snug text-[#000000] sm:text-[13px] lg:text-[18px]">
                {provincialConsultations.title}
              </h3>

              <p className="mt-2.5 text-center font-plusJakartaSans text-[9px] leading-[14px] text-[#9E9E9E] sm:mt-3 sm:text-[10px] sm:leading-[15px] lg:text-[14px] lg:leading-[24px]">
                {provincialConsultations.description}
              </p>
            </article>
          </StaggerItem>

          <StaggerItem className="col-start-2 row-start-2 h-full lg:col-start-2 lg:row-start-2">
            <article
              className={cn(
                CARD_CLASS,
                "flex h-full flex-col items-center justify-center px-3 py-3.5 sm:px-4 sm:py-4 lg:px-6 lg:py-6",
              )}
            >
              <h3 className="text-center font-plusJakartaSans text-[12px] font-bold leading-snug text-[#000000] sm:text-[13px] lg:text-[18px]">
                {youthRepresentatives.title}
              </h3>

              <p className="mx-auto mt-2 max-w-none text-center font-plusJakartaSans text-[9px] leading-[14px] text-[#9E9E9E] sm:mt-2.5 sm:text-[10px] sm:leading-[15px] lg:mt-2.5 lg:max-w-[320px] lg:text-[14px] lg:leading-[24px]">
                {youthRepresentatives.description}
              </p>
            </article>
          </StaggerItem>

          <StaggerItem className="relative col-span-2 col-start-1 row-start-3 min-h-[240px] sm:min-h-[270px] lg:col-span-1 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:min-h-0 lg:h-full">
            <div className="relative h-full min-h-[240px] overflow-hidden rounded-[12px] sm:min-h-[270px] lg:min-h-0 lg:rounded-[18px]">
              <Image
                src={section.photoImage}
                alt={section.photoAlt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
          </StaggerItem>
        </StaggerReveal>
      </SiteContainer>

      <ContentDetailModal
        open={modalContent !== null}
        onClose={() => setModalContent(null)}
        content={modalContent}
      />
    </>
  );
}
