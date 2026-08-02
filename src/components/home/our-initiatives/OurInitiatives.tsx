"use client";

import { INITIATIVES, INITIATIVES_PER_PAGE } from "@/constant/initiatives";
import { useEffect, useMemo, useRef, useState } from "react";
import InitiativeCard from "./InitiativeCard";

const AUTO_PLAY_MS = 3000;
const MOBILE_BREAKPOINT = 1024;

export default function OurInitiatives() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

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
    ? INITIATIVES.length
    : Math.ceil(INITIATIVES.length / INITIATIVES_PER_PAGE);

  const visibleInitiatives = useMemo(() => {
    if (isMobile) return INITIATIVES;

    const start = currentPage * INITIATIVES_PER_PAGE;
    const items = [];
    for (let i = 0; i < INITIATIVES_PER_PAGE; i++) {
      items.push(INITIATIVES[(start + i) % INITIATIVES.length]);
    }
    return items;
  }, [currentPage, isMobile]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages - 1));
  }, [totalPages]);

  useEffect(() => {
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
    <section className="py-8 lg:py-6 lg:px-[16px] px-4">
      <div className="mb-8 flex items-center gap-6 lg:mb-10">
        <h2 className="shrink-0 font-plusJakartaSans text-[22px] font-bold text-[#000000] sm:text-[34px] lg:text-[36px]">
          Our Initiatives
        </h2>
        <div className="flex min-w-0 flex-1 items-center mt-2">
          <div className="h-px flex-1 bg-[#9E9E9E]" />

          <span className="mx-5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#9E9E9E] bg-white">
            <span className="h-3 w-3 rounded-full bg-[#9E9E9E]" />
          </span>

          <div className="h-px md:w-24 w-6 bg-[#9E9E9E]" />
        </div>{" "}
      </div>

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

      {/* Desktop: unchanged 4-column grid */}
      <div className="hidden lg:grid lg:grid-cols-4 lg:gap-5">
        {visibleInitiatives.map((initiative, index) => (
          <InitiativeCard
            key={`${initiative.id}-${index}`}
            initiative={initiative}
          />
        ))}
      </div>

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
    </section>
  );
}
