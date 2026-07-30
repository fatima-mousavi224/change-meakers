import { SITE_CONTAINER_CLASS } from "@/constant/siteContainer";
import React from "react";
import Header from "./Header";
import Card from "./Card";
import { cardHumanRightData, slidesRightHuman } from "@/lib/data";
import Sliders from "./Sliders";

export default function HumanRights() {
  return (
    <div className="flex flex-col gap-10">
      <div className={`flex flex-col gap-4 items-center justify-center ${SITE_CONTAINER_CLASS}`}>
        <Header btnName="Visuals" title="Human Rights" />
        <div className="flex items-center justify-center w-[360px] sm:w-full mx-auto">
          <Sliders data={slidesRightHuman} />
        </div>
      </div>
      <div className="bg-light_gray w-full py-10">
        <Header btnName="In-Depth Insight" title="Human Rights" />
        <Card cardData={cardHumanRightData} />
      </div>
    </div>
  );
}
