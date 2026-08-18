"use client";
// components/NewsSlider.tsx
import React from "react";
import { Post } from "@prisma/client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Navigation } from "swiper/modules";
import { MdOutlineNavigateNext } from "react-icons/md";
import { MdOutlineNavigateBefore } from "react-icons/md";
import { GoArrowUpRight } from "react-icons/go";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { buildUpdateDetailHref } from "@/utilities/updateDetailHref";
import NoDataMessage from "@/components/common/NoDataMessage";
import SiteContainer from "@/components/common/SiteContainer";

interface NewsStoriesProps {
  posts: Post[];
}

const LatestNews = ({ posts }: NewsStoriesProps) => {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);

  // No Posts State
  if (!filteredPosts || filteredPosts.length === 0) {
    return <NoDataMessage />;
  }

  return (
    <div className="bg-light_gray">
      <SiteContainer className="relative py-12 my-10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-center md:text-left">
            Latest News
          </h2>
          <Link
            href="/updates"
            className="bg-gray-800 size-8 md:size-10 flex justify-center items-center rounded-full group overflow-hidden"
          >
            <div className="relative flex flex-col h-full items-center justify-center">
              <GoArrowUpRight
                className="text-white size-5 md:size-7 transition-all duration-300 transform 
                 group-hover:translate-x-8 group-hover:opacity-0"
              />
              {/* This second icon sits hidden above the first one */}
              <GoArrowUpRight
                className="text-white size-5 md:size-7 absolute -translate-x-8 opacity-0 
                 transition-all duration-300 transform 
                 group-hover:translate-x-0 group-hover:opacity-100"
              />
            </div>
          </Link>
        </div>
        <button
          className="hidden md:block absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-2xl shadow-md cursor-pointer z-10"
          id="prevButton"
        >
          <MdOutlineNavigateBefore className="md:size-8 font-bold" />
        </button>
        <button
          className="hidden md:block absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-2xl shadow-md cursor-pointer z-10"
          id="nextButton"
        >
          <MdOutlineNavigateNext className="md:size-8 font-bold" />
        </button>
        <Swiper
          breakpoints={{
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 12,
            },
            640: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            320: {
              slidesPerView: 1.2, // Show 1 slide + 20% of the next on small screens
              spaceBetween: 5,
            },
          }}
          navigation={{
            prevEl: "#prevButton",
            nextEl: "#nextButton",
          }}
          modules={[Navigation]}
          className="mySwiper !py-7 w-[95%] mx-auto h-full"
        >
          {filteredPosts.map((item, index) => (
            <SwiperSlide
              key={index}
              className="bg-white rounded-3xl shadow-sm shadow-gray-500 overflow-hidden"
            >
              <Link
                href={buildUpdateDetailHref(
                  { id: item.id, shortId: item.shortId },
                  "/",
                )}
                key={index}
                className="no-underline cursor-pointer"
              >
                <Image
                  src={item?.postImages[0].image || ""}
                  alt="image1"
                  width={500}
                  height={500}
                  className="object-cover w-full h-48 md:h-60 lg:h-72"
                />
                <div className="px-5 py-8 space-y-2">
                  <h3 className="font-semibold text-xl">{item.title}</h3>
                  <p
                    className="md:text-sm text-xs line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html: filteredPosts[0]?.description,
                    }}
                  />
                  <span className="text-sm text-gray-500">
                    {item.postDate
                      ? new Date(item.postDate).toLocaleDateString()
                      : new Date().toLocaleDateString()}
                  </span>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </SiteContainer>

        <style jsx>{`
        .group:hover .hover-bounce {
          animation: updown 700ms cubic-bezier(.22,.9,.31,1) 1;
        }
        .hover-bounce {
          display: inline-block;
          transform: translateY(0);
        }
        @keyframes updown {
          0% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
          60% { transform: translateY(4px); }
          100% { transform: translateY(0); }
        }
      `}</style>

    </div>
  );
};

export default LatestNews;
