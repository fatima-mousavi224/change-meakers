"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import type { Swiper as SwiperType } from "swiper";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

import image1 from "public/images/mission-impact/participants/1.jpg";
import image2 from "public/images/mission-impact/participants/2.jpg";
import image3 from "public/images/mission-impact/participants/7.jpg";
import image4 from "public/images/mission-impact/participants/4.jpg";
import image5 from "public/images/mission-impact/participants/5.jpg";
import image6 from "public/images/mission-impact/participants/6.jpg";
import image7 from "public/images/mission-impact/participants/7.jpg";
import image8 from "public/images/mission-impact/participants/8.jpg";
import image9 from "public/images/mission-impact/participants/9.jpg";
import image10 from "public/images/mission-impact/participants/6.jpg";

const participantsInfo = [
  {
    id: 1,
    description:
      "“ Through these classes, I've found a new strength within me. The support and knowledge have given me the courage to pursue my dreams and help my community.”",
    image: image1,
    name: "Amina Rahimi",
    location: "Afghanistan",
  },
  {
    id: 2,
    description:
      "“ Before joining these programs, I felt isolated in my struggles. Now, I know I am part of a larger movement, and that gives me hope and determination.”",
    image: image2,
    name: "Laila",
    location: "Afghanistan",
  },
  {
    id: 3,
    description:
      "“The empowerment classes have taught me to believe in myself and my abilities. I now see a future where I can contribute meaningfully to society.”",
    image: image3,
    name: "Zahra",
    location: "Afghanistan",
  },
  {
    id: 4,
    description:
      "“ Learning new skills and connecting with other girls has been life-changing. I feel more confident and ready to take on the challenges in my path.”",
    image: image4,
    name: "Mina",
    location: "Afghanistan",
  },
  {
    id: 5,
    description:
      "“ These programs have opened doors for me that I never thought possible. The education and support have ignited a passion in me to excel and make a difference.”",
    image: image5,
    name: "Fatima",
    location: "Afghanistan",
  },
  {
    id: 6,
    description:
      "“Participating in these seminars has shown me the power of community. Together, we can overcome obstacles and achieve our goals.”",
    image: image6,
    name: "Sarina",
    location: "Afghanistan",
  },
  {
    id: 7,
    description:
      "“ The online classes were a lifeline for me. They provided not only knowledge but also a sense of belonging and hope during difficult times.”",
    image: image7,
    name: "Nadia",
    location: "Afghanistan",
  },
  {
    id: 8,
    description:
      "“ Being part of this initiative has been incredibly inspiring. It has taught me that with perseverance and support, we can transform our dreams into reality.”",
    image: image8,
    name: "Roya Faridi",
    location: "Afghanistan",
  },
  {
    id: 9,
    description:
      "“The self-awareness sessions helped me understand my worth and potential. I now feel more equipped to advocate for myself and others.”",
    image: image9,
    name: "Samira Mohammadi",
    location: "Afghanistan",
  },
  {
    id: 10,
    description:
      "“This program has been a beacon of hope in my life. The education and encouragement have empowered me to envision a brighter future for myself and my peers.”",
    image: image10,
    name: "Hawa R",
    location: "Afghanistan",
  },
];

export default function ParticipantsInfo() {
  const swiperRef = useRef<SwiperType | null>(null); // Specify type for swiperRef

  return (
    <div className="relative md:mt-12 mt-8 mb-8 max-w-screen-2xl px-4 mx-auto">
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
        {participantsInfo.map((participant) => (
          <SwiperSlide
            key={participant.id}
            className="bg-white rounded-lg space-y-8 p-6 h-full flex flex-col justify-between"
          >
            <div className="sm:h-1/2">
              <p className="text-paragraph_color text-sm">
                {participant.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src={participant.image}
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
