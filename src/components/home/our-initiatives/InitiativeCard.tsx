"use client";

import { INITIATIVE_GRADIENT, type Initiative } from "@/constant/initiatives";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

type InitiativeCardProps = {
  initiative: Initiative;
};

export default function InitiativeCard({ initiative }: InitiativeCardProps) {
  const isExternal = initiative.href.startsWith("http");

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
      <div className="absolute inset-x-0 bottom-0 z-10 p-5 transition-all duration-300 group-hover:translate-y-3 group-hover:opacity-0">
        <h3 className="font-plusJakartaSans text-[15px] font-semibold leading-snug text-white sm:text-[16px] lg:text-[23px]">
          {initiative.title}
        </h3>

        <span className="mt-3 block h-[3px] w-10 rounded-full bg-primary-50" />
      </div>
      <div className="absolute inset-0 z-20 p-5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {initiative.logo && (
          <div className="relative size-12 overflow-hidden rounded-full bg-white/95">
            <Image
              src={initiative.logo}
              alt=""
              fill
              className="object-contain p-1"
              sizes="44px"
            />
          </div>
        )}
        <div className="absolute inset-x-5 bottom-5 translate-y-10 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <h3 className="font-plusJakartaSans text-[22px] font-semibold leading-[1.15] text-white sm:text-[24px] lg:text-[26px]">
            {initiative.title}
          </h3>

          <span className="mt-4 block h-[3px] w-16 rounded-full bg-primary-50" />

          <p className="mt-4 font-plusJakartaSans text-[16px] leading-[22px] text-white/90">
            {initiative.description}
          </p>

          <Link
            href={initiative.href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="group/btn mt-4 inline-flex items-center gap-2 rounded-lg border border-white px-4 py-2 font-plusJakartaSans text-[10px] font-medium text-white transition-colors duration-200 hover:border-primary-50 hover:bg-primary-50 sm:text-[12px]"
          >
            
            <span>{initiative.buttonText}</span>{" "}
            <ArrowRightIcon
              className="size-3.5 stroke-[2.5] transition-transform duration-200 group-hover/btn:translate-x-1"
              aria-hidden
            />
          </Link>
        </div>{" "}
      </div>{" "}
    </article>
  );
}
