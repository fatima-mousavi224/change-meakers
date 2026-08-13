

"use client";

import {
  ADVISORY_BOARD,
  type AdvisoryBoardMember,
} from "@/constant/aboutAdvisoryBoard";
import { cn } from "@/utilities/cn";
import Image from "next/image";
import { useEffect, useState, type TouchEvent } from "react";

function AdvisoryBoardCard({
  member,
}: {
  member: AdvisoryBoardMember;
}) {
  return (
    <article className="relative mx-auto h-[400px] w-full max-w-[320px] overflow-hidden rounded-[20px] bg-[#DCE4EF] sm:h-[430px] sm:max-w-[330px] lg:h-[450px] lg:max-w-[340px]">
      {/* Full-card portrait */}
      <div className="absolute inset-0">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover object-center"
          sizes="(max-width: 640px) 320px, (max-width: 1024px) 330px, 340px"
        />
      </div>

      {/* Bottom dark gradient */}
      <div
        className="absolute inset-x-0 bottom-0 h-[48%]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 25%, rgba(0,0,0,0.72) 72%, rgba(0,0,0,0.96) 100%)",
        }}
      />

      {/* Text */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-6 sm:px-6 sm:pb-7">
        <h3 className="font-plusJakartaSans text-[17px] font-bold leading-[1.35] text-white sm:text-[18px]">
          {member.name}
        </h3>

        <p className="mt-2 max-w-[280px] font-plusJakartaSans text-[12px] font-normal leading-[1.5] text-white/80 sm:text-[13px]">
          {member.organization}
        </p>
      </div>
    </article>
  );
}

export default function AdvisoryBoardCards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  /*
   * Automatically change the card every 4 seconds.
   *
   * This only runs on mobile because the desktop version
   * shows all cards at the same time.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(
        (index) => (index + 1) % ADVISORY_BOARD.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (event: TouchEvent) => {
    setTouchStart(event.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const handleTouchMove = (event: TouchEvent) => {
    setTouchEnd(event.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;

    const distance = touchStart - touchEnd;

    if (distance > 50) {
      setActiveIndex(
        (index) => (index + 1) % ADVISORY_BOARD.length
      );
    } else if (distance < -50) {
      setActiveIndex(
        (index) =>
          (index - 1 + ADVISORY_BOARD.length) %
          ADVISORY_BOARD.length
      );
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div>
      {/* Desktop */}
      <div className="mx-auto hidden max-w-[720px] grid-cols-2 justify-items-center gap-5 lg:grid lg:gap-6">
        {ADVISORY_BOARD.map((member) => (
          <AdvisoryBoardCard
            key={member.id}
            member={member}
          />
        ))}
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <div
          className="relative mx-auto max-w-[320px] overflow-hidden sm:max-w-[330px]"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {ADVISORY_BOARD.map((member, index) => (
            <div
              key={member.id}
              className={cn(
                "transition-opacity duration-700 ease-in-out",
                index === activeIndex
                  ? "relative opacity-100"
                  : "pointer-events-none absolute inset-0 opacity-0"
              )}
            >
              <AdvisoryBoardCard member={member} />
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {ADVISORY_BOARD.map((member, index) => (
            <button
              key={member.id}
              type="button"
              aria-label={`Show ${member.name}`}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "rounded-full transition-all duration-300",
                index === activeIndex
                  ? "size-2.5 bg-[#134C83]"
                  : "size-2 bg-[#D0D5DD]"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}