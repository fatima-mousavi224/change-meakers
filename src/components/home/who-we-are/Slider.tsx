"use client";
import Image, { StaticImageData } from "next/image";
import React, { useEffect, useState, TouchEvent } from "react";
import { cn } from "utilities/common";

interface SliderProps {
  images: StaticImageData[];
  mobileImages: StaticImageData[];
}

export default function Slider({ images, mobileImages }: SliderProps) {
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
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [images.length]);

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
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    } else if (isRightSwipe) {
      setActiveIndex(
        (prevIndex) => (prevIndex - 1 + images.length) % images.length
      );
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const currentImages = isMobile ? mobileImages : images;

  return (
    <div className="lg:w-[47vw]">
      <div className="relative overflow-hidden rounded-xl shadow-lg z-20">
        {/* Full Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-50 via-transparent to-transparent opacity-90 z-30 rounded-xl"></div>

        <div
          className="relative sm:h-[75vh] h-[40vh] overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {currentImages.map((image, index) => (
            <div
              key={index}
              className={cn(
                "absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out",
                {
                  "opacity-100 z-0": index === activeIndex,
                  "opacity-0 z-0": index !== activeIndex,
                }
              )}
            >
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black opacity-40 z-10"></div>

              {/* Image */}
              <Image
                src={image}
                alt={`Slide ${index + 1}`}
                fill
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Centered Pagination Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40 flex space-x-2 items-center justify-center">
          {currentImages.map((_, index) => (
            <span
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "rounded-full transition-colors cursor-pointer",
                index === activeIndex ? "bg-white size-3" : "bg-gray-400 size-2"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
