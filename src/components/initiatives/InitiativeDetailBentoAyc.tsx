"use client";

import { ArrowRightIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { FaPerson, FaPersonDress } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import ContentDetailModal from "@/components/common/ContentDetailModal";
import SiteContainer from "@/components/common/SiteContainer";
import type { InitiativeBentoSection } from "@/constant/initiativeDetailsContent";
import type { ContentDetailModalContent } from "@/types/contentDetailModal";
import { cn } from "@/utilities/cn";

const BENTO_CARD_CLASS =
  "flex flex-col rounded-[18px] border border-[#E6E6E6] bg-white";

type InitiativeDetailBentoAycProps = {
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

export default function InitiativeDetailBentoAyc({
  section,
}: InitiativeDetailBentoAycProps) {
  const [modalContent, setModalContent] =
    useState<ContentDetailModalContent | null>(null);

  const youthStats = section.youthStats!;
  const previousWork = section.previousWork!;
  const openModal = (content: ContentDetailModalContent) => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setModalContent(content);
  };

  return (
    <>
      <SiteContainer as="section" className="pb-12 sm:pb-16 lg:pb-12">
        {/*
          Desktop (Figma): col 1 = photo | col 2 = logo card | col 3 = stats + established/globe
          Mobile: 1 photo → 2 logo card → 3 stats → 4 established/globe
        */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-12 lg:grid-rows-2 lg:items-stretch lg:gap-3">
          {/* 1 — Computer photo */}
          <div className="relative order-1 col-span-2 min-h-[280px] overflow-hidden rounded-[18px] sm:min-h-[320px] lg:order-none lg:col-span-4 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:min-h-0">
            <Image
              src={section.photoImage}
              alt={section.photoAlt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          </div>

          {/* 2 — Built on Previous Youth Work (logo card) */}
          <article
            className={cn(
              BENTO_CARD_CLASS,
              "order-2 col-span-2 px-0 pb-4 pt-0 lg:order-none lg:col-span-4 lg:col-start-5 lg:row-span-2 lg:row-start-1 lg:pb-5",
            )}
          >
            <div className="px-3 pt-4 lg:px-4 lg:pt-5">
              <Image
                src={previousWork.icon}
                alt=""
                width={376}
                height={164}
                className="mb-0 h-auto w-full"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />

              <p className="mx-auto -mt-1 max-w-[380px] text-center font-plusJakartaSans text-[12px] leading-[20px] text-[#9E9E9E] lg:mt-4 lg:text-[16px] lg:leading-[26px]">
                {previousWork.description}
              </p>
            </div>

            {previousWork.readMoreModal ? (
              <div className="mt-3 px-4 lg:mt-4 lg:px-5">
                <BentoReadMore
                  onClick={() => openModal(previousWork.readMoreModal!)}
                />
              </div>
            ) : null}
          </article>

          {/* 3 — 100+ Youth Connected */}
          <article
            className={cn(
              BENTO_CARD_CLASS,
              "order-3 col-span-2 rounded-[12px] px-4 py-3 lg:order-none lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:rounded-[18px] lg:px-5 lg:py-4",
            )}
          >
            <p className="font-plusJakartaSans text-[16px] font-bold text-[#000000] lg:text-[24px]">
              {youthStats.title}
            </p>

            <div className="mt-3 flex flex-col items-start gap-2 lg:mt-4 lg:gap-2.5">
              <div className="flex items-center gap-4 lg:gap-5">
                <div className="flex items-center gap-[3px]">
                  {Array.from({ length: youthStats.femaleIconCount }).map(
                    (_, index) => (
                      <FaPersonDress
                        key={index}
                        className="size-3.5 text-[#BDBDBD] lg:size-6"
                        aria-hidden
                      />
                    ),
                  )}
                </div>
                <span className="font-plusJakartaSans text-[12px] font-semibold text-[#575757] lg:text-[16px]">
                  {youthStats.femaleLabel}
                </span>
              </div>

              <div className="flex items-center gap-4 lg:gap-5">
                <div className="flex items-center gap-[3px]">
                  {Array.from({ length: youthStats.maleIconCount }).map(
                    (_, index) => (
                      <FaPerson
                        key={index}
                        className="size-3.5 text-[#BDBDBD] lg:size-6"
                        aria-hidden
                      />
                    ),
                  )}
                </div>
                <span className="font-plusJakartaSans text-[12px] font-semibold text-[#575757] lg:text-[16px]">
                  {youthStats.maleLabel}
                </span>
              </div>
            </div>
          </article>

          {/* 4 — Established + Globe */}
          <div className="order-4 col-span-2 grid grid-cols-2 gap-3 lg:order-none lg:col-span-4 lg:col-start-9 lg:row-start-2">
            <article
              className={cn(
                BENTO_CARD_CLASS,
                "min-h-[96px] items-center justify-center rounded-[12px] px-3 py-3 lg:h-full lg:rounded-[18px] lg:px-4 lg:py-2.5",
              )}
            >
              <p className="font-plusJakartaSans text-[13px] font-semibold text-[#575757] lg:text-[15px]">
                {section.establishedLabel}
              </p>
              <p className="mt-0.5 font-plusJakartaSans text-[34px] font-bold leading-none text-[#000000] lg:text-[38px]">
                {section.establishedYear}
              </p>
            </article>

            <article className="flex h-full min-h-[96px] flex-col items-center justify-center gap-1.5 rounded-[12px] bg-[#273845] px-3 py-2.5 lg:gap-3 lg:rounded-[18px] lg:px-3 lg:py-3">
              <GlobeAltIcon
                className="size-[40px] shrink-0 stroke-[1] text-white lg:size-[56px]"
                aria-hidden
              />
              <BentoReadMore
                href={section.globeCard.readMoreHref}
                light
                className="text-[12px] sm:text-[13px]"
              />
            </article>
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
