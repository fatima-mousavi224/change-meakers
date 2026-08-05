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
  const isHalfMobile = mobileVariant === "half";

  return (
    <article
      className={cn(
        "flex h-full flex-col border border-[#E6E6E6] bg-white",
        isHalfMobile
          ? "rounded-[12px] px-3 py-5 sm:px-4 lg:min-h-[491px] lg:rounded-[18px] lg:px-8 lg:py-8"
          : "col-span-2 min-h-[300px] rounded-[18px] px-5 py-6 lg:col-span-1 lg:min-h-[491px] lg:px-8 lg:py-8",
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
              ? "mt-3 gap-2.5 lg:mt-7 lg:flex-1 lg:gap-6"
              : "mt-7 flex-1 gap-6",
          )}
        >
          <div
            className={cn(
              "relative w-full",
              isLargeImage
                ? isHalfMobile
                  ? "h-[92px] sm:h-[102px] lg:h-[300px]"
                  : "h-[250px] sm:h-[285px] lg:h-[300px]"
                : isHalfMobile
                  ? "h-[96px] sm:h-[106px] lg:h-[320px]"
                  : "h-[260px] sm:h-[300px] lg:h-[320px]",
            )}
          >
            <Image
              src={card.image}
              alt={card.imageAlt ?? card.title}
              fill
              className={cn(
                "object-contain object-center",
                isLargeImage
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
            "mt-7 flex-1 font-plusJakartaSans text-[#9E9E9E]",
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
            isHalfMobile ? "mt-3 lg:mt-7" : "mt-7",
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
