"use client";

import SectionHeading from "@/components/common/SectionHeading";
import {
  INITIATIVES,
  INITIATIVES_PER_PAGE,
  type Initiative,
} from "@/constant/initiatives";
import { cn } from "@/utilities/cn";
import { useEffect, useMemo, useRef, useState } from "react";
import InitiativeCard from "./InitiativeCard";

const AUTO_PLAY_MS = 3000;
const MOBILE_BREAKPOINT = 1024;

type OurInitiativesProps = {
  title?: string;
  className?: string;
  /** When set, only these initiative ids are shown (order preserved). */
  initiativeIds?: string[];
};

export default function OurInitiatives({
  title = "Our Initiatives",
  className,
  initiativeIds,
}: OurInitiativesProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const initiatives = useMemo(() => {
    if (!initiativeIds?.length) {
      return INITIATIVES;
    }

    return initiativeIds
      .map((id) => INITIATIVES.find((initiative) => initiative.id === id))
      .filter((initiative): initiative is Initiative => initiative !== undefined);
  }, [initiativeIds]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
    );
    const updateLayout = () => setIsMobile(mediaQuery.matches);

    updateLayout();
    mediaQuery.addEventListener("change", updateLayout);

    return () => mediaQuery.removeEventListener("change", updateLayout);
  }, []);

  const totalPages = isMobile
    ? initiatives.length
    : Math.max(1, Math.ceil(initiatives.length / INITIATIVES_PER_PAGE));

  const visibleInitiatives = useMemo(() => {
    if (isMobile) return initiatives;

    if (initiatives.length <= INITIATIVES_PER_PAGE) {
      return initiatives;
    }

    const start = currentPage * INITIATIVES_PER_PAGE;
    return initiatives.slice(start, start + INITIATIVES_PER_PAGE);
  }, [currentPage, initiatives, isMobile]);

  useEffect(() => {
    setCurrentPage(0);
  }, [initiativeIds]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages - 1));
  }, [totalPages]);

  useEffect(() => {
    if (totalPages <= 1) return;

    const interval = setInterval(() => {
      setCurrentPage((page) => (page + 1) % totalPages);
    }, AUTO_PLAY_MS);

    return () => clearInterval(interval);
  }, [totalPages]);

  useEffect(() => {
    if (!isMobile || !mobileScrollRef.current) return;

    const container = mobileScrollRef.current;
    const card = container.querySelector<HTMLElement>("[data-initiative-slide]");
    if (!card) return;

    const gap = 16;
    container.scrollTo({
      left: currentPage * (card.offsetWidth + gap),
      behavior: "smooth",
    });
  }, [currentPage, isMobile]);

  return (
    <section className={cn("px-4 py-8 lg:px-[16px] lg:py-6", className)}>
      <SectionHeading title={title} />

      {/* Mobile: one row, 1 full card + half of next visible */}
      <div
        ref={mobileScrollRef}
        className="lg:hidden -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {visibleInitiatives.map((initiative) => (
          <div
            key={initiative.id}
            data-initiative-slide
            className="w-[calc((100%-1rem)/1.3)] shrink-0 snap-start"
          >
            <InitiativeCard initiative={initiative} />
          </div>
        ))}
      </div>

      {/* Desktop: always 4-column grid so card size matches other program tabs */}
      <div className="hidden lg:grid lg:grid-cols-4 lg:gap-5">
        {visibleInitiatives.map((initiative, index) => (
          <InitiativeCard
            key={`${initiative.id}-${index}`}
            initiative={initiative}
          />
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="mt-8 flex items-center justify-center gap-2.5">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to initiatives page ${index + 1}`}
              aria-current={index === currentPage ? "true" : undefined}
              onClick={() => setCurrentPage(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentPage
                  ? "size-3 bg-primary-50"
                  : "size-2 bg-[#D0D5DD] hover:bg-primary-50/50"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
