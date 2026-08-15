"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import ContentDetailModal from "@/components/common/ContentDetailModal";
import ScrollReveal from "@/components/common/ScrollReveal";
import SiteContainer from "@/components/common/SiteContainer";
import type { InitiativeBentoMaktabSection } from "@/constant/initiativeDetailsContent";
import type { ContentDetailModalContent } from "@/types/contentDetailModal";
import { cn } from "@/utilities/cn";

const BENTO_CARD_CLASS =
  "flex flex-col rounded-[18px] border border-[#E6E6E6] bg-white";

type InitiativeDetailBentoMaktabProps = {
  section: InitiativeBentoMaktabSection;
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
    const isExternal = href.startsWith("http");

    return (
      <Link
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
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

export default function InitiativeDetailBentoMaktab({
  section,
}: InitiativeDetailBentoMaktabProps) {
  const [modalContent, setModalContent] =
    useState<ContentDetailModalContent | null>(null);

  const openModal = (content: ContentDetailModalContent) => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setModalContent(content);
  };

  const { partnershipsCard, comingSoon, youtubeCard } = section;

  return (
    <>
      <SiteContainer as="section" className="pb-12 sm:pb-16 lg:pb-12">
        <ScrollReveal>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-12 lg:grid-rows-[auto_auto] lg:items-stretch lg:gap-3">
          {/* Photo — right column, full height */}
          <div className="relative order-1 col-span-2 min-h-[300px] overflow-hidden rounded-[18px] sm:min-h-[336px] lg:order-none lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:min-h-0 lg:h-full">
            <Image
              src={section.photoImage}
              alt={section.photoAlt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Partnerships card — left top */}
          <article
            className={cn(
              BENTO_CARD_CLASS,
              "order-2 col-span-2 px-5 py-7 sm:px-6 sm:py-8 lg:order-none lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:px-8 lg:py-9",
            )}
          >
            <h3 className="text-center font-plusJakartaSans text-[16px] font-bold leading-snug text-[#000000] sm:text-[18px] lg:text-[20px]">
              {partnershipsCard.title}
            </h3>

            <div className="my-5 flex flex-wrap items-center justify-center gap-4 sm:gap-5 lg:my-6 lg:gap-6">
              {partnershipsCard.logos.map((logo) => (
                <div
                  key={logo.src}
                  className={cn(
                    "relative flex shrink-0 items-center justify-center",
                    logo.className,
                  )}
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width ?? 160}
                    height={logo.height ?? 56}
                    className={cn(
                      "h-auto w-auto max-h-[52px] max-w-[140px] object-contain sm:max-h-[56px] sm:max-w-[160px] lg:max-h-[64px] lg:max-w-[180px]",
                      logo.imageClassName,
                    )}
                  />
                </div>
              ))}
            </div>

            <p className="mx-auto max-w-[640px] text-center font-plusJakartaSans text-[13px] leading-[22px] text-at_glance_body sm:text-[14px] sm:leading-[24px] lg:text-[16px] lg:leading-[28px]">
              {partnershipsCard.description}
            </p>

            {partnershipsCard.readMoreModal || partnershipsCard.readMoreHref ? (
              <div className="mt-5 flex justify-center lg:mt-6">
                <BentoReadMore
                  href={partnershipsCard.readMoreHref}
                  onClick={
                    partnershipsCard.readMoreModal
                      ? () => openModal(partnershipsCard.readMoreModal!)
                      : undefined
                  }
                />
              </div>
            ) : null}
          </article>

          {/* Bottom row — Coming Soon + YouTube */}
          <div className="order-3 col-span-2 grid grid-cols-3 gap-3 lg:contents">
            <article
              className={cn(
                BENTO_CARD_CLASS,
                "col-span-1 h-[140px] items-center justify-center rounded-[12px] px-3 py-4 lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:h-[176px] lg:rounded-[18px] lg:px-4 lg:py-5",
              )}
            >
              <p className="text-center font-plusJakartaSans text-[13px] font-semibold text-[#575757] lg:text-[15px]">
                {comingSoon.label}
              </p>
              <p className="mt-0.5 text-center font-plusJakartaSans text-[34px] font-bold leading-none text-[#000000] lg:text-[38px]">
                {comingSoon.year}
              </p>
            </article>

            <article className="col-span-2 flex h-[140px] flex-col items-center justify-center gap-2 rounded-[12px] bg-[#B91C1C] px-3 py-3 lg:col-span-4 lg:col-start-3 lg:row-start-2 lg:h-[176px] lg:gap-2.5 lg:rounded-[18px] lg:px-4 lg:py-4">
              <div className="relative h-[68px] w-[min(100%,240px)] sm:h-[76px] sm:w-[min(100%,272px)] lg:h-[96px] lg:w-[min(100%,328px)]">
                <Image
                  src={youtubeCard.image}
                  alt="YouTube"
                  fill
                  className="object-cover object-center mix-blend-lighten"
                  sizes="(max-width: 1024px) 272px, 328px"
                />
              </div>
              <BentoReadMore
                href={youtubeCard.readMoreHref}
                light
                className="shrink-0"
              />
            </article>
          </div>
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
