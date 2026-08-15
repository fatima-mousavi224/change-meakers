"use client";

import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import type { ReactCompareSliderHandleProps } from "react-compare-slider";

import SiteContainer from "@/components/common/SiteContainer";
import EducationDeniedCountdown from "@/components/initiatives/EducationDeniedCountdown";
import type { InitiativeLetGirlsLearnSection as LetGirlsLearnContent } from "@/constant/initiativeDetailsContent";
import { cn } from "@/utilities/cn";

type InitiativeLetGirlsLearnSectionProps = {
  section: LetGirlsLearnContent;
};

function InitiativeCompareSliderHandle({
  disabled,
  portrait,
  style,
  ...props
}: ReactCompareSliderHandleProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className="flex h-full flex-col items-center"
      style={{
        cursor: disabled ? "not-allowed" : portrait ? "ns-resize" : "ew-resize",
        pointerEvents: "none",
        ...style,
      }}
    >
      <div
        className="w-[2px] flex-1 bg-white shadow-[0_0_8px_rgba(0,0,0,0.25)]"
        style={{ pointerEvents: "auto" }}
      />
      <div
        className="pointer-events-auto flex size-9 shrink-0 items-center justify-center gap-0.5 rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.18)]"
        style={{ pointerEvents: "auto" }}
      >
        <ChevronLeftIcon
          className="size-3 stroke-[2.5] text-[#252525]"
          aria-hidden
        />
        <ChevronRightIcon
          className="size-3 stroke-[2.5] text-[#252525]"
          aria-hidden
        />
      </div>
      <div
        className="w-[2px] flex-1 bg-white shadow-[0_0_8px_rgba(0,0,0,0.25)]"
        style={{ pointerEvents: "auto" }}
      />
    </div>
  );
}

export default function InitiativeLetGirlsLearnSection({
  section,
}: InitiativeLetGirlsLearnSectionProps) {
  return (
    <SiteContainer as="section" className="pb-12 sm:pb-16 lg:pb-12">
      <div className="flex flex-col gap-3 lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-5">
        <div className="overflow-hidden rounded-[18px] border border-[#E6E6E6] lg:col-span-7">
          <ReactCompareSlider
            className="h-[200px] w-full lg:h-full lg:min-h-[420px]"
            handle={<InitiativeCompareSliderHandle />}
            itemOne={
              <ReactCompareSliderImage
                src={section.compareBeforeImage}
                alt={section.compareBeforeAlt}
                style={{ objectFit: "cover" }}
              />
            }
            itemTwo={
              <ReactCompareSliderImage
                src={section.compareAfterImage}
                alt={section.compareAfterAlt}
                style={{ objectFit: "cover" }}
              />
            }
          />
        </div>

        <article
          className={cn(
            "flex h-full flex-col rounded-[18px] border border-[#E6E6E6] bg-white px-5 pb-6 pt-5 lg:col-span-5 lg:px-6 lg:py-[30px]",
          )}
        >
          <div className="text-center">
            <h2 className="font-plusJakartaSans text-[20px] font-bold leading-tight text-[#000000] lg:text-[22px]">
              {section.hashtag}
            </h2>
            <p className="font-plusJakartaSans text-[13px] font-normal text-[#9E9E9E] lg:text-[16px]">
              {section.subtitle}
            </p>
            <div
              className="mx-auto mt-4 h-px w-full bg-[#F2F2F2] lg:mt-5"
              aria-hidden
            />
          </div>

          <EducationDeniedCountdown
            startDate={section.countdownStartDate}
            className="mt-4 lg:mt-6"
          />

          <div className="mt-4 rounded-[12px] border border-[#F2F2F2] bg-white px-3 py-4 text-center lg:mt-3 lg:px-8 lg:py-5">
            <p className="font-plusJakartaSans text-[15px] font-bold leading-[22px] text-[#000000] lg:text-[22px] lg:leading-[26px]">
              {section.highlightText}
            </p>
          </div>

          <p className="mt-4 text-left font-plusJakartaSans text-[13px] font-normal leading-[22px] text-[#9E9E9E] lg:mt-6 lg:text-[16px] lg:leading-[24px]">
            {section.description}
          </p>

          <div className="mt-4 flex w-full justify-center lg:mt-6">
            <Link
              href={section.ctaHref}
              target={section.ctaHref.startsWith("http") ? "_blank" : undefined}
              rel={
                section.ctaHref.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              className="group inline-flex items-center gap-1.5 font-plusJakartaSans text-[14px] font-medium text-[#106190]"
            >
              <span>{section.ctaLabel}</span>
              <ArrowRightIcon
                className="size-4 stroke-[2] transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          </div>
        </article>
      </div>
    </SiteContainer>
  );
}
