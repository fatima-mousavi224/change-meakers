"use client";
import React from "react";
import { buttonContents } from "./CurrentProgram";
import { SITE_CONTAINER_CLASS } from "@/constant/siteContainer";
import { cn } from "@/utilities/cn";

interface CurrentProgramBannerProps {
  activeButton: number;
  setActiveButton: (button: number) => void;
}
export default function CurrentProgramBanner({
  activeButton,
  setActiveButton,
}: CurrentProgramBannerProps) {
  return (
    <div className={cn("bg-bannerProgram bg-no-repeat bg-center bg-cover h-[65vh] rounded-[20px] mt-4 flex justify-center items-center relative", SITE_CONTAINER_CLASS)}>
      <div className="absolute inset-0 " />
      <div className="flex flex-col sm:gap-8 gap-4 justify-center items-center text-center text-white px-4">
        <h1
          className={cn(
            " font-bold relative z-10 sm:text-2xl text-xl md:text-5xl flex flex-col gap-2 md:gap-4 justify-center items-center "
          )}
        >
          Change Makers of the World
        </h1>
        <p className="text-lg md:text-3xl z-10 relative ">
          Empowering Afghan Girls Through Education and Support
        </p>
        <div className="z-0 flex gap-2 flex-wrap items-center justify-center">
          {buttonContents.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveButton(item.id)}
              className={`border-[3.5px] border-dark_gray py-2 px-4 rounded-[9.31px] cursor-pointer w-56  ${
                activeButton === item.id
                  ? "bg-light_gray text-primary_color"
                  : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
