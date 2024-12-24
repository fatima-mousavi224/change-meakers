import React from "react";
import Header from "./Header";
import Card from "./Card";
import { cardHumanitarianData, slidesHumanitarianSupport } from "@/lib/data";
import Sliders from "./Sliders";

export default function HumanitarianSupport() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 items-center justify-center max-w-screen-2xl mx-auto">
        <Header btnName="Visuals" title="Humanitarian Support" />
        <div className="flex items-center justify-center w-[360px] sm:w-full mx-auto">
          <Sliders data={slidesHumanitarianSupport} />
        </div>
      </div>
      <div className="bg-light_gray w-full py-10">
        <Header
          btnName="In-Depth Insight"
          title="Humanitarian Support and Mental Health Programs"
        />
        <Card cardData={cardHumanitarianData} />
      </div>
    </div>
  );
}
