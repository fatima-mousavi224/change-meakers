import React from "react";
import Link from "next/link";
import MissionSlider from "./MissionSlider";
import Icon from "@/components/common/IconComponent/index";

export default function OurMission() {
  return (
    <div className="my-12 grid lg:grid-cols-2 grid-cols-1 gap-5 h-auto items-stretch">
      {/* Text Content */}
      <div className="flex flex-col order-2 lg:order-1 justify-between rounded-lg shadow-1xl p-5 bg-light_gray">
        <div>
          <h3 className="text-lg md:text-xl xl:text-2xl py-2 font-semibold">
            Our Mission and Impact
          </h3>
          <p className="text-sm xl:text-base mb-2 text-justify text-paragraph_color leading-7 sm:leading-10">
            Our Impact: Our educational initiatives in Afghanistan have had a
            significant impact, benefiting around 10,000 individuals, primarily
            children, youths, and girls. The focus of our efforts has been on
            providing educational resources and support in a challenging
            environment. Despite facing social barriers, security threats, and
            restrictions from the Taliban, we achieved notable outcomes. We
            distributed thousands of books and educational materials, especially
            targeting girl students and those affected by war. Our support
            extended to funding small educational initiatives such as the
            Dynamic Girls for Change program and other similar projects. We
            facilitated online access to educational materials for 60,000
            Afghans through an online library and established collaborations
            with schools to enhance learning. Our comprehensive programs,
            delivered both in person and online, covered school subjects and
            included teachings on rights, public speaking, empowerment, and
            self-awareness. In total, we conducted over 186 initiatives and
            assisted students in securing scholarships and preparing for them.
            The primary focus of our educational programs has been on girls and
            war-affected students, demonstrating our commitment to advancing
            education in Afghanistan despite numerous challenges.
          </p>
        </div>
        <div className="flex justify-between items-center">
          <Link
            href="/mission&impact/details"
            className="text-primary-50 hover:text-primary-200 lg:text-base text-sm"
          >
            Learn More
          </Link>
          <Link
            href="/mission&impact/details"
            className="rounded-full bg-black h-8 w-8 hover:bg-opacity-80 flex items-center justify-center"
          >
            <Icon
              icon="RightArrow"
              height={35}
              width={35}
              className="text-white"
            />
          </Link>
        </div>
      </div>

      {/* Slider Component */}
      <div className="order-1 lg:order-2">
        <MissionSlider />
      </div>
    </div>
  );
}
