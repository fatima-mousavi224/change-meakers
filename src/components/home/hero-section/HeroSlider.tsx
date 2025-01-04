"use client";

import Image, { StaticImageData } from "next/image";
import React, { useEffect, useState, TouchEvent } from "react";
import { RighArrow } from "../../icons/Icons";
import image1 from "../../../../public/images/home-page/hero-section/image1.png";
import image2 from "../../../../public/images/home-page/hero-section/image2.png";
import image3 from "../../../../public/images/home-page/hero-section/image3.png";
import Link from "next/link";

interface Slide {
  image: StaticImageData;
  mobileImage?: StaticImageData;
}

const slides: Slide[] = [
  { image: image1 },
  { image: image2 },
  { image: image3 },
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
    }, 3000);

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
        (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
      );
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="lg:px-2">
      <div className="relative w-full max-w-[96vw] mx-auto mt-3 rounded-[35px] shadow-lg z-20">
        {/* Full Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-800 via-transparent to-transparent opacity-90 z-10 rounded-[35px]"></div>

        <div
          className="relative w-full sm:h-[80vh] h-[70vh] overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((slide, index) => (
            <Image
              key={index}
              src={
                isMobile && slide.mobileImage ? slide.mobileImage : slide.image
              }
              alt={`Slide ${index + 1}`}
              fill
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
                index === activeIndex ? "opacity-100 z-0" : "opacity-0"
              } rounded-[35px]`}
            />
          ))}
        </div>

        {/* Overlay with Static Text and Button */}
        <div className="absolute inset-0 z-20 bg-black bg-opacity-40 flex flex-col justify-end items-start sm:p-10 p-5 font-plusJakartaSans rounded-[35px]">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Change Makers of the World
          </h2>
          <p className="text-sm md:text-lg text-white mb-1 font-bold font-plusJakartaSans">
            Our Vision: Together, we can change the world.
          </p>
          <p className="text-[#F2F2F2] font-plusJakartaSans mb-3">
            Stand With Us: #LetAfghanGirlsLearn
          </p>
          <Link
            href="/about"
            className="bg-white text-black_color text-md font-medium py-2 px-4 rounded-full hover:bg-gray-200 flex items-center text-center gap-2"
          >
            <span>Learn More</span>
            <RighArrow />
          </Link>
        </div>

        {/* Pagination Dots in Bottom Right Corner */}
        <div className="absolute bottom-10 right-10 z-30 flex space-x-2 items-center">
          {slides.map((_, index) => (
            <span
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`size-2 rounded-full transition-colors cursor-pointer ${
                index === activeIndex ? "bg-white size-3" : "bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Prev and Next Buttons on Borders */}
        <button
          onClick={() =>
            setActiveIndex((activeIndex - 1 + slides.length) % slides.length)
          }
          className="absolute -left-5 top-1/2 shadow-2xl transform -translate-y-1/2 hover:bg-gradient-to-l hover:from-[#bebebe66] hover:to-[#FFFFFF00] bg-gradient-to-l from-[#FFFFFF66] to-[#FFFFFF00] text-xl text-primary-50 w-10 h-10 rounded-[14px] p-1 z-30 items-center justify-center sm:flex hidden"
        >
          &#10094;
        </button>
        <button
          onClick={() => setActiveIndex((activeIndex + 1) % slides.length)}
          className="absolute -right-5 top-1/2 transform shadow-2xl -translate-y-1/2 bg-gradient-to-r from-[#FFFFFF66] to-[#FFFFFF00] sm:flex hidden hover:bg-gradient-to-r hover:from-[#bebebe66] hover:to-[#FFFFFF00] text-xl text-blue-600 w-10 h-10 rounded-[14PX] p-1 z-30 items-center justify-center"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default HeroSlider;
