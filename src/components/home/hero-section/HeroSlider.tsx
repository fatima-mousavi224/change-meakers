"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React, { TouchEvent, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  fadeUpItem,
  motionEase,
  staggerContainer,
} from "@/lib/motionPresets";
import { RighArrow } from "../../icons/Icons";
import image1 from "../../../../public/images/home-page/hero-section/slide1.png";
import image2 from "../../../../public/images/home-page/hero-section/slide2.png";
import image3 from "../../../../public/images/home-page/hero-section/slide3.png";
import image4 from "../../../../public/images/home-page/hero-section/slide4.jpg";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  image: StaticImageData;
  mobileImage?: StaticImageData;
  objectPosition?: string;
}

const slides: Slide[] = [
  { image: image1, objectPosition: "50% 52%" },
  { image: image2, objectPosition: "50% 46%" },
  { image: image3, objectPosition: "50% 48%" },
  { image: image4, objectPosition: "50% 50%" },
];

const HeroSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    } else if (isRightSwipe) {
      setActiveIndex(
        (prevIndex) => (prevIndex - 1 + slides.length) % slides.length,
      );
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="relative w-full py-4 sm:py-8">
      <div className="relative w-full">
        {/* Main Card Container */}
        <div className="relative z-10 w-full overflow-hidden rounded-[24px] shadow-md">
          {/* Subtle Dark Bottom Gradient (Image remains clear) */}
          <div
            className="absolute inset-0 z-10 rounded-[24px] pointer-events-none"
            style={{
              background:
                "linear-gradient(188.75deg, rgba(4, 17, 29, 0) 20%, rgba(19, 76, 131, 0.75) 100%)",
            }}
          />

          {/* Slider Images */}
          <div
            className="relative h-[420px] w-full overflow-hidden sm:h-[min(76vh,760px)] sm:min-h-[480px]"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {slides.map((slide, index) => {
              const isActive = index === activeIndex;

              return (
                <motion.div
                  key={index}
                  className="absolute inset-0"
                  initial={false}
                  animate={
                    isActive
                      ? {
                          opacity: 1,
                          y: prefersReducedMotion ? "0%" : ["-2.5%", "0%"],
                        }
                      : { opacity: 0 }
                  }
                  transition={{
                    opacity: { duration: 0.55, ease: motionEase },
                    y: { duration: 0.85, ease: motionEase },
                  }}
                  style={{ zIndex: isActive ? 1 : 0 }}
                >
                  <Image
                    src={
                      isMobile && slide.mobileImage
                        ? slide.mobileImage
                        : slide.image
                    }
                    alt={`Slide ${index + 1}`}
                    fill
                    priority={index === 0}
                    style={{
                      objectPosition: slide.objectPosition ?? "50% top",
                    }}
                    className="object-cover"
                    sizes="(max-width: 1440px) 100vw, 1440px"
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Text Overlay & Button */}
          <div className="absolute inset-0 z-20 flex flex-col items-start justify-end px-5 pb-3 pt-6 font-plusJakartaSans sm:px-10 sm:pb-4 sm:pt-10 md:px-14 md:pb-5 md:pt-12">
            <motion.div
              className="max-w-4xl md:max-w-5xl"
              variants={prefersReducedMotion ? undefined : staggerContainer}
              initial={prefersReducedMotion ? false : "hidden"}
              animate={prefersReducedMotion ? false : "visible"}
            >
              <motion.h1
                variants={prefersReducedMotion ? undefined : fadeUpItem}
                className="mb-2 text-balance text-[26px] font-bold leading-[118%] text-white sm:text-[36px] md:mb-3 md:text-[46px]"
              >
                A better Afghanistan begins with educated girls and empowered
                youth.
              </motion.h1>
              <motion.p
                variants={prefersReducedMotion ? undefined : fadeUpItem}
                className="mb-3 text-[15px] font-normal leading-[120%] text-white/90 md:mb-4 md:text-[18px]"
              >
                This is why Change Makers of the World exists.
              </motion.p>
              <motion.div variants={prefersReducedMotion ? undefined : fadeUpItem}>
                <Link
                  href="/about"
                  className="group inline-flex items-center justify-center gap-2 rounded-[12px] bg-white px-5 py-2.5 text-sm font-medium text-[#252525] shadow transition-colors duration-200 hover:bg-gray-100 md:text-base"
                >
                  <span>Who We Are</span>
                  <span className="inline-flex items-center justify-center transition-transform duration-300 ease-out group-hover:translate-x-1.5">
                    <RighArrow className="h-3 w-3 text-[#252525]" />
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          <div className="absolute bottom-6 right-8 md:bottom-8 md:right-10 z-30 flex space-x-2 items-center">
            {slides.map((_, index) => (
              <span
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`cursor-pointer transition-all duration-300 rounded-full ${
                  index === activeIndex
                    ? "w-3 h-3 bg-white"
                    : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={() =>
            setActiveIndex((activeIndex - 1 + slides.length) % slides.length)
          }
          aria-label="Previous Slide"
          className="absolute -left-5 top-1/2 z-30 hidden size-10 -translate-y-1/2 items-center justify-center rounded-[12px] border border-white/40 bg-white/60 shadow-lg backdrop-blur-md transition-all duration-200 hover:bg-white sm:-left-6 sm:flex md:-left-8 md:size-14"
        >
          <ChevronLeft className="h-8 w-8 text-[#134C83]" />
        </button>

        <button
          onClick={() => setActiveIndex((activeIndex + 1) % slides.length)}
          aria-label="Next Slide"
          className="absolute -right-5 top-1/2 z-30 hidden size-10 -translate-y-1/2 items-center justify-center rounded-[12px] border border-white/40 bg-white/60 shadow-lg backdrop-blur-md transition-all duration-200 hover:bg-white sm:-right-6 sm:flex md:-right-8 md:size-14"
        >
          <ChevronRight className="h-8 w-8 text-[#134C83]" />
        </button>
      </div>
    </div>
  );
};

export default HeroSlider;
