"use client";

import Image from "next/image";
import { Noto_Nastaliq_Urdu, Noto_Serif } from "next/font/google";

import SiteContainer from "@/components/common/SiteContainer";
import type { InitiativeDetailItem } from "@/lib/initiativeDetails";
import InitiativeDetailSocialLinks from "./InitiativeDetailSocialLinks";

const INITIATIVE_HERO_GRADIENT =
  "linear-gradient(168.58deg, rgba(4, 17, 29, 0) 10.18%, rgba(19, 76, 131, 0.4) 108.31%)";

const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: "400",
  display: "swap",
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

type InitiativeDetailHeroMaktabProps = {
  initiative: InitiativeDetailItem;
};

function QuoteMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M18.5 36C11.5 36 6 30.2 6 22.5 6 12.8 13.8 4 24.5 0 22.8 4.8 22 9.6 22 14.5c0 5.8 3.5 10.8 8.5 13.2C27.8 29.8 24.5 33.5 18.5 36ZM42.5 36C35.5 36 30 30.2 30 22.5 30 12.8 37.8 4 48.5 0 46.8 4.8 46 9.6 46 14.5c0 5.8 3.5 10.8 8.5 13.2C51.8 29.8 48.5 33.5 42.5 36Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function InitiativeDetailHeroMaktab({
  initiative,
}: InitiativeDetailHeroMaktabProps) {
  const maktabHero = initiative.maktabHero;

  if (!maktabHero) {
    return null;
  }

  const displayTitle = maktabHero.heroTitle ?? initiative.title;

  return (
    <section>
      <div className="relative w-full">
        <div className="relative h-[320px] w-full sm:h-[420px] lg:h-[520px]">
          <Image
            src={initiative.heroImage}
            alt={displayTitle}
            fill
            priority
            quality={90}
            className="object-cover object-center"
            style={{
              objectPosition: initiative.heroImagePosition ?? "center center",
            }}
            sizes="100vw"
          />

          {initiative.heroGradient !== false ? (
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: INITIATIVE_HERO_GRADIENT }}
              aria-hidden
            />
          ) : null}

          {/* Hover zone — image + text only, excludes logo and social bar */}
          <div className="group absolute inset-x-0 top-0 bottom-16 z-[1] sm:bottom-20 lg:bottom-24">
            {/* Dari — default */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-end px-4 opacity-100 transition-opacity duration-300 group-hover:opacity-0 sm:px-8 lg:px-14">
              {maktabHero.dariCalligraphyImage ? (
                <div className="relative h-[120px] w-[min(72%,320px)] sm:h-[160px] lg:h-[220px] lg:w-[min(58%,480px)]">
                  <Image
                    src={maktabHero.dariCalligraphyImage}
                    alt=""
                    fill
                    className="object-contain object-right"
                    sizes="(max-width: 1024px) 72vw, 480px"
                    aria-hidden
                  />
                </div>
              ) : (
                <p
                  dir="rtl"
                  lang="fa"
                  className={`${notoNastaliqUrdu.className} max-w-[min(85%,360px)] text-right text-[36px] font-normal leading-[1.5] tracking-normal text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:max-w-[480px] sm:text-[56px] lg:max-w-[640px] lg:text-[96px]`}
                >
                  {maktabHero.dariText}
                </p>
              )}
            </div>

            {/* English quote — on hover */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:px-8">
              <div className="flex w-full max-w-[520px] flex-col items-center rounded-[24px] bg-black/20 px-6 py-7 text-center backdrop-blur-[2px] sm:px-10 sm:py-9 lg:px-12 lg:py-10">
                <QuoteMark className="mb-4 h-6 w-8 text-primary-50 sm:mb-5 sm:h-7 sm:w-9" />
                <p className="font-plusJakartaSans text-[17px] font-normal leading-[1.6] text-white sm:text-[19px] sm:leading-[1.55] lg:text-[22px] lg:leading-[1.5]">
                  &ldquo;{maktabHero.englishQuote.text}&rdquo;
                </p>
                <div className="my-5 h-px w-[72px] bg-white sm:my-6" aria-hidden />
                <p
                  className={`${notoSerif.className} text-[16px] font-bold leading-[1.4] text-white sm:text-[18px] lg:text-[20px]`}
                >
                  {maktabHero.englishQuote.attribution}
                </p>
              </div>
            </div>
          </div>

          <SiteContainer className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
            <div className="relative flex items-end justify-between gap-4">
              {initiative.heroLogo ? (
                <div className="pointer-events-auto relative size-[84px] shrink-0 translate-y-[calc(50%+3px)] overflow-hidden rounded-[15px] border-4 border-white bg-white shadow-[0_4px_24px_rgba(0,0,0,0.12)] sm:size-[120px] sm:rounded-[20px] sm:border-[6px] lg:size-[140px] lg:rounded-[22px]">
                  <Image
                    src={initiative.heroLogo}
                    alt=""
                    fill
                    className="scale-[1.52] object-contain object-center sm:scale-[1.58] lg:scale-[1.65]"
                    sizes="(max-width: 640px) 84px, (max-width: 1024px) 120px, 140px"
                  />
                </div>
              ) : (
                <span aria-hidden />
              )}

              {initiative.socialLinks?.length ? (
                <InitiativeDetailSocialLinks
                  links={initiative.socialLinks}
                  className="pointer-events-auto shrink-0 translate-y-[calc(50%+3px)]"
                />
              ) : null}
            </div>
          </SiteContainer>
        </div>
      </div>

      <SiteContainer className="pt-[62px] text-center sm:pt-[80px] lg:pt-[88px]">
        <h1 className="font-plusJakartaSans text-[26px] font-bold leading-[1.25] text-[#252525] sm:text-[32px] lg:text-[40px]">
          {displayTitle}
        </h1>
        <p className="mx-auto mt-3 max-w-[820px] font-plusJakartaSans text-[15px] leading-relaxed text-[#667085] sm:mt-4 sm:text-[16px] lg:text-[18px]">
          {initiative.description}
        </p>
      </SiteContainer>
    </section>
  );
}
