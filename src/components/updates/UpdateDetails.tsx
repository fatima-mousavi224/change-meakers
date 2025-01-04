"use client";
import { Post } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Button from "../common/Button";

export default function UpdateDetails({
  title,
  description,
  author,
  authorImage,
  postDate,
  // @ts-ignore
  Category,
  postImages,
  createdAt,
}: Post) {
  const navigate = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const formattedPostDate = postDate
    ? new Date(postDate).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : null;
  return (
    <section className="py-12 max-w-4xl mx-auto px-4">
      <button className="px-4 py-2 rounded-lg font-medium  bg-primary-50 text-white my-3 cursor-default">
        {Category.title || "General"}
      </button>
      <h1 className="text-2xl md:text-4xl font-semibold">{title}</h1>

      <div className="flex items-center my-3 gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <Image
            src={authorImage?.image || ""}
            alt="author"
            width={30}
            height={30}
            className="rounded-full size-10 object-cover"
          />
          <span className="font-semibold text-[15px] text-gray-600">
            {author}
          </span>
        </div>

        <span className="font-semibold text-[14px] text-gray-400">
          {postDate ? formattedPostDate : "No date available"}
        </span>
      </div>
      <div className="mx-auto overflow-hidden" ref={contentRef}>
        {/* Images */}
        <div className="relative w-full sm:h-[500px] h-[250px] mt-5">
          <div className="relative h-full w-full">
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
              {postImages.map((item, index) => (
                <SwiperSlide
                  key={index}
                  className="relative h-full w-full overflow-hidden"
                >
                  <div className="relative h-full w-full">
                    <Image
                      alt="slider-img"
                      src={item.image || ""}
                      width={1200}
                      height={1200}
                      className="h-full w-full self-center rounded-lg cursor-pointer"
                      priority
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
        </div>
        {/* Content */}
        <div className="p-6">
          <div className="prose max-w-none text-justify leading-8 text-gray-500">
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </div>
          <div className="w-full flex items-center justify-center mt-4">
            <Button onClick={() => navigate.back()}>Back</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
