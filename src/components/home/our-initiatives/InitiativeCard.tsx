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
};

export default function InitiativeCard({ initiative }: InitiativeCardProps) {
  const detailHref = getInitiativeDetailPath(initiative.id);
  const isNycp = initiative.id === "nycp";

  return (
    <article className="group relative h-[340px] overflow-hidden rounded-[16px] sm:h-[380px] lg:h-[390px]">
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
          "absolute inset-x-0 bottom-0 z-10 p-5 transition-all duration-300 group-hover:translate-y-3 group-hover:opacity-0",
          isNycp && "max-lg:hidden",
        )}
      >
        <h3 className="font-plusJakartaSans text-[15px] font-semibold leading-snug text-white sm:text-[16px] lg:text-[23px]">
          {initiative.title}
        </h3>

        <span className="mt-3 block h-[3px] w-10 rounded-full bg-primary-50" />
      </div>

      <div
        className={cn(
          "absolute inset-0 z-20 p-5 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
          isNycp &&
            "max-lg:flex max-lg:flex-col max-lg:opacity-100 lg:block lg:opacity-0",
        )}
      >
        {initiative.logo && (
          <div
            className={cn(
              "relative size-12 overflow-hidden rounded-full bg-white/95",
              isNycp && "max-lg:shrink-0",
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
            "absolute inset-x-5 bottom-5 translate-y-10 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100",
            isNycp &&
              "max-lg:relative max-lg:inset-x-0 max-lg:bottom-auto max-lg:mt-3 max-lg:flex max-lg:min-h-0 max-lg:flex-1 max-lg:translate-y-0 max-lg:flex-col max-lg:opacity-100",
          )}
        >
          <h3
            className={cn(
              "font-plusJakartaSans text-[22px] font-semibold leading-[1.15] text-white sm:text-[24px] lg:text-[26px]",
              isNycp &&
                "max-lg:text-[17px] max-lg:leading-[1.25] sm:max-lg:text-[18px]",
            )}
          >
            {initiative.title}
          </h3>

          <span
            className={cn(
              "mt-4 block h-[3px] w-16 rounded-full bg-primary-50",
              isNycp && "max-lg:mt-3 max-lg:w-10",
            )}
          />

          <p
            className={cn(
              "mt-4 font-plusJakartaSans text-[16px] leading-[22px] text-white/90",
              isNycp && "max-lg:mt-3 max-lg:text-[14px] max-lg:leading-[20px]",
            )}
          >
            {initiative.description}
          </p>

          <Link
            href={detailHref}
            className={cn(
              "group/btn mt-4 inline-flex items-center gap-2 rounded-lg border border-white px-4 py-2 font-plusJakartaSans text-[10px] font-medium text-white transition-colors duration-200 hover:border-primary-50 hover:bg-primary-50 sm:text-[12px]",
              isNycp && "max-lg:mt-auto max-lg:self-start max-lg:pt-4",
            )}
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
