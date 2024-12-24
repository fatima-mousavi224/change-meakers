import { ArrowRight } from "@/icons/Icons";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function About() {
  return (
    <div className="pt-16">
      <div className="flex lg:flex-row flex-col-reverse gap-4 ">
        {/* Left Section */}
        <div className="flex flex-col justify-between rounded-lg shadow-1xl p-5 bg-light_gray lg:w-[60%]">
          <div>
            <h2 className="sm:text-2xl text-base font-semibold text-gray-800 mb-4">
              About Change Makers of the World
            </h2>
            <p className="text-sm xl:text-base mb-2 text-justify text-paragraph_color xl:leading-8 leading-5">
              We are a youth-led volunteer community dedicated to supporting
              quality education and advocating for human rights in Afghanistan.
              As the first and largest of its kind in the country, our impact
              extends beyond borders through various programs. To date, we've
              benefited over 10,000 individuals and organized more than 186
              initiatives across Afghanistan. In response to the Taliban's ban
              on girls' education, we offer online and in-person classes,
              distribute school materials, and provide recorded lessons for
              Afghan children and girls. In 2020, we took a pivotal step in
              youth inclusion by establishing the National Youth Consensus for
              Peace, a coalition of 240 organizations involved in the Afghan
              peace process and decision-making (#Youths4Peace). Our team has
              represented Afghan youth on the global stage and earned several
              awards, including the prestigious Diana Award in 2023.
              <br />
              <br />
              We've been recognized internationally, with features in global
              media. Our work continues across Afghanistan, where we build
              schools, distribute educational resources, and promote the United
              Nations Sustainable Development Goals (SDGs). We also collaborate
              with American and European organizations to support Afghan
              refugees and advocate for Afghan human rights worldwide.
            </p>
          </div>
          <div className="flex justify-between">
            <Link
              href="/mission&impact"
              className="inline-block text-primary_color text-sm xl:text-base underline"
            >
              Learn more about our mission and impact by clicking here.
            </Link>
            <Link href="/mission&impact">
              <ArrowRight className="bg-black rounded-full hover:bg-opacity-80 " />
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 lg:w-[40%] ">
          <div>
            <Image
              src="/images/about/amani-hero.png"
              alt="Student 1"
              width={1200}
              height={1200}
              className="rounded-lg object-cover h-[240px] lg:h-[390px] w-full mb-4"
            />
            <Image
              src="/images/about/girls.jpg"
              alt="Students walking"
              width={1200}
              height={1200}
              className="rounded-lg object-cover h-[150px] lg:h-[200px] w-full"
            />
          </div>
          <div>
            <Image
              src="/images/about/teams.jpg"
              alt="Classroom"
              width={1200}
              height={1200}
              className="rounded-lg object-cover h-[150px] lg:h-[200px] w-full mb-4"
            />
            <Image
              src="/images/about/project.jpg"
              alt="Smiling student"
              width={1200}
              height={1200}
              className="rounded-lg object-cover h-[240px] lg:h-[390px] w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
