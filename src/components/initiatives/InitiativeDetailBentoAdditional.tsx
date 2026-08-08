"use client";

import { ArrowRightIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

import SiteContainer from "@/components/common/SiteContainer";
import type { InitiativeBentoAdditionalSection } from "@/constant/initiativeDetailsContent";
import { cn } from "@/utilities/cn";

const BENTO_CARD_CLASS =
  "flex flex-col rounded-[18px] border border-[#E6E6E6] bg-white";

type InitiativeDetailBentoAdditionalProps = {
  section: InitiativeBentoAdditionalSection;
};

function BentoReadMore({
  href,
  className,
  light,
}: {
  href: string;
  className?: string;
  light?: boolean;
}) {
  const isExternal = href.startsWith("http");

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cn(
        "group inline-flex items-center gap-1.5 font-plusJakartaSans text-[14px] font-medium sm:text-[15px]",
        light ? "text-white" : "text-primary-50",
        className,
      )}
    >
      <span>Read More</span>
      <ArrowRightIcon
        className="size-4 stroke-[2] transition-transform duration-200 group-hover:translate-x-1"
        aria-hidden
      />
    </Link>
  );
}

export default function InitiativeDetailBentoAdditional({
  section,
}: InitiativeDetailBentoAdditionalProps) {
  const { practicalSkills, languageLearning, globeCard } = section;

  return (
    <SiteContainer as="section" className="pb-8 sm:pb-10 lg:pb-8">
      {/*
        Mobile: photo → Language Learning (full) → Practical Skills | Read More
        Desktop: photo left | Practical Skills top-right | Language + Globe bottom-right
      */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-12 lg:grid-rows-[auto_auto] lg:items-stretch lg:gap-3">
        {/* Photo */}
        <div className="relative order-1 col-span-2 min-h-[250px] overflow-hidden rounded-[18px] sm:min-h-[290px] lg:order-none lg:col-span-6 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:min-h-0 lg:h-full">
          <Image
            src={section.photoImage}
            alt={section.photoAlt}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Language Learning — full width on mobile, bottom-left on desktop */}
        <article
          className={cn(
            BENTO_CARD_CLASS,
            "order-2 col-span-2 items-center px-4 py-4 sm:px-5 sm:py-5 lg:order-none lg:col-span-3 lg:col-start-7 lg:row-start-2 lg:px-5 lg:py-4",
          )}
        >
          <h3 className="text-center font-plusJakartaSans text-[15px] font-bold text-[#000000] sm:text-[16px] lg:text-[17px]">
            {languageLearning.title}
          </h3>

          <div className="mt-3 flex items-center justify-center gap-2.5 sm:gap-3 lg:mt-3 lg:gap-3">
            {languageLearning.flags.map((flag) => (
              <div
                key={flag.src}
                className="relative h-[38px] w-[38px] shrink-0 overflow-hidden rounded-[8px] sm:h-[42px] sm:w-[42px] lg:h-[44px] lg:w-[44px]"
              >
                <Image
                  src={flag.src}
                  alt={flag.alt}
                  fill
                  className="object-cover object-center"
                  sizes="52px"
                />
              </div>
            ))}
          </div>

          <p className="mx-auto mt-3 max-w-[520px] text-center font-plusJakartaSans text-[12px] leading-[18px] text-[#9E9E9E] sm:text-[13px] sm:leading-[20px] lg:mt-3 lg:max-w-none lg:text-[14px] lg:leading-[22px]">
            {languageLearning.description}
          </p>
        </article>

        {/* Practical Skills — half width on mobile, top-right on desktop */}
        <article
          className={cn(
            BENTO_CARD_CLASS,
            "order-3 col-span-1 items-center px-2.5 py-3.5 sm:px-3 sm:py-4 lg:order-none lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:px-7 lg:py-5",
          )}
        >
          <h3 className="text-center font-plusJakartaSans text-[12px] font-bold leading-snug text-[#000000] sm:text-[13px] lg:text-[19px]">
            {practicalSkills.title}
          </h3>

          <div className="relative mx-auto mt-2.5 h-[112px] w-full overflow-hidden sm:mt-3 sm:h-[124px] lg:mt-4 lg:h-[140px] lg:max-w-[260px]">
            <Image
              src={practicalSkills.image}
              alt={practicalSkills.imageAlt}
              fill
              className="object-contain object-center scale-[1.32] sm:scale-[1.36] lg:scale-[1.4]"
              sizes="(max-width: 1024px) 50vw, 260px"
            />
          </div>

          <p className="mx-auto mt-2.5 text-center font-plusJakartaSans text-[10px] leading-[15px] text-[#9E9E9E] sm:mt-3 sm:text-[11px] sm:leading-[16px] lg:mt-4 lg:max-w-[520px] lg:text-[15px] lg:leading-[26px]">
            {practicalSkills.description}
          </p>
        </article>

        {/* Read More — half width on mobile, bottom-right on desktop */}
        <article className="order-4 col-span-1 flex min-h-[148px] flex-col items-center justify-center gap-2 rounded-[12px] bg-[#273845] px-2.5 py-3.5 sm:min-h-[156px] sm:px-3 sm:py-4 lg:order-none lg:col-span-3 lg:col-start-10 lg:row-start-2 lg:min-h-0 lg:h-full lg:gap-2.5 lg:rounded-[18px] lg:px-4 lg:py-4">
          <GlobeAltIcon
            className="size-[36px] shrink-0 stroke-[1] text-white sm:size-[40px] lg:size-[50px]"
            aria-hidden
          />
          <BentoReadMore
            href={globeCard.readMoreHref}
            light
            className="text-[11px] sm:text-[12px] lg:text-[13px]"
          />
        </article>
      </div>
    </SiteContainer>
  );
}
