import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

import ScrollReveal from "@/components/common/ScrollReveal";
import SiteContainer from "@/components/common/SiteContainer";
import type { InitiativeBentoNycpSection } from "@/constant/initiativeDetailsContent";
import { cn } from "@/utilities/cn";

const BENTO_CARD_CLASS =
  "flex flex-col rounded-[18px] border border-[#E6E6E6] bg-white";

type InitiativeDetailBentoNycpProps = {
  section: InitiativeBentoNycpSection;
};

function LearnMoreTrigger({
  href,
  onClick,
  className,
  light,
}: {
  href?: string;
  onClick?: () => void;
  className?: string;
  light?: boolean;
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

export default function InitiativeDetailBentoNycp({
  section,
}: InitiativeDetailBentoNycpProps) {
  const {
    resolutionCard,
    policiesInfluenced,
    individualsSurveyed,
    xCard,
  } = section;

  const showResolutionLearnMore = Boolean(
    resolutionCard.readMoreHref || resolutionCard.readMoreModal,
  );

  return (
    <>
      <SiteContainer as="section" className="pb-8 sm:pb-10 lg:pb-8">
        {/*
          Mobile: resolution | photo → policies (full) → individuals | established | X
          Desktop: resolution | photo | policies + stats
        */}
        <ScrollReveal>
        <div className="grid grid-cols-[1.75fr_3.25fr] items-stretch gap-3 lg:grid-cols-12 lg:grid-rows-2 lg:gap-3">
          {/* Afghanistan's First-Ever National Youth Resolution */}
          <article
            className={cn(
              BENTO_CARD_CLASS,
              "col-start-1 row-start-1 min-h-[188px] rounded-[12px] px-2.5 py-3 sm:min-h-[200px] sm:px-3 sm:py-3.5 lg:col-start-auto lg:row-start-auto lg:col-span-2 lg:row-span-2 lg:min-h-0 lg:rounded-[18px] lg:px-5 lg:pb-6 lg:pt-8",
            )}
          >
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
              <div className="flex w-full flex-col items-center gap-1 sm:gap-1.5 lg:gap-2">
                <h3 className="text-center font-plusJakartaSans text-[11px] font-bold leading-snug text-[#000000] sm:text-[13px] lg:text-[18px]">
                  {resolutionCard.title}
                </h3>

                <p className="mx-auto max-w-none text-center font-plusJakartaSans text-[10px] leading-[15px] text-[#9E9E9E] sm:text-[11px] sm:leading-[16px] lg:max-w-[320px] lg:text-[15px] lg:leading-[26px]">
                  {resolutionCard.description}
                </p>
              </div>
            </div>

            {showResolutionLearnMore ? (
              <div className="mt-auto flex w-full shrink-0 justify-start pt-2 sm:pt-3 lg:pt-3">
                <LearnMoreTrigger
                  href={resolutionCard.readMoreHref}
                  className="text-[11px] sm:text-[12px] lg:text-[15px]"
                />
              </div>
            ) : null}
          </article>

          {/* Group photo */}
          <div className="relative col-start-2 row-start-1 min-h-[188px] overflow-hidden rounded-[12px] sm:min-h-[200px] lg:col-start-auto lg:row-start-auto lg:col-span-5 lg:row-span-2 lg:min-h-0 lg:h-full lg:rounded-[18px]">
            <Image
              src={section.photoImage}
              alt={section.photoAlt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 62vw, 42vw"
            />
          </div>

          {/* Right column — policies + bottom stats */}
          <div className="contents lg:col-span-5 lg:row-span-2 lg:flex lg:flex-col lg:gap-3">
            <article
              className={cn(
                BENTO_CARD_CLASS,
                "col-span-2 row-start-2 rounded-[12px] px-3 py-3.5 sm:px-4 sm:py-4 lg:col-span-full lg:row-start-auto lg:rounded-[18px] lg:px-5 lg:py-5",
              )}
            >
              <h3 className="text-center font-plusJakartaSans text-[13px] font-bold text-[#000000] sm:text-[15px] lg:text-[18px]">
                {policiesInfluenced.title}
              </h3>

              <div className="mt-2.5 flex items-end justify-between gap-1 sm:mt-3 sm:gap-1.5 lg:mt-4 lg:gap-2">
                {policiesInfluenced.flags.map((flag) => (
                  <div
                    key={flag.label}
                    className="flex min-w-0 flex-1 flex-col items-center"
                  >
                    <div className="relative h-[26px] w-[34px] shrink-0 overflow-hidden rounded-[3px] sm:h-[30px] sm:w-[38px] lg:h-[36px] lg:w-[52px] lg:rounded-[4px]">
                      <Image
                        src={flag.src}
                        alt={flag.alt}
                        fill
                        className="object-cover object-center scale-[1.14] sm:scale-[1.15] lg:scale-[1.12]"
                        sizes="52px"
                      />
                    </div>
                    <span className="mt-1 text-center font-plusJakartaSans text-[7px] font-medium uppercase leading-none text-[#9E9E9E] sm:text-[8px] lg:mt-1.5 lg:text-[11px]">
                      {flag.label}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <div className="col-span-2 row-start-3 grid grid-cols-3 gap-3 lg:col-span-full lg:row-start-auto lg:min-h-0 lg:flex-1">
              <article
                className={cn(
                  BENTO_CARD_CLASS,
                  "min-h-[118px] items-center justify-center rounded-[12px] px-1.5 py-2.5 sm:min-h-[128px] sm:px-2 sm:py-3 lg:min-h-0 lg:h-full lg:rounded-[18px] lg:px-4 lg:py-4",
                )}
              >
                <p className="text-center font-plusJakartaSans text-[22px] font-bold leading-none text-[#000000] sm:text-[26px] lg:text-[36px]">
                  {individualsSurveyed.count}
                </p>
                <p className="mt-0.5 text-center font-plusJakartaSans text-[10px] font-semibold text-[#575757] sm:text-[11px] lg:mt-1 lg:text-[14px]">
                  {individualsSurveyed.label}
                </p>
                <p className="mt-0.5 text-center font-plusJakartaSans text-[8px] leading-[11px] text-[#9E9E9E] sm:text-[9px] sm:leading-[12px] lg:mt-1 lg:text-[11px] lg:leading-[15px]">
                  {individualsSurveyed.description}
                </p>
              </article>

              <article
                className={cn(
                  BENTO_CARD_CLASS,
                  "min-h-[132px] items-center justify-center rounded-[12px] px-2 py-3 sm:min-h-[140px] sm:px-3 sm:py-4 lg:h-full lg:rounded-[18px] lg:px-4 lg:py-4",
                )}
              >
                <p className="text-center font-plusJakartaSans text-[10px] font-semibold text-[#575757] sm:text-[11px] lg:text-[14px]">
                  {section.establishedLabel}
                </p>
                <p className="mt-0.5 text-center font-plusJakartaSans text-[22px] font-bold leading-none text-[#000000] sm:text-[26px] lg:mt-1 lg:text-[36px]">
                  {section.establishedYear}
                </p>
              </article>

              <article className="flex min-h-[118px] flex-col items-center justify-between rounded-[12px] bg-[#000000] px-1.5 py-2.5 sm:min-h-[128px] sm:px-2 sm:py-3 lg:min-h-0 lg:h-full lg:rounded-[18px] lg:px-3 lg:py-4">
                <div className="flex flex-1 items-center justify-center">
                  <FaXTwitter
                    className="size-[32px] text-white sm:size-[36px] lg:size-[52px]"
                    aria-hidden
                  />
                </div>
                <LearnMoreTrigger
                  href={xCard.readMoreHref}
                  light
                  className="self-center text-[10px] sm:text-[11px] lg:text-[13px]"
                />
              </article>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </SiteContainer>
    </>
  );
}
