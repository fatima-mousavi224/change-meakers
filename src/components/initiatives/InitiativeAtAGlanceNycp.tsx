"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import ContentDetailModal from "@/components/common/ContentDetailModal";
import SectionHeading from "@/components/common/SectionHeading";
import SiteContainer from "@/components/common/SiteContainer";
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
      <SiteContainer as="section" className="pb-11 sm:pb-14 lg:pb-11">
        <SectionHeading title="At a Glance" />

        {/*
          Mobile: 2 columns — org (left, tall) | consultations + youth (right stack), then photo full width
          Desktop: 3 columns — org | middle stack | photo
        */}
        <div className="grid grid-cols-2 items-stretch gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,3fr)_minmax(0,5fr)] lg:gap-6">
          {/* 244 Organizations */}
          <article
            className={cn(
              CARD_CLASS,
              "col-start-1 row-span-2 row-start-1 flex flex-col px-3 py-3.5 sm:px-4 sm:py-4 lg:col-start-auto lg:row-span-1 lg:row-start-auto lg:h-full lg:min-h-0 lg:px-6 lg:py-6",
            )}
          >
            <h3 className="shrink-0 text-center font-plusJakartaSans text-[12px] font-bold leading-snug text-[#000000] sm:text-[13px] lg:text-[20px]">
              {organizationsCard.title}
            </h3>

            <div className="flex min-h-0 flex-1 items-center justify-center py-1 sm:py-2 lg:flex-none lg:items-stretch lg:py-0">
              <div className="relative mx-auto h-[112px] w-full max-w-none shrink-0 overflow-hidden sm:h-[124px] lg:mt-7 lg:h-[174px] lg:max-w-[295px]">
                <Image
                  src={organizationsCard.image}
                  alt={organizationsCard.imageAlt}
                  fill
                  className="object-contain object-center scale-[1.88] sm:scale-[1.94] lg:scale-[1.96]"
                  sizes="(max-width: 1024px) 50vw, 300px"
                />
              </div>
            </div>

            <p className="mx-auto mt-2 max-w-none shrink-0 text-center font-plusJakartaSans text-[10px] leading-[15px] text-[#9E9E9E] sm:mt-3 sm:text-[11px] sm:leading-[16px] lg:mt-6 lg:max-w-[280px] lg:text-[16px] lg:leading-[28px]">
              {organizationsCard.description}
            </p>

            {showLearnMore ? (
              <div className="mt-auto shrink-0 pt-3 sm:pt-4 lg:pt-5">
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
              </div>
            ) : null}
          </article>

          {/* Middle column — consultations + youth; `contents` on mobile joins parent grid */}
          <div className="contents lg:col-start-auto lg:flex lg:flex-col lg:gap-4">
            <article
              className={cn(
                CARD_CLASS,
                "col-start-2 row-start-1 flex flex-col px-3 py-3.5 sm:px-4 sm:py-4 lg:col-start-auto lg:row-start-auto lg:flex-1 lg:px-6 lg:py-5",
              )}
            >
              <h3 className="text-center font-plusJakartaSans text-[12px] font-bold leading-snug text-[#000000] sm:text-[13px] lg:text-[18px]">
                {provincialConsultations.title}
              </h3>

              <p className="mt-2.5 text-center font-plusJakartaSans text-[9px] leading-[14px] text-[#9E9E9E] sm:mt-3 sm:text-[10px] sm:leading-[15px] lg:text-[14px] lg:leading-[24px]">
                {provincialConsultations.description}
              </p>
            </article>

            <article
              className={cn(
                CARD_CLASS,
                "col-start-2 row-start-2 flex flex-col items-center justify-center px-3 py-3.5 sm:px-4 sm:py-4 lg:col-start-auto lg:row-start-auto lg:px-6 lg:py-6",
              )}
            >
              <h3 className="text-center font-plusJakartaSans text-[12px] font-bold leading-snug text-[#000000] sm:text-[13px] lg:text-[18px]">
                {youthRepresentatives.title}
              </h3>

              <p className="mx-auto mt-2.5 max-w-none text-center font-plusJakartaSans text-[10px] leading-[15px] text-[#9E9E9E] sm:mt-3 sm:text-[11px] sm:leading-[16px] lg:mt-3 lg:max-w-[320px] lg:text-[16px] lg:leading-[28px]">
                {youthRepresentatives.description}
              </p>
            </article>
          </div>

          {/* Conference photo */}
          <div className="relative col-span-2 col-start-1 row-start-3 min-h-[240px] overflow-hidden rounded-[12px] sm:min-h-[270px] lg:col-span-1 lg:col-start-auto lg:row-span-1 lg:row-start-auto lg:min-h-0 lg:h-full lg:rounded-[18px]">
            <Image
              src={section.photoImage}
              alt={section.photoAlt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </div>
        </div>
      </SiteContainer>

      <ContentDetailModal
        open={modalContent !== null}
        onClose={() => setModalContent(null)}
        content={modalContent}
      />
    </>
  );
}
