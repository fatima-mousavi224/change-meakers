import Image from "next/image";

import SiteContainer from "@/components/common/SiteContainer";
import type { InitiativeDetailItem } from "@/lib/initiativeDetails";
import { cn } from "@/utilities/cn";
import InitiativeDetailSocialLinks from "./InitiativeDetailSocialLinks";

const INITIATIVE_HERO_GRADIENT =
  "linear-gradient(168.58deg, rgba(4, 17, 29, 0) 10.18%, #134C83 108.31%)";

type InitiativeDetailHeroProps = {
  initiative: InitiativeDetailItem;
};

export default function InitiativeDetailHero({
  initiative,
}: InitiativeDetailHeroProps) {
  return (
    <section>
      <div className="relative w-full">
        <div className="relative h-[320px] w-full sm:h-[420px] lg:h-[520px]">
          <Image
            src={initiative.heroImage}
            alt={initiative.title}
            fill
            priority
            quality={90}
            className="object-cover object-center"
            style={{
              objectPosition: initiative.heroImagePosition ?? "center top",
            }}
            sizes="100vw"
          />
          {initiative.heroGradient !== false ? (
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  typeof initiative.heroGradient === "string"
                    ? initiative.heroGradient
                    : INITIATIVE_HERO_GRADIENT,
              }}
              aria-hidden
            />
          ) : null}

          <SiteContainer className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
            <div className="relative flex items-end justify-between gap-4">
              {initiative.heroLogo ? (
                <div
                  className={cn(
                    "pointer-events-auto relative size-[84px] shrink-0 translate-y-[calc(50%+3px)] overflow-hidden rounded-[15px] border-4 border-white bg-white shadow-[0_4px_24px_rgba(0,0,0,0.12)] sm:size-[120px] sm:rounded-[20px] sm:border-[6px] lg:size-[140px] lg:rounded-[22px]",
                    initiative.heroLogoClassName,
                  )}
                >
                  <Image
                    src={initiative.heroLogo}
                    alt=""
                    fill
                    className={cn(
                      "object-contain object-center p-1",
                      initiative.heroLogoImageClassName,
                    )}
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

      <SiteContainer
        className={cn(
          "text-center",
          initiative.heroLogo
            ? "pt-[62px] sm:pt-[80px] lg:pt-[88px]"
            : "pt-8 sm:pt-10 lg:pt-12",
        )}
      >
        <h1 className="font-plusJakartaSans text-[26px] font-bold leading-[1.25] text-[#252525] sm:text-[32px] lg:text-[40px]">
          {initiative.heroTitle ?? initiative.title}
        </h1>
        {!initiative.hideHeroDescription ? (
          <p className="mx-auto mt-3 max-w-[820px] font-plusJakartaSans text-[15px] leading-relaxed text-[#667085] sm:mt-4 sm:text-[16px] lg:text-[18px]">
            {initiative.description}
          </p>
        ) : null}
      </SiteContainer>
    </section>
  );
}
