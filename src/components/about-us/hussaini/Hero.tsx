import {
  FacebookBlue,
  InstagramBlue,
  LinkedinBlue,
  TwitterBlue,
} from "@/components/icons/Icons";
import Image from "next/image";
import React from "react";
import Hussaini from "public/images/about/Hussaini.png";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="bg-bannerAbout bg-no-repeat overflow-visible bg-center bg-cover rounded-[20px] h-[506px] mt-20 flex items-center relative shadow-lg justify-between">
      {/* Left Section: Image */}
      <div className="relative flex-shrink-0 lg:-left-10 -left-9 h-[120%] -translate-y-[50px] translate-x-9">
        <Image
          src={Hussaini}
          alt="Hussaini"
          width={800}
          height={1200}
          className="sm:w-full w-[320px] h-full rounded-bl-2xl object-cover"
        />
      </div>

      {/* Right Section: Text Content */}
      <div className="md:flex flex-col w-full hidden gap-4 text-black_color md:w-1/2 ">
        <div className="space-y-4">
          <h1 className="font-bold text-2xl md:text-4xl">
            Mohammad Reza Hussaini
          </h1>
          <p className="text-lg md:text-xl text-paragraph_color">
            Real Estate Investor and Founder
          </p>
          <Link
            href="https://www.rezahussaini.com/"
            className="text-paragraph_color underline text-sm"
          >
            Official Website
          </Link>
        </div>

        {/* Social Media Section */}
        <div className="flex gap-4 mt-4 items-start bg-white/70 lg:py-8 py-4 lg:px-10 md:px-5 rounded-lg  self-start">
          <Link
            href="https://www.facebook.com/RealRezaHussainii"
            className="bg-white/90 size-10 flex items-center justify-center rounded-md text-2xl hover:scale-110 transition-transform"
          >
            <FacebookBlue className="text-blue-600" />
          </Link>
          <Link
            href="https://x.com/m_rezahussaini"
            className="bg-white/90 size-10 flex items-center justify-center rounded-md text-2xl hover:scale-110 transition-transform"
          >
            <TwitterBlue className="text-blue-400" />
            {/* <i className="fab fa-twitter">t</i> */}
          </Link>
          <Link
            href="https://www.linkedin.com/in/mrezahussaini"
            className="bg-white/90 size-10 flex items-center justify-center rounded-md text-2xl hover:scale-110 transition-transform"
          >
            <LinkedinBlue className="text-blue-700" />
            {/* <i className="fab fa-linkedin">l</i> */}
          </Link>
          <Link
            href="www.instagram.com/m_rezahussaini"
            // add bg-gradent for icon instagram
            className="size-10 rounded-md bg-gradient-to-tr from-yellow-400 via-pink-500 to-red-500 flex items-center justify-center hover:scale-110 transition-transform"
          >
            <InstagramBlue className="text-pink-500" />
          </Link>
        </div>
      </div>
    </div>
  );
}
