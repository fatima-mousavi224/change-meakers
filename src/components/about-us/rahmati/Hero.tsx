import Image from "next/image";
import React from "react";
import Massie from "public/images/about/Massie.png";

export default function Hero() {
  return (
    <div className="bg-bannerAbout bg-no-repeat overflow-visible bg-center bg-cover rounded-[20px] h-[506px] mt-20 flex items-center relative shadow-lg justify-between">
      {/* Left Section: Image */}
      <div className="relative flex-shrink-0 lg:-left-10 -left-9 h-[120%] -translate-y-[50px] translate-x-9">
        <Image
          src={Massie}
          alt="Massie"
          width={800}
          height={1200}
          className="sm:w-full w-[320px] h-full rounded-bl-2xl object-cover"
        />
      </div>

      {/* Right Section: Text Content */}
      <div className="md:flex flex-col w-full hidden gap-4 text-black_color md:w-1/2 ">
        <div className="space-y-4">
          <h1 className="font-bold text-2xl md:text-4xl">Massie Rahmati</h1>
          <p className="text-lg md:text-xl text-paragraph_color">
            Real Estate Investor and Author
          </p>
          <p className="text-paragraph_color text-sm">
            President - USA
          </p>
        </div>
      </div>
    </div>
  );
}
