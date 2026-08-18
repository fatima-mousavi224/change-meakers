

"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { FaTelegramPlane } from "react-icons/fa";

import ScrollReveal from "@/components/common/ScrollReveal";
import SectionHeading from "@/components/common/SectionHeading";
import SiteContainer from "@/components/common/SiteContainer";
import StaggerReveal, { StaggerItem } from "@/components/common/StaggerReveal";
import type { InitiativeAtAGlanceDigitalLibrary as AtAGlanceDigitalLibrary } from "@/constant/initiativeDetailsContent";
import { cn } from "@/utilities/cn";

const CARD_CLASS =
  "flex h-full flex-col overflow-hidden rounded-[12px] border border-[#E6E6E6] bg-white lg:min-h-[380px] lg:rounded-[18px]";

type InitiativeAtAGlanceDigitalLibraryProps = {
  section: AtAGlanceDigitalLibrary;
};

export default function InitiativeAtAGlanceDigitalLibrary({
  section,
}: InitiativeAtAGlanceDigitalLibraryProps) {
  const { telegramLibrary, resourcesShared, sidebar } = section;

  return (
    <SiteContainer as="section" className="pb-12 sm:pb-16 lg:pb-12">
      <ScrollReveal>
        <SectionHeading title="At a Glance" />
      </ScrollReveal>

      <StaggerReveal className="grid grid-cols-2 items-stretch gap-3 lg:grid-cols-10 lg:gap-6">
        {/* =========================================================
            TELEGRAM LIBRARY
        ========================================================= */}
        <StaggerItem className="order-1 col-span-1 h-full lg:order-none lg:col-span-3">
          <article
            className={cn(
              CARD_CLASS,
              "px-3 py-4 sm:px-4 lg:px-8 lg:py-6",
            )}
          >
            <div className="relative mx-auto h-[118px] w-full sm:h-[140px] lg:h-[220px]">
              <Image
                src={telegramLibrary.image}
                alt={telegramLibrary.imageAlt}
                fill
                className="object-contain object-center"
                sizes="(max-width: 1024px) 50vw, 400px"
              />
            </div>

            <h3 className="mt-3 text-center font-plusJakartaSans text-[12px] font-bold leading-snug text-[#000000] sm:text-[13px] lg:mt-5 lg:text-[20px]">
              {telegramLibrary.title}
            </h3>

            <p className="mt-2.5 flex-1 text-center font-plusJakartaSans text-[11px] leading-[17px] text-[#575757] sm:text-[12px] sm:leading-[18px] lg:mt-4 lg:text-[16px] lg:leading-[28px]">
              {telegramLibrary.description}
            </p>
          </article>
        </StaggerItem>

        {/* =========================================================
            RESOURCES SHARED
        ========================================================= */}
        <StaggerItem className="order-2 col-span-1 row-span-2 h-full lg:order-none lg:col-span-3 lg:row-span-1">
          <article
            className={cn(
              CARD_CLASS,
              "px-3 py-3 sm:px-4 lg:px-8 lg:py-6",
            )}
          >
            <div className="flex h-full flex-col gap-1 lg:gap-1.5">
              <h3 className="shrink-0 text-center font-plusJakartaSans text-[12px] font-bold leading-tight text-[#000000] sm:text-[13px] lg:text-[20px]">
                {resourcesShared.title}
              </h3>

              <div className="relative mx-auto h-[20px] w-full max-w-[240px] shrink-0 overflow-hidden sm:h-[32px] sm:max-w-[320px] lg:h-[56px] lg:max-w-[400px]">
                <Image
                  src={resourcesShared.dividerImage}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="400px"
                  aria-hidden
                />
              </div>

              <div className="text-center font-plusJakartaSans text-[11px] leading-[15px] text-[#575757] sm:text-[12px] sm:leading-[18px] lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:gap-5 lg:text-[16px] lg:leading-[28px]">
                {resourcesShared.paragraphs.map((paragraph, index) => (
                  <p key={index} className="block">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </article>
        </StaggerItem>

        {/* =========================================================
            USERS
            Mobile only
        ========================================================= */}
        <StaggerItem className="order-3 col-span-1 h-full lg:hidden">
          <article
            className={cn(
              CARD_CLASS,
              "min-h-0 items-center justify-center px-3 py-2.5",
            )}
          >
            <p className="font-plusJakartaSans text-[10px] font-medium text-[#575757]">
              {sidebar.usersLabel}
            </p>

            <p className="mt-1 font-plusJakartaSans text-[20px] font-bold leading-none text-[#000000]">
              {sidebar.usersCount}
            </p>
          </article>
        </StaggerItem>

        {/* =========================================================
            SIDEBAR
            Mobile:
              Telegram + Image side by side
              Same height
              Image wider
        ========================================================= */}
        <StaggerItem className="order-4 col-span-2 h-full lg:order-none lg:col-span-4">
          <div
            className="
              grid
              h-full
              min-h-[140px]
              grid-cols-[0.7fr_1.3fr]
              gap-3

              lg:flex
              lg:min-h-[380px]
              lg:flex-col
              lg:gap-4
            "
          >
            {/* =====================================================
                PHOTO
                Mobile: taller
                Desktop: original
            ===================================================== */}
            <div
              className="
                relative
                order-2
                h-[145px]
                min-h-[145px]
                overflow-hidden
                rounded-[12px]

                lg:order-none
                lg:h-auto
                lg:min-h-[230px]
                lg:flex-[1.65]
                lg:rounded-[18px]
              "
            >
              <Image
                src={sidebar.photoImage}
                alt={sidebar.photoAlt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 65vw, 42vw"
              />
            </div>

            {/* =====================================================
                BOTTOM CARDS
            ===================================================== */}
            <div
              className="
                contents

                lg:grid
                lg:h-[150px]
                lg:shrink-0
                lg:grid-cols-2
                lg:gap-4
              "
            >
              {/* ===================================================
                  TELEGRAM CARD
                  Mobile: same height as image
              =================================================== */}
              <article
                className="
                  order-1
                  flex
                  h-[145px]
                  min-h-[145px]
                  flex-col
                  justify-between
                  overflow-hidden
                  rounded-[12px]
                  bg-[#273845]
                  px-3
                  py-4

                  sm:px-4

                  lg:order-none
                  lg:h-auto
                  lg:min-h-0
                  lg:rounded-[18px]
                  lg:px-5
                  lg:py-5
                "
              >
                <div className="flex flex-1 flex-col items-center justify-center">
                  <FaTelegramPlane
                    className="size-[28px] text-white sm:size-[32px] lg:size-[36px]"
                    aria-hidden
                  />
                </div>

                <div className="flex w-full justify-center">
                  <Link
                    href={sidebar.telegramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      group
                      inline-flex
                      items-center
                      gap-1.5
                      font-plusJakartaSans
                      text-[10px]
                      font-medium
                      text-white

                      sm:text-[13px]

                      lg:text-[15px]
                    "
                  >
                    <span>Read More</span>

                    <ArrowRightIcon
                      className="
                        size-4
                        stroke-[2]
                        transition-transform
                        duration-200
                        group-hover:translate-x-1
                      "
                      aria-hidden
                    />
                  </Link>
                </div>
              </article>

              {/* ===================================================
                  USERS CARD
                  Desktop only
              =================================================== */}
              <article
                className={cn(
                  CARD_CLASS,
                  `
                    hidden
                    min-h-[140px]
                    items-center
                    justify-center
                    px-3
                    py-4

                    sm:px-4

                    lg:order-none
                    lg:flex
                    lg:min-h-0
                    lg:px-5
                    lg:py-5
                  `,
                )}
              >
                <p className="font-plusJakartaSans text-[13px] font-medium text-[#575757] lg:text-[15px]">
                  {sidebar.usersLabel}
                </p>

                <p className="mt-1 font-plusJakartaSans text-[28px] font-bold leading-none text-[#000000] sm:text-[32px] lg:text-[38px]">
                  {sidebar.usersCount}
                </p>
              </article>
            </div>
          </div>
        </StaggerItem>
      </StaggerReveal>
    </SiteContainer>
  );
}