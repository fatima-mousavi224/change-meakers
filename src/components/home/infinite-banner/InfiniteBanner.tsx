"use client";

import { useEffect, useRef, useState } from "react";
import { infiniteBannerData } from "@/lib/data";
import { cn } from "@/utilities/cn";

interface InfiniteBannerProps {
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}

export const InfiniteBanner: React.FC<InfiniteBannerProps> = ({
  direction = "left",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollerRef = useRef<HTMLUListElement | null>(null);

  const [speed, setSpeed] = useState<"veryFast" | "fast">("veryFast");

  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setSpeed("fast"); // Large screens
      } else {
        setSpeed("veryFast"); // Mobile screens
      }
    };

    handleResize(); // Set initial speed
    window.addEventListener("resize", handleResize); // Update on resize

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
      case "veryFast":
        return 10;
      case "fast":
        return 20; // Adjust as needed
      default:
        return 10;
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
