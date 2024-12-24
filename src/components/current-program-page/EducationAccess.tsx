import React from "react";
import Header from "./Header";
import Card from "./Card";
import { cardData, educationSlideData } from "@/lib/data";
import Sliders from "./Sliders";

export default function EducationAccess() {
  return (
    <div className="flex flex-col gap-10 ">
      <div className="flex flex-col gap-4 items-center justify-center max-w-screen-2xl mx-auto">
        <Header btnName="Visuals" title="Educational Programs and Resources" />
        <div className="flex items-center justify-center w-[360px] sm:w-full mx-auto">
          <Sliders data={educationSlideData} />
        </div>
      </div>
      <div className="bg-light_gray w-full py-10">
        <Header
          btnName="In-Depth Insight"
          title="Educational Programs and Resources"
        />
        <div className="px-4 max-w-screen-xl mx-auto ">
          <Card cardData={cardData} />
        </div>
      </div>
    </div>
  );
}
