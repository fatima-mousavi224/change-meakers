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
const DESKTOP_GAP_PX = 20;
/** Each desktop page advances by 2 cards so the next view overlaps the last 2. */
const DESKTOP_PAGE_STEP = 2;

type OurInitiativesProps = {
  title?: string;
  className?: string;
  /** When set, only these initiative ids are shown (order preserved). */
  initiativeIds?: string[];
};

function getDesktopTotalPages(count: number) {
  if (count <= INITIATIVES_PER_PAGE) return 1;
  return Math.floor((count - INITIATIVES_PER_PAGE) / DESKTOP_PAGE_STEP) + 1;
}

export default function OurInitiatives({
  title = "Our Initiatives",
  className,
  initiativeIds,
}: OurInitiativesProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [desktopStepPx, setDesktopStepPx] = useState(0);
  const [desktopCardWidthPx, setDesktopCardWidthPx] = useState(0);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const desktopViewportRef = useRef<HTMLDivElement>(null);

  const initiatives = useMemo(() => {
    if (!initiativeIds?.length) {
      return INITIATIVES;
    }

    return initiativeIds
      .map((id) => INITIATIVES.find((initiative) => initiative.id === id))
      .filter((initiative): initiative is Initiative => initiative !== undefined);
  }, [initiativeIds]);

  const useDesktopSlider = !isMobile && initiatives.length > INITIATIVES_PER_PAGE;

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
    );
    const updateLayout = () => setIsMobile(mediaQuery.matches);

    updateLayout();
    mediaQuery.addEventListener("change", updateLayout);

    return () => mediaQuery.removeEventListener("change", updateLayout);
  }, []);

  useEffect(() => {
    if (!useDesktopSlider || !desktopViewportRef.current) return;

    const measureDesktopTrack = () => {
      const viewport = desktopViewportRef.current;
      if (!viewport) return;

      const viewportWidth = viewport.offsetWidth;
      const cardWidth =
        (viewportWidth - DESKTOP_GAP_PX * (INITIATIVES_PER_PAGE - 1)) /
        INITIATIVES_PER_PAGE;

      setDesktopCardWidthPx(cardWidth);
      setDesktopStepPx(DESKTOP_PAGE_STEP * (cardWidth + DESKTOP_GAP_PX));
    };

    measureDesktopTrack();

    const observer = new ResizeObserver(measureDesktopTrack);
    observer.observe(desktopViewportRef.current);

    return () => observer.disconnect();
  }, [useDesktopSlider, initiatives.length]);

  const totalPages = isMobile
    ? initiatives.length
    : getDesktopTotalPages(initiatives.length);

  useEffect(() => {
    setCurrentPage(0);
  }, [initiativeIds]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages - 1));
  }, [totalPages]);

  useEffect(() => {
    if (totalPages <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentPage((page) => (page + 1) % totalPages);
    }, AUTO_PLAY_MS);

    return () => clearInterval(interval);
  }, [totalPages, isPaused]);

  useEffect(() => {
    if (!isMobile || !mobileScrollRef.current) return;

    const container = mobileScrollRef.current;
    const card = container.querySelector<HTMLElement>("[data-initiative-slide]");
    if (!card) return;

    container.scrollTo({
      left: currentPage * (card.offsetWidth + DESKTOP_GAP_PX),
      behavior: "smooth",
    });
  }, [currentPage, isMobile]);

  const pauseCarousel = () => setIsPaused(true);
  const resumeCarousel = () => setIsPaused(false);

  return (
    <section className={cn("py-8 lg:py-6", className)}>
      <SectionHeading title={title} />

      <div
        onMouseEnter={pauseCarousel}
        onMouseLeave={resumeCarousel}
        onTouchStart={pauseCarousel}
        onTouchEnd={resumeCarousel}
        onTouchCancel={resumeCarousel}
      >
        {/* Mobile: one row, 1 full card + half of next visible */}
        <div className="lg:hidden w-full overflow-hidden">
          <div
            ref={mobileScrollRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {initiatives.map((initiative) => (
              <div
                key={initiative.id}
                data-initiative-slide
                className="w-[calc((100%-1rem)/1.3)] shrink-0 snap-start"
              >
                <InitiativeCard initiative={initiative} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: sliding track keeps cards mounted — no layout jump between pages */}
        {useDesktopSlider ? (
          <div
            ref={desktopViewportRef}
            className="hidden lg:block w-full overflow-hidden lg:min-h-[390px]"
          >
            <div
              className="flex gap-5 transition-transform duration-500 ease-in-out will-change-transform"
              style={{
                transform: `translate3d(-${currentPage * desktopStepPx}px, 0, 0)`,
              }}
            >
              {initiatives.map((initiative) => (
                <div
                  key={initiative.id}
                  className="shrink-0"
                  style={
                    desktopCardWidthPx
                      ? { width: `${desktopCardWidthPx}px` }
                      : undefined
                  }
                >
                  <InitiativeCard initiative={initiative} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="hidden lg:grid lg:grid-cols-4 lg:gap-5 lg:min-h-[390px]">
            {initiatives.map((initiative) => (
              <InitiativeCard key={initiative.id} initiative={initiative} />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 ? (
        <div className="mt-8 flex h-3 items-center justify-center gap-2.5">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to initiatives page ${index + 1}`}
              aria-current={index === currentPage ? "true" : undefined}
              onClick={() => setCurrentPage(index)}
              className={`size-3 rounded-full transition-colors duration-300 ${
                index === currentPage
                  ? "bg-primary-50"
                  : "bg-[#D0D5DD] hover:bg-primary-50/50"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
