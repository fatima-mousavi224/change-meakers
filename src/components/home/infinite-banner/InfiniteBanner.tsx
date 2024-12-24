"use client";

import { useEffect, useRef } from "react";
import { infiniteBannerData } from "@/lib/data";
import { cn } from "@/utilities/cn";

interface InfiniteBannerProps {
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}

export const InfiniteBanner: React.FC<InfiniteBannerProps> = ({
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollerRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const scroller = scrollerRef.current;

    if (container && scroller) {
      // Clone all child nodes for seamless looping
      const items = Array.from(scroller.children);
      items.forEach((item) => {
        const clonedItem = item.cloneNode(true);
        scroller.appendChild(clonedItem);
      });

      // Adjust animation properties based on speed
      const duration = getSpeedDuration(speed);
      container.style.setProperty("--animation-duration", `${duration}s`);
      container.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
    }
  }, [direction, speed]);

  const getSpeedDuration = (speed: string) => {
    switch (speed) {
      case "fast":
        return 10; // Adjust as needed
      case "normal":
        return 20;
      case "slow":
        return 25;
      default:
        return 20;
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden my-9",
        pauseOnHover && "hover:[animation-play-state:paused]",
        className
      )}
    >
      {/* Gradient overlay for blur effect */}
      <div className="absolute top-0 left-0 h-full w-56 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 right-0 h-full w-56 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
      <ul
        ref={scrollerRef}
        className={cn(
          "flex gap-6 animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{
          animation: "custom-scroll var(--animation-duration) linear infinite",
          animationDirection: "var(--animation-direction)",
        }}
      >
        {infiniteBannerData.map((item, idx) => (
          <li className="flex items-center gap-2" key={`banner-item-${idx}`}>
            <span className="text-[#717171] font-normal sm:text-lg text-base loading-7">
              {item}
            </span>
            <span className="inline-block w-2 h-2 ml-5 rounded-full bg-[#717171] font-arial" />
          </li>
        ))}
      </ul>
    </div>
  );
};
