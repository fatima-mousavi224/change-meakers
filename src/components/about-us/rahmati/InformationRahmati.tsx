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

export default function InformationRahmati() {
  const router = useRouter();

  return (
    <div className="mt-10">
      {/* Right Section: Text Content */}
      <div className="flex md:flex-row flex-col  items-center md:hidden gap-4 text-black_color">
        <div className="space-y-4 flex flex-col items-center justify-center xl:w-[499px] w-full">
          <h1 className="font-bold text-2xl md:text-4xl">Massie Rahmati</h1>
          <p className="text-lg md:text-xl text-paragraph_color">
            Real Estate Investor and Author
          </p>
          <p className="text-paragraph_color text-sm">President - USA</p>
        </div>
      </div>
      <div>
        <p className="text-paragraph_color text-sm md:text-base mt-10 sm:leading-10 leading-7">
          Massie Rahmati is a passionate women’s rights activist and advocate
          for Afghan women and girls. Born in Kabul, Afghanistan, in 1969, she
          fled the country with her family in 1980 due to the Russian invasion.
          After immigrating to the United States in 1982, she pursued her
          education and graduated with a bachelor's degree in Sociology with an
          emphasis in Social Psychology from the University of Santa Cruz,
          California.
        </p>
        <br />
        <p className="text-paragraph_color text-sm md:text-base  sm:leading-10 leading-7">
          In 2005, Ms. Rahmati made headlines as the first Mrs. Afghanistan to
          compete in the Mrs. World Beauty Pageant, despite facing severe
          threats from the Taliban. Her activism focuses on raising awareness
          about the brutal conditions Afghan women and girls face under Taliban
          rule.
        </p>
        <br />
        <p className="text-paragraph_color text-sm md:text-base  sm:leading-10 leading-7">
          Ms. Rahmati is the President of Change Makers of the World in the USA.
          She has been recognized by the United States Congress for her efforts
          to inspire women to embrace self-love, independence, education, and
          confidence. Today, she continues to advocate for human rights and
          stands in solidarity with the people of Afghanistan during these
          challenging times.
        </p>

        <div className="flex items-center  sm:justify-start justify-center gap-2 mt-10">
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
