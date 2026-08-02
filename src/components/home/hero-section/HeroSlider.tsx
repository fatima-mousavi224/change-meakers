"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React, { TouchEvent, useEffect, useState } from "react";
import { RighArrow } from "../../icons/Icons";
import image1 from "../../../../public/images/home-page/hero-section/slide1.png";
import image2 from "../../../../public/images/home-page/hero-section/slide2.png";
import image3 from "../../../../public/images/home-page/hero-section/slide3.png";
import image4 from "../../../../public/images/home-page/hero-section/slide4.jpg";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  image: StaticImageData;
  mobileImage?: StaticImageData;
}

const slides: Slide[] = [
  { image: image1 },
  { image: image2 },
  { image: image3 },
  { image: image4 },
];

const HeroSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

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
    <div className="w-full px-4 sm:px-8 my-8">
      {/* Outer wrapper giving space so arrows can hang off the image sides */}
      <div className="relative max-w-[1370px] mx-auto">
        {/* Main Card Container */}
        <div className="relative w-full rounded-[24px] overflow-hidden shadow-md z-10">
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
            className="relative w-full sm:h-[88vh] h-[65vh] overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {slides.map((slide, index) => (
              <Image
                key={index}
                src={
                  isMobile && slide.mobileImage
                    ? slide.mobileImage
                    : slide.image
                }
                alt={`Slide ${index + 1}`}
                fill
                priority={index === 0}
                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
                  index === activeIndex ? "opacity-100 z-0" : "opacity-0"
                }`}
              />
            ))}
          </div>

          {/* Text Overlay & Button */}
          <div className="absolute inset-0 z-20 flex flex-col justify-end items-start p-6 sm:p-10 md:p-14 font-plusJakartaSans">
            <div className="max-w-3xl mb-2">
              <h1 className="text-[26px] sm:text-[36px] md:text-[46px] font-bold text-white leading-[122%] mb-2 md:mb-6">
                A better Afghanistan begins with educated girls and empowered
                youth.
              </h1>
              <p className="text-[15px] md:text-[18px] font-normal text-white/90 leading-[120%] mb-5">
                This is why Change Makers of the World exists.
              </p>
              {/* Button with 12px border radius & link to /about */}
              <Link
                href="/about"
                className="group inline-flex items-center justify-center gap-2 bg-white text-[#252525] font-medium text-sm md:text-base py-2.5 px-5 rounded-[12px] shadow hover:bg-gray-100 transition-colors duration-200"
              >
                <span>Who We Are</span>
                <span className="inline-flex items-center justify-center transition-transform duration-300 ease-out group-hover:translate-x-1.5">
                  <RighArrow className="w-3 h-3 text-[#252525]" />
                </span>
              </Link>{" "}
            </div>
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
          className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-30 backdrop-blur-md bg-white/60 border border-white/40  hover:bg-white w-10 h-10 md:w-14 md:h-14 rounded-[12px] items-center justify-center shadow-lg transition-all duration-200 sm:flex hidden"
        >
          <ChevronLeft className="text-[#134C83] h-8 w-8" />
        </button>

        <button
          onClick={() => setActiveIndex((activeIndex + 1) % slides.length)}
          aria-label="Next Slide"
          className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-30 backdrop-blur-md bg-white/60 border border-white/40  hover:bg-white w-10 h-10 md:w-14 md:h-14 rounded-[12px] items-center justify-center shadow-lg transition-all duration-200 sm:flex hidden"
        >
          <ChevronRight className="text-[#134C83] h-8 w-8" />
        </button>
      </div>
    </div>
  );
};

export default HeroSlider;

