"use client";
import { Voice } from "@prisma/client";
import Image from "next/image";
import { useRef } from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { SITE_CONTAINER_CLASS } from "@/constant/siteContainer";

export default function ParticipantsInfoPrograms({ data }: { data: Voice[] }) {
  const swiperRef = useRef<SwiperType | null>(null); // Specify type for swiperRef

  return (
    <div className={`relative md:mt-12 mt-8 mb-8 ${SITE_CONTAINER_CLASS}`}>
      <Swiper
        onSwiper={(swiper: SwiperType) => (swiperRef.current = swiper)}
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        centeredSlides={true}
        navigation={{
          prevEl: ".custom-prev",
          nextEl: ".custom-next",
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
            centeredSlides: false,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2,
            centeredSlides: false,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            centeredSlides: false,
            spaceBetween: 30,
          },
        }}
        className="sm:h-48 lg:h-56"
      >
        {data.map((participant) => (
          <SwiperSlide
            key={participant.id}
            className="bg-white rounded-lg space-y-8 p-6 h-full flex flex-col justify-between"
          >
            <div className="sm:h-1/2">
              <p className="text-paragraph_color text-sm">
                {participant.quote}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src={participant.icon ?? ""}
                alt="participant"
                height={1200}
                width={1200}
                className="h-12 w-12 rounded-full object-cover"
              />

              <div className="flex flex-col">
                <p className="font-semibold">{participant.name}</p>
                <p className="text-xs text-paragraph_color">
                  {participant.location}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows */}
      <div className="absolute left-0 md:mt-8 mt-6 right-0 flex justify-center gap-8">
        <button
          className="custom-prev"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <FaArrowLeftLong
            size={22}
            className="text-primary-50 opacity-25 hover:opacity-100 transition-transform duration-200 hover:scale-150"
          />
        </button>
        <button
          className="custom-next"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <FaArrowRightLong
            size={22}
            className="text-primary-50 opacity-25 hover:opacity-100 transition-transform duration-200 hover:scale-150"
          />
        </button>
      </div>
    </div>
  );
}
