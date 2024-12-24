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

export default function InformationAmani() {
  const router = useRouter();

  return (
    <div className="mt-10">
      {/* Right Section: Text Content */}
      <div className="flex md:flex-row flex-col  items-center md:hidden gap-4 text-black_color">
        <div className="space-y-4 flex flex-col items-center justify-center xl:w-[499px] w-full">
          <h1 className="font-bold text-2xl md:text-4xl">
            Mohammad Jawid Amani
          </h1>
          <p className="text-lg md:text-xl text-paragraph_color">
            Education Activist and Founder
          </p>
          <a href="#" className="text-paragraph_color underline text-sm">
            Official Website
          </a>
        </div>

        {/* Social Media Section */}
        <div className="flex gap-4 mt-4 items-center justify-center bg-light_gray bg-opacity-75 py-8 px-10 rounded-lg   sm:w-1/2 w-full">
          <Link
            href="https://www.facebook.com/amani.jawid"
            className="size-10 flex items-center justify-center rounded-md text-2xl hover:scale-110 transition-transform"
          >
            <FaFacebook className="text-blue-500" />
          </Link>
          <Link
            href="https://x.com/jawid_amani"
            className="size-10 flex items-center justify-center rounded-md text-2xl hover:scale-110 transition-transform"
          >
            <TwitterBlue />
            {/* <i className="fab fa-twitter">t</i> */}
          </Link>
          <Link
            href="https://www.linkedin.com/in/jawidamani"
            className="size-10 flex items-center justify-center rounded-md text-2xl hover:scale-110 transition-transform"
          >
            <LinkedinBlue className="text-blue-700" />
            {/* <i className="fab fa-linkedin">l</i> */}
          </Link>
          <Link
            href="www.instagram.com/jawid_amani"
            // add bg-gradent for icon instagram
            className="size-10 rounded-md bg-gradient-to-tr from-yellow-400 via-pink-500 to-red-500 flex items-center justify-center hover:scale-110 transition-transform"
          >
            <InstagramBlue className="text-pink-500" />
          </Link>
        </div>
      </div>
      <div>
        <p className="text-paragraph_color text-sm md:text-base mt-10 sm:leading-10 leading-7">
          Mohammad Jawid Amani is an Afghan education activist and the founder
          of Change Makers of the World, a volunteer community focused on
          improving education and advocating for human rights in Afghanistan. He
          also co-founded Afghanistan’s National Youth Consensus, a platform
          that gave young Afghans a voice in important national discussions,
          including the Afghan peace process. In 2023, Jawid Amani was
          recognized with the highest accolade a young person can achieve for
          social action or humanitarian efforts – The Diana Award from the UK.
        </p>
        <br />
        <p className="text-paragraph_color text-sm md:text-base  sm:leading-10 leading-7">
          “My homeland! Your pains will end, and that day we will proudly live
          in your lap.” – Jawid Amani
        </p>
        <div className="flex items-center  gap-2 mt-10">
          <button className="flex items-center justify-center  bg-primary-50 bg-opacity-20 rounded-lg p-2">
            <RelatedArticlesIcon />
          </button>
          <span className="text-2xl"> RelatedArticles</span>
        </div>
        <div className="flex items-center flex-wrap sm:justify-start justify-center gap-2 mt-10">
          <Link
            href="https://www.ariananews.af/two-young-afghans-win-diana-award-2023/"
            className="text-primary-50 cursor-pointer bg-primary-50 bg-opacity-30 items-center flex justify-center rounded-[49px] p-2 border border-primary-50 w-fit"
          >
            Ariana News
          </Link>
          <Link
            href="https://www.youtube.com/watch?v=QshTzuFm4tM"
            className="text-primary-50 cursor-pointer bg-primary-50 bg-opacity-30 items-center flex justify-center rounded-[49px] p-2 border border-primary-50 w-fit"
          >
            Afghanistan International TV
          </Link>
          <Link
            href="https://da.azadiradio.com/a/32486825.html"
            className="text-primary-50 cursor-pointer bg-primary-50 bg-opacity-30 items-center flex justify-center rounded-[49px] p-2 border border-primary-50 w-fit"
          >
            Radio Liberty (Azadi)
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
