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
  label = "Read More",
}: {
  href?: string;
  onClick?: () => void;
  className?: string;
  label?: string;
}) {
  const content = (
    <>
      <span>{label}</span>
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
  const bodyParagraphs =
    card.paragraphs?.length && card.paragraphs.some(Boolean)
      ? card.paragraphs
      : card.description
        ? [card.description]
        : [];
  const isLargeImage = card.imageScale === "large";
  const isSmallImage = card.imageScale === "small";
  const isHalfMobile = mobileVariant === "half";

  if (card.variant === "report") {
    return (
      <article
        className={cn(
          "flex h-full flex-col overflow-hidden border-0",
          isHalfMobile
            ? "min-h-[260px] rounded-[12px] px-4 py-6 sm:min-h-[280px] sm:px-5 sm:py-7 lg:min-h-[320px] lg:rounded-[18px] lg:px-8 lg:py-8"
            : "col-span-2 min-h-[260px] rounded-[18px] px-5 py-6 sm:min-h-[280px] lg:col-span-1 lg:min-h-[320px] lg:px-8 lg:py-8",
          className,
        )}
        style={{ backgroundColor: card.backgroundColor ?? "#BCCACA" }}
      >
        <div
          className={cn(
            "flex min-h-0 flex-1 items-center",
            isHalfMobile
              ? "flex-col gap-4 pt-2 sm:pt-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:pt-4"
              : "flex-row items-center justify-between gap-4 pt-2 lg:gap-6 lg:pt-4",
          )}
        >
          <p
            className={cn(
              "min-w-0 shrink text-left font-serif italic leading-[1.35] text-[#252525]",
              isHalfMobile
                ? "text-[12px] sm:text-[13px] lg:max-w-[48%] lg:text-[28px]"
                : "max-w-[48%] text-[21px] sm:text-[24px] lg:text-[28px]",
            )}
          >
            {card.title}
          </p>

          {card.image ? (
            <div
              className={cn(
                "flex shrink-0 items-center justify-end",
                isHalfMobile ? "mx-auto lg:mx-0 lg:-mr-1" : "lg:-mr-1",
              )}
            >
              <div
                className={cn(
                  "relative origin-[72%_78%] -rotate-[10deg] sm:-rotate-[12deg] lg:-rotate-[14deg]",
                  isHalfMobile
                    ? "h-[118px] w-[82px] sm:h-[128px] sm:w-[90px] lg:h-[300px] lg:w-[205px]"
                    : "h-[200px] w-[140px] sm:h-[230px] sm:w-[162px] lg:h-[300px] lg:w-[205px]",
                )}
              >
                <Image
                  src={card.image}
                  alt={card.imageAlt ?? card.title}
                  fill
                  className="object-contain object-center drop-shadow-[0_12px_28px_rgba(0,0,0,0.2)]"
                  sizes="(max-width: 1024px) 90px, 205px"
                />
              </div>
            </div>
          ) : null}
        </div>

        {showReadMore ? (
          <div className="mt-auto flex w-full shrink-0 justify-center pt-4 lg:pt-5">
            <ReadMoreTrigger
              href={card.readMoreHref}
              onClick={card.readMoreModal ? onOpenModal : undefined}
              label={card.readMoreLabel}
              className={isHalfMobile ? "text-[12px] lg:text-[15px]" : undefined}
            />
          </div>
        ) : null}
      </article>
    );
  }

  const bodyTextClassName = cn(
    "text-center font-plusJakartaSans text-[#9E9E9E]",
    isHalfMobile
      ? "text-[11px] leading-[17px] sm:text-[12px] sm:leading-[18px] lg:text-[15px] lg:leading-[24px]"
      : "text-[13px] leading-[21px] sm:text-[14px] sm:leading-[23px] lg:text-[15px] lg:leading-[24px]",
  );

  const isImageCard = card.variant === "image" && Boolean(card.image);

  const isDefaultImage = !isSmallImage && !isLargeImage;

  const cardPaddingClassName = cn(
    "h-full min-h-[260px] py-6 sm:min-h-[280px] sm:py-7 lg:min-h-[320px] lg:py-8",
    isImageCard && isDefaultImage
      ? "px-4 sm:px-5 lg:px-6"
      : isImageCard
        ? "px-2 sm:px-2.5 lg:px-3"
        : "px-4 sm:px-5 lg:px-6",
    isHalfMobile
      ? "rounded-[12px] lg:rounded-[18px]"
      : "col-span-2 min-h-0 rounded-[18px] lg:col-span-1",
  );

  const titleClassName = cn(
    "shrink-0 text-center font-plusJakartaSans font-bold leading-snug text-[#000000]",
    isHalfMobile
      ? "text-[12px] sm:text-[13px] lg:text-[20px]"
      : "text-[14px] sm:text-[15px] lg:text-[20px]",
  );

  const imageContainerClassName = cn(
    "relative mx-auto w-full shrink-0",
    isSmallImage ? "overflow-visible" : "overflow-hidden",
    isImageCard ? "max-w-[290px] lg:max-w-[310px]" : "max-w-[280px]",
    isSmallImage
      ? isHalfMobile
        ? "h-[72px] sm:h-[80px] lg:h-[152px]"
        : "h-[108px] sm:h-[118px] lg:h-[152px]"
      : isLargeImage
        ? isHalfMobile
          ? "h-[78px] sm:h-[88px] lg:h-[190px]"
          : "h-[132px] sm:h-[148px] lg:h-[190px]"
        : isHalfMobile
          ? "h-[68px] sm:h-[76px] lg:h-[158px]"
          : "h-[112px] sm:h-[124px] lg:h-[158px]",
  );

  const imageScaleClassName = card.imageClassName
    ? card.imageClassName
    : isSmallImage
      ? ""
      : isLargeImage
        ? "scale-[1.08] sm:scale-[1.12] lg:scale-[1.24]"
        : "scale-[1] sm:scale-[1.02] lg:scale-[1.08]";

  const imageTopSpacingClassName = isSmallImage
    ? "mt-5 sm:mt-6 lg:mt-8"
    : "mt-1 sm:mt-1.5 lg:mt-2";

  const imageBottomSpacingClassName = isSmallImage
    ? "mt-6 sm:mt-8 lg:mt-10"
    : isDefaultImage
      ? "mt-1 sm:mt-1.5 lg:mt-1.5"
      : "mt-1.5 sm:mt-2 lg:mt-2.5";

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden border border-[#E6E6E6] bg-white [&_p]:text-[#9E9E9E]",
        "gap-0",
        cardPaddingClassName,
        className,
      )}
    >
      {isImageCard ? (
        <>
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
            <div className="flex w-full flex-col items-center">
              <h3 className={titleClassName}>{card.title}</h3>

              <div
                className={cn(
                  imageContainerClassName,
                  imageTopSpacingClassName,
                )}
              >
                <Image
                  src={card.image!}
                  alt={card.imageAlt ?? card.title}
                  fill
                  className={cn(
                    "object-contain object-center",
                    imageScaleClassName,
                  )}
                  sizes="(max-width: 1024px) 50vw, 400px"
                />
              </div>

              <p
                className={cn(
                  "mx-auto w-full max-w-none shrink-0 text-center",
                  isDefaultImage ? "px-1 sm:px-2" : "px-0.5",
                  imageBottomSpacingClassName,
                  bodyTextClassName,
                )}
              >
                {card.description}
              </p>
            </div>
          </div>

          {showReadMore ? (
            <div className="mt-auto flex w-full shrink-0 justify-center pt-2 lg:pt-3">
              <ReadMoreTrigger
                href={card.readMoreHref}
                onClick={card.readMoreModal ? onOpenModal : undefined}
                label={card.readMoreLabel}
                className={isHalfMobile ? "text-[12px] lg:text-[15px]" : undefined}
              />
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
            <div className="flex w-full flex-col items-center gap-1 sm:gap-1.5 lg:gap-2">
              <h3 className={titleClassName}>{card.title}</h3>

              {bodyParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={cn(
                    "mx-auto w-full max-w-none shrink-0 px-0.5 text-center",
                    bodyTextClassName,
                  )}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {showReadMore ? (
            <div className="mt-auto flex w-full shrink-0 justify-center pt-2 lg:pt-3">
              <ReadMoreTrigger
                href={card.readMoreHref}
                onClick={card.readMoreModal ? onOpenModal : undefined}
                label={card.readMoreLabel}
                className={isHalfMobile ? "text-[12px] lg:text-[15px]" : undefined}
              />
            </div>
          ) : null}
        </>
      )}
    </article>
  );
}
