"use client";

import { ArrowRightIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { FaPersonDress } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import ContentDetailModal from "@/components/common/ContentDetailModal";
import ScrollReveal from "@/components/common/ScrollReveal";
import SiteContainer from "@/components/common/SiteContainer";
import type { InitiativeBentoSection } from "@/constant/initiativeDetailsContent";
import type { ContentDetailModalContent } from "@/types/contentDetailModal";
import { cn } from "@/utilities/cn";

const BENTO_CARD_CLASS =
  "flex flex-col rounded-[18px] border border-[#E6E6E6] bg-white";

type InitiativeDetailBentoProps = {
  section: InitiativeBentoSection;
};

function BentoReadMore({
  onClick,
  href,
  className,
  light,
}: {
  onClick?: () => void;
  href?: string;
  className?: string;
  light?: boolean;
}) {
  const content = (
    <>
      <span>Read More</span>
      <ArrowRightIcon
        className={cn(
          "size-4 stroke-[2]",
          (onClick || href) &&
            "transition-transform duration-200 group-hover:translate-x-1",
        )}
        aria-hidden
      />
    </>
  );

  const linkClassName = cn(
    "group inline-flex items-center gap-1.5 font-plusJakartaSans text-[14px] font-medium sm:text-[15px]",
    light ? "text-white" : "text-primary-50",
    className,
  );

  if (href) {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
      >
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={linkClassName}>
        {content}
      </button>
    );
  }

  return null;
}

export default function InitiativeDetailBento({
  section,
}: InitiativeDetailBentoProps) {
  const [modalContent, setModalContent] =
    useState<ContentDetailModalContent | null>(null);

  const openModal = (content: ContentDetailModalContent) => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setModalContent(content);
  };

  return (
    <>
      <SiteContainer as="section" className="pb-12 sm:pb-16 lg:pb-3">
        <ScrollReveal>
        <div
          className={cn(
            "grid grid-cols-2 gap-3",
            "lg:grid-cols-12 lg:auto-rows-min lg:items-stretch lg:gap-3",
          )}
        >
          {/* Photo */}
          <div className="relative order-1 col-span-2 min-h-[220px] overflow-hidden rounded-[18px] sm:min-h-[260px] lg:order-none lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:min-h-0 lg:h-full">
            <Image
              src={section.photoImage}
              alt={section.photoAlt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Established */}
          <article
            className={cn(
              BENTO_CARD_CLASS,
              "order-2 min-h-[118px] items-center justify-center rounded-[12px] px-4 py-4 lg:order-none lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:rounded-[18px] lg:px-4 lg:py-3",
            )}
          >
            <p className="font-plusJakartaSans text-[13px] text-[#575757] lg:text-[15px] font-semibold">
              {section.establishedLabel}
            </p>
            <p className="mt-0.5 font-plusJakartaSans text-[34px] font-bold leading-none text-[#000000] lg:text-[38px]">
              {section.establishedYear}
            </p>
          </article>

          {/* Students */}
          <article
            className={cn(
              BENTO_CARD_CLASS,
              "order-3 min-h-[118px] rounded-[12px] px-4 py-3.5 lg:order-none lg:col-span-4 lg:col-start-3 lg:row-start-1 lg:rounded-[18px] lg:px-5 lg:py-5",
            )}
          >
            <p className="font-plusJakartaSans text-[16px] font-bold leading-snug text-[#000000] lg:text-[24px]">
              {section.studentsTitle}
            </p>
            <div className="mt-3 flex items-center gap-3 sm:gap-8 lg:mt-4 lg:gap-12">
              <div className="flex shrink-0 items-center gap-[2px] sm:gap-[3px] lg:gap-1">
                {Array.from({ length: 7 }).map((_, index) => (
                  <FaPersonDress
                    key={index}
                    className="size-3.5 text-[#BDBDBD] sm:size-5 lg:size-7"
                    aria-hidden
                  />
                ))}
              </div>
              <span className="shrink-0 font-plusJakartaSans text-[12px] font-semibold text-[#575757] lg:text-[16px]">
                {section.studentsSubtitle}
              </span>
            </div>
          </article>

          {/* Globe card */}
          <article className="order-4 flex h-full min-h-0 flex-col items-center justify-center gap-2 rounded-[12px] bg-[#273845] px-3 py-3 lg:order-none lg:col-span-3 lg:col-start-10 lg:row-start-3 lg:h-auto lg:min-h-[148px] lg:gap-4 lg:rounded-[18px] lg:px-3 lg:py-4">
            <GlobeAltIcon
              className="size-[48px] shrink-0 stroke-[1] text-white lg:size-[72px]"
              aria-hidden
            />
            <BentoReadMore
              href={section.globeCard.readMoreHref}
              light
            />
          </article>

          {/* Six-Month Cycles */}
          <article
            className={cn(
              BENTO_CARD_CLASS,
              "order-5 h-full min-h-0 rounded-[12px] px-4 py-4 lg:order-none lg:col-span-6 lg:col-start-1 lg:row-start-2 lg:h-auto lg:min-h-[190px] lg:rounded-[18px] lg:px-6 lg:py-4 lg:pb-4",
            )}
          >
            <div className="relative mx-auto h-[72px] w-[72px] lg:h-[140px] lg:w-[140px]">
              <Image
                src={section.sixMonthCycles!.icon}
                alt=""
                fill
                className="scale-[1.25] object-contain object-center lg:scale-[1.80]"
                sizes="150px"
              />
            </div>
            <h3 className="mt-2 text-center font-plusJakartaSans text-[15px] font-bold text-[#000000] lg:mt-0 lg:text-[18px]">
              {section.sixMonthCycles!.title}
            </h3>
            <p className="mx-auto mt-2 max-w-[700px] flex-1 text-center font-plusJakartaSans text-[12px] leading-[18px] text-[#9E9E9E] lg:mt-2 lg:text-[16px] lg:leading-[22px]">
              {section.sixMonthCycles!.description}
            </p>
            {section.sixMonthCycles!.readMoreModal ? (
              <div className="mt-auto flex w-full justify-center pt-2 lg:pt-3">
                <BentoReadMore
                  onClick={() =>
                    openModal(section.sixMonthCycles!.readMoreModal!)
                  }
                />
              </div>
            ) : null}
          </article>

          {/* Student Outcomes */}
          <article
            className={cn(
              BENTO_CARD_CLASS,
              "order-6 col-span-2 min-h-[210px] rounded-[12px] px-5 py-6 lg:order-none lg:col-span-9 lg:col-start-1 lg:row-start-3 lg:rounded-[18px] lg:px-8 lg:py-5",
            )}
          >
            <h3 className="text-center font-plusJakartaSans text-[16px] font-bold text-[#000000] lg:text-[20px] md:pt-4">
              {section.studentOutcomes!.title}
            </h3>
            <p className="mx-auto mt-3 max-w-[900px] flex-1 text-center font-plusJakartaSans text-[13px] leading-[22px] text-[#9E9E9E] lg:mt-3 lg:text-[16px] lg:leading-[24px]">
              {section.studentOutcomes!.description}
            </p>
            {section.studentOutcomes!.readMoreModal ? (
              <div className="mt-4 flex w-full justify-center lg:mt-3">
                <BentoReadMore
                  onClick={() =>
                    openModal(section.studentOutcomes!.readMoreModal!)
                  }
                />
              </div>
            ) : null}
          </article>
        </div>
        </ScrollReveal>
      </SiteContainer>

      <ContentDetailModal
        open={modalContent !== null}
        onClose={() => setModalContent(null)}
        content={modalContent}
      />
    </>
  );
}
