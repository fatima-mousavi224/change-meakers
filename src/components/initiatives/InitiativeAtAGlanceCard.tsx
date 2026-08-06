"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

import type { InitiativeAtAGlanceCard as AtAGlanceCard } from "@/constant/initiativeDetailsContent";
import { cn } from "@/utilities/cn";

type InitiativeAtAGlanceCardProps = {
  card: AtAGlanceCard;
  className?: string;
  onOpenModal?: () => void;
  /** Mobile-only: half-width top row vs full-width bottom row */
  mobileVariant?: "half" | "full";
};

function ReadMoreTrigger({
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
      <span>Read More</span>
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
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
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

  return <span className={triggerClassName}>{content}</span>;
}

export default function InitiativeAtAGlanceCard({
  card,
  className,
  onOpenModal,
  mobileVariant = "half",
}: InitiativeAtAGlanceCardProps) {
  const showReadMore = Boolean(
    card.readMoreHref || card.readMoreModal || card.showReadMore,
  );
  const isLargeImage = card.imageScale === "large";
  const isSmallImage = card.imageScale === "small";
  const isHalfMobile = mobileVariant === "half";

  if (card.variant === "report") {
    return (
      <article
        className={cn(
          "flex h-full flex-col overflow-hidden border-0",
          isHalfMobile
            ? "min-h-[260px] rounded-[12px] px-3 py-4 sm:px-4 lg:min-h-[380px] lg:rounded-[18px] lg:px-8 lg:py-6"
            : "col-span-2 min-h-[240px] rounded-[18px] px-5 py-5 lg:min-h-[380px] lg:px-8 lg:py-6",
          className,
        )}
        style={{ backgroundColor: card.backgroundColor ?? "#BCCACA" }}
      >
        <div
          className={cn(
            "flex min-h-0 flex-1 pt-3 sm:pt-4 lg:pt-6",
            isHalfMobile
              ? "flex-col gap-3 lg:flex-row lg:items-start lg:justify-start lg:gap-8"
              : "flex-row items-start justify-start gap-3 lg:gap-4",
          )}
        >
          <p
            className={cn(
              "min-w-0 shrink self-start text-left font-serif italic leading-[1.35] text-[#252525] md:mt-11 mt-6",
              isHalfMobile
                ? "text-[12px] sm:text-[13px] lg:max-w-[52%] lg:pt-4 lg:text-[30px]"
                : "max-w-[52%] text-[21px] sm:text-[24px] lg:pt-4 lg:text-[30px]",
            )}
          >
            {card.title}
          </p>

          {card.image ? (
            <div
              className={cn(
                "flex shrink-0 items-start justify-end self-start",
                isHalfMobile
                  ? "mx-auto lg:mx-0 lg:-mr-1 lg:pt-4"
                  : "lg:-mr-1 lg:pt-4",
              )}
            >
              <div
                className={cn(
                  "relative origin-[72%_78%] -rotate-[10deg] sm:-rotate-[12deg] lg:-rotate-[14deg]",
                  isHalfMobile
                    ? "h-[118px] w-[82px] sm:h-[128px] sm:w-[90px] lg:h-[278px] lg:w-[190px]"
                    : "h-[200px] w-[140px] sm:h-[230px] sm:w-[162px] lg:h-[278px] lg:w-[190px]",
                )}
              >
                <Image
                  src={card.image}
                  alt={card.imageAlt ?? card.title}
                  fill
                  className="object-contain object-center drop-shadow-[0_12px_28px_rgba(0,0,0,0.2)]"
                  sizes="(max-width: 1024px) 90px, 185px"
                />
              </div>
            </div>
          ) : null}
        </div>

        {showReadMore ? (
          <div
            className={cn(
              "shrink-0 self-start text-left",
              isHalfMobile ? "mt-3 lg:mt-auto lg:pt-5" : "mt-auto pt-5",
            )}
          >
            <ReadMoreTrigger
              href={card.readMoreHref}
              onClick={card.readMoreModal ? onOpenModal : undefined}
              className={isHalfMobile ? "text-[12px] lg:text-[15px]" : undefined}
            />
          </div>
        ) : null}
      </article>
    );
  }

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden border border-[#E6E6E6] bg-white",
        isHalfMobile
          ? "rounded-[12px] px-3 py-4 sm:px-4 lg:min-h-[380px] lg:rounded-[18px] lg:px-8 lg:py-6"
          : "col-span-2 min-h-[240px] rounded-[18px] px-5 py-5 lg:min-h-[380px] lg:px-8 lg:py-6",
        className,
      )}
    >
      <h3
        className={cn(
          "shrink-0 text-center font-plusJakartaSans font-bold leading-snug text-[#000000]",
          isHalfMobile
            ? "text-[12px] sm:text-[13px] lg:text-[20px]"
            : "text-[16px] sm:text-[17px] lg:text-[20px]",
        )}
      >
        {card.title}
      </h3>

      {card.variant === "image" && card.image ? (
        <div
          className={cn(
            "flex flex-1 flex-col items-center justify-center",
            isHalfMobile
              ? "mt-3 gap-2.5 lg:mt-5 lg:flex-1 lg:gap-4"
              : "mt-5 flex-1 gap-4",
          )}
        >
          <div
            className={cn(
              "relative w-full",
              isSmallImage
                ? isHalfMobile
                  ? "h-[72px] sm:h-[80px] lg:h-[150px]"
                  : "h-[140px] sm:h-[155px] lg:h-[160px]"
                : isLargeImage
                  ? isHalfMobile
                    ? "h-[92px] sm:h-[102px] lg:h-[220px]"
                    : "h-[190px] sm:h-[210px] lg:h-[220px]"
                  : isHalfMobile
                    ? "h-[96px] sm:h-[106px] lg:h-[240px]"
                    : "h-[210px] sm:h-[230px] lg:h-[240px]",
            )}
          >
            <Image
              src={card.image}
              alt={card.imageAlt ?? card.title}
              fill
              className={cn(
                "object-contain object-center",
                isSmallImage
                  ? isHalfMobile
                    ? "scale-[0.82] sm:scale-[0.88] lg:scale-[0.95]"
                    : "scale-[0.88] sm:scale-[0.92] lg:scale-[0.95]"
                  : isLargeImage
                    ? isHalfMobile
                      ? "scale-[1.15] sm:scale-[1.2] lg:scale-[1.35]"
                      : "scale-[1.25] sm:scale-[1.3] lg:scale-[1.35]"
                    : isHalfMobile
                      ? "scale-[1.05] sm:scale-[1.08] lg:scale-[1.15]"
                      : "scale-[1.1] sm:scale-[1.12] lg:scale-[1.15]",
              )}
              sizes="(max-width: 1024px) 50vw, 400px"
            />
          </div>

          <p
            className={cn(
              "text-center font-plusJakartaSans text-[#9E9E9E]",
              isHalfMobile
                ? "max-w-none text-[11px] leading-[17px] sm:text-[12px] sm:leading-[18px] lg:max-w-[340px] lg:text-[16px] lg:leading-[28px]"
                : "max-w-[340px] text-[15px] leading-[26px] sm:text-[16px] sm:leading-[28px]",
            )}
          >
            {card.description}
          </p>
        </div>
      ) : (
        <p
          className={cn(
            "mt-5 flex-1 font-plusJakartaSans text-[#9E9E9E]",
            isHalfMobile
              ? "text-[11px] leading-[17px] sm:text-[12px] sm:leading-[18px] lg:text-[16px] lg:leading-[28px]"
              : "text-[15px] leading-[26px] sm:text-[16px] sm:leading-[28px]",
          )}
        >
          {card.description}
        </p>
      )}

      {showReadMore ? (
        <div
          className={cn(
            "shrink-0 self-start",
            isHalfMobile ? "mt-3 lg:mt-5" : "mt-5",
          )}
        >
          <ReadMoreTrigger
            href={card.readMoreHref}
            onClick={card.readMoreModal ? onOpenModal : undefined}
            className={isHalfMobile ? "text-[12px] lg:text-[15px]" : undefined}
          />
        </div>
      ) : null}
    </article>
  );
}
