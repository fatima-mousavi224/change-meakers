"use client";
import React from "react";
import {
  InstagramBlue,
  LinkedinBlue,
  RelatedArticlesIcon,
  TwitterBlue,
} from "@/components/icons/Icons";
import { IoIosArrowBack } from "react-icons/io";

import { FaFacebook } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function InformationHussaini() {
  const router = useRouter();

  return (
    <div className="mt-10">
      {/* Right Section: Text Content */}
      <div className="flex md:flex-row flex-col  items-center md:hidden gap-4 text-black_color">
        <div className="space-y-4 flex flex-col items-center justify-center xl:w-[499px] w-full">
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
        <div className="flex gap-4 mt-4 items-center justify-center bg-light_gray bg-opacity-75 py-8 px-10 rounded-lg   sm:w-1/2 w-full">
          <Link
            href="https://www.facebook.com/RealRezaHussainii"
            className="size-10 flex items-center justify-center rounded-md text-2xl hover:scale-110 transition-transform"
          >
            <FaFacebook className="text-blue-500" />
          </Link>
          <Link
            href="https://x.com/m_rezahussaini"
            className="size-10 flex items-center justify-center rounded-md text-2xl hover:scale-110 transition-transform"
          >
            <TwitterBlue />
            {/* <i className="fab fa-twitter">t</i> */}
          </Link>
          <Link
            href="https://www.linkedin.com/in/mrezahussaini"
            className="size-10 flex items-center justify-center rounded-md text-2xl hover:scale-110 transition-transform"
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
      <div>
        <p className="text-paragraph_color text-sm md:text-base mt-10 sm:leading-10 leading-7">
          Mohammad Reza Hussaini, currently based in the USA, is a leading
          advocate for peace, education, and human rights. He is the founder of
          the National Youth Consensus for Peace and Change Makers of the World.
          Additionally, he leads Peshtaaz LLC, an organization working on the
          Jobs4Peace initiative.
        </p>
        <p className="text-paragraph_color text-sm md:text-base  sm:leading-10 leading-7">
          Hussaini has partnered with local organizations, the Afghan
          government, and the international community to support and implement
          projects that promote human rights and peace.
        </p>
        <br />
        <p className="text-paragraph_color text-sm md:text-base  sm:leading-10 leading-7">
          “As Afghan society lags behind, I decided to step up my efforts.
          Alongside my school education, I began my social activities. I’ve had
          to make decisions beyond my years and work hard, but I’m grateful to
          have succeeded in helping my fellow Afghans,” said Hussaini.
        </p>
        <br />
        <p className="text-paragraph_color text-sm md:text-base  sm:leading-10 leading-7">
          His deep involvement in Afghanistan's diplomatic peace process as a
          youth representative led to advocacy for meaningful youth inclusion in
          those discussions. In recognition of his efforts, Mohammad Reza
          Hussaini was honored with the Change Makers Award in 2021 for his
          contributions to human rights and peace in Afghanistan.
        </p>
        <div className="flex items-center  gap-2 mt-10">
          <button className="flex items-center justify-center  bg-primary-50 bg-opacity-20 rounded-lg p-2">
            <RelatedArticlesIcon />
          </button>
          <span className="text-2xl"> RelatedArticles</span>
        </div>
        <div className="flex items-center flex-wrap sm:justify-start justify-center gap-2 mt-10">
          <Link
            href="https://www.ksmu.org/people/mohammad-hussaini"
            className="text-primary-50 cursor-pointer bg-primary-50 bg-opacity-30 items-center flex justify-center rounded-[49px] p-2 border border-primary-50 w-fit"
          >
            Orzaks (NPR)
          </Link>
          <div
            onClick={() => router.back()}
            className="text-primary-50 cursor-pointer bg-transparent items-center flex gap-2 justify-center rounded-[49px] p-2 border border-primary-50 w-24"
          >
            <IoIosArrowBack />
            Back
          </div>
        </div>
      </div>
    </div>
  );
}
