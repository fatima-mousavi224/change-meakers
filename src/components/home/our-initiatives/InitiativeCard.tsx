"use client";

import { cn } from "@/utilities/cn";
import {
  getInitiativeDetailPath,
  INITIATIVE_GRADIENT,
  type Initiative,
} from "@/constant/initiatives";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

type InitiativeCardProps = {
  initiative: Initiative;
  isActive: boolean;
  onHover: () => void;
  onTap: () => void;
};

export default function InitiativeCard({
  initiative,
  isActive,
  onHover,
  onTap,
}: InitiativeCardProps) {
  const detailHref = getInitiativeDetailPath(initiative.id);

  const handleCardClick = (event: React.MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("a")) return;

    if (window.matchMedia("(min-width: 1024px)").matches) {
      onHover();
      return;
    }

    onTap();
  };

  return (
    <article
      className="relative h-[340px] overflow-hidden rounded-[16px] sm:h-[380px] lg:h-[390px]"
      onMouseEnter={onHover}
      onClick={handleCardClick}
    >
      <Image
        src={initiative.image}
        alt={initiative.title}
        fill
        className="object-cover transition-transform duration-700"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />
      {/* Gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: INITIATIVE_GRADIENT }}
      />

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 p-5 transition-all duration-300",
          isActive && "translate-y-3 opacity-0",
        )}
      >
        <h3 className="line-clamp-2 font-plusJakartaSans text-[15px] font-semibold leading-snug text-white sm:text-[16px] lg:line-clamp-none lg:text-[23px]">
          {initiative.title}
        </h3>

        <span className="mt-3 block h-[3px] w-10 rounded-full bg-primary-50" />
      </div>

      <div
        className={cn(
          "absolute inset-0 z-20 p-5 opacity-0 transition-opacity duration-200",
          isActive && "opacity-100",
        )}
      >
        {initiative.logo && (
          <div
            className={cn(
              "relative size-12 overflow-hidden rounded-full bg-white/95",
              initiative.logoContainerClassName,
            )}
          >
            <Image
              src={initiative.logo}
              alt=""
              fill
              quality={100}
              className={cn(
                "object-contain p-1.5",
                initiative.logoClassName,
              )}
              style={
                initiative.logoObjectPosition
                  ? { objectPosition: initiative.logoObjectPosition }
                  : undefined
              }
              sizes="160px"
            />
          </div>
        )}

        <div
          className={cn(
            "absolute inset-x-5 bottom-5 translate-y-10 opacity-0 transition-all duration-500 ease-out",
            isActive && "translate-y-0 opacity-100",
          )}
        >
          <h3 className="line-clamp-3 font-plusJakartaSans text-[17px] font-semibold leading-[1.2] text-white sm:text-[24px] lg:line-clamp-none lg:text-[26px]">
            {initiative.title}
          </h3>

          <span className="mt-3 block h-[3px] w-10 rounded-full bg-primary-50 lg:mt-4 lg:w-16" />

          <p className="mt-3 line-clamp-3 font-plusJakartaSans text-[14px] leading-[20px] text-white/90 lg:mt-4 lg:line-clamp-none lg:text-[16px] lg:leading-[22px]">
            {initiative.description}
          </p>

          <Link
            href={detailHref}
            className="group/btn mt-3 inline-flex items-center gap-2 rounded-lg border border-white px-4 py-2 font-plusJakartaSans text-[10px] font-medium text-white transition-colors duration-200 hover:border-primary-50 hover:bg-primary-50 sm:text-[12px] lg:mt-4"
          >
            <span>{initiative.buttonText}</span>
            <ArrowRightIcon
              className="size-3.5 stroke-[2.5] transition-transform duration-200 group-hover/btn:translate-x-1"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
