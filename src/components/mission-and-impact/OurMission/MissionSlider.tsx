"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";

const slidePhotos = [
  { id: 1, photo: "/images/mission-impact/nation.jpg" },
  { id: 2, photo: "/images/mission-impact/nation1.jpg" },
  { id: 3, photo: "/images/mission-impact/program.jpg" },
  { id: 4, photo: "/images/mission-impact/program1.jpg" },
  { id: 5, photo: "/images/mission-impact/class.jpg" },
  { id: 6, photo: "/images/mission-impact/class1.jpg" },
  { id: 7, photo: "/images/mission-impact/class2.jpg" },
  { id: 8, photo: "/images/mission-impact/school.jpg" },
  { id: 9, photo: "/images/mission-impact/school1.jpg" },
  { id: 10, photo: "/images/mission-impact/poor.jpg" },
];

export default function MissionSlider() {
  return (
    <div className="h-[300px] lg:h-full w-full">
      <Swiper
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        loop={true}
        modules={[Autoplay, Pagination]}
        className="h-full"
      >
        {slidePhotos.map((item) => (
          <SwiperSlide
            key={item.id}
            className="relative h-full w-full overflow-hidden"
          >
            <div className="relative h-full w-full">
              <Image
                alt="slider-img"
                src={item.photo}
                layout="fill"
                className="object-cover rounded-lg"
                priority
              />
              <div
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, #00428E 30%, #00000000 60%, transparent 100%)",
                  opacity: 0.6,
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <style jsx>{`
        :global(.swiper-pagination-bullet) {
          background-color: white !important;
        }
      `}</style>
    </div>
  );
}
