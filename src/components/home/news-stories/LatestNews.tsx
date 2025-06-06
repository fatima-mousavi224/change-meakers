"use client";
// components/NewsSlider.tsx
import React from "react";
import { Post } from "@prisma/client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Navigation } from "swiper/modules";
import image1 from "../../../../public/images/home-page/news-stories/news1.png";
import { MdOutlineNavigateNext } from "react-icons/md";
import { MdOutlineNavigateBefore } from "react-icons/md";
import { GoArrowUpRight } from "react-icons/go";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useState } from "react";
import NoDataMessage from "@/components/common/NoDataMessage";

interface NewsStoriesProps {
  posts: Post[];
}

const LatestNews = ({ posts }: NewsStoriesProps) => {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);

  // function to handle category change and filter posts
  // No Posts State
  if (!filteredPosts || filteredPosts.length === 0) {
    return <NoDataMessage />;
  }

  return (
    <div className="md:bg-gray-200">
      <div className="relative lg:px-20 py-12 my-10 max-w-screen-2xl px-4 mx-auto">
        <div className="flex justify-between items-center ">
          <h2 className="text-2xl font-bold text-center md:text-left">
            Latest News
          </h2>
          <Link
            href="/updates"
            className="bg-gray-800 size-8 md:size-10 flex justify-center items-center rounded-full"
          >
            <GoArrowUpRight className="text-white size-5 md:size-7" />
          </Link>
        </div>
        <button
          className="hidden md:block absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-2xl shadow-md cursor-pointer z-10"
          id="prevButton"
        >
          <MdOutlineNavigateBefore className=" md:size-8 font-bold" />
        </button>
        <button
          className="hidden md:block absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-2xl shadow-md cursor-pointer z-10"
          id="nextButton"
        >
          <MdOutlineNavigateNext className=" md:size-8 font-bold" />
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
              slidesPerView: 1,
              spaceBetween: 5,
            },
          }}
          navigation={{
            prevEl: "#prevButton",
            nextEl: "#nextButton",
          }}
          modules={[Navigation]}
          loop={true}
          slidesPerView={3}
          className="mySwiper !py-7 w-[95%] mx-auto"
        >
          {filteredPosts.map((item, index) => (
            <SwiperSlide
              key={index}
              className="bg-white rounded-3xl shadow-md shadow-gray-500"
            >
              <Link
                href={`/updates/${item.id}`}
                key={index}
                className="no-underline cursor-pointer"
              >
                <Image
                  src={item?.postImages[0].image || ""}
                  alt="image1"
                  width={500}
                  height={500}
                  className="rounded-t-md object-cover w-full h-48 md:h-60 lg:h-72"
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
      </div>
    </div>
  );
};

export default LatestNews;
