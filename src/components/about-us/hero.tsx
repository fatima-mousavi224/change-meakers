// import { ArrowRight } from "@/icons/Icons";
import Image from "next/image";
// import Link from "next/link";
import React from "react";

export default function About() {
  return (
    <div className="mt-4">
      <div className="flex lg:flex-row flex-col-reverse gap-4 ">
        {/* Left Section */}
        <div className="flex flex-col justify-between  shadow-1xl  lg:w-[60%]">
          <div className="bg-light_gray rounded-lg p-5">
            <h2 className="sm:text-2xl text-base font-semibold text-gray-800 mb-4">
              Who We Are
            </h2>
            <p className="text-sm xl:text-base mb-2 text-justify text-paragraph_color xl:leading-8 leading-5">

              Change Makers of the World is a youth-led organization focused on girls’ education and human rights, with its work centered on Afghanistan. The organization was established to support access to education and promote responsible engagement on rights-related issues.
              <br />
            </p>
          </div>

          <div className="bg-light_gray rounded-lg p-5 mt-3">
            <h2 className="sm:text-2xl text-base font-semibold text-gray-800 mb-4">
                Our Focus Areas
            </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-50 text-center font-bold text-white leading-8">1</div>
                  <div>
                    <h3 className="font-semibold">Girls’ Education</h3>
                    <p className="text-sm xl:text-base text-justify text-paragraph_color xl:leading-7 leading-5">
                      Change Makers of the World supports access to education for Afghan girls through learning activities, provision of educational materials, and locally implemented education initiatives. This work focuses on maintaining learning opportunities for girls in contexts where formal schooling is restricted or unavailable.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-50  text-center font-bold text-white leading-8">2</div>
                  <div>
                    <h3 className="font-semibold">Human Rights</h3>
                    <p className="text-sm xl:text-base text-justify text-paragraph_color xl:leading-7 leading-5">
                      The organization works on human rights by documenting issues affecting women, girls, and youth and contributing to public and institutional discussions. This includes engagement with civil society platforms and participation in dialogue at national and international levels.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-50 text-center font-bold  leading-8 text-white">3</div>
                  <div>
                    <h3 className="font-semibold">Youth Leadership and Participation</h3>
                    <p className="text-sm xl:text-base text-justify text-paragraph_color xl:leading-7 leading-5">
                      Change Makers of the World engages young people in structured activities related to education and social issues, including consultations, learning initiatives, and community involvement. This work focuses on practical participation and skill development, rather than symbolic or representational roles.
                    </p>
                  </div>
                </div>
              </div>
          </div>
          {/* <div className="flex justify-between">
            <Link
              href="/mission&impact"
              className="inline-block text-primary_color text-sm xl:text-base underline"
            >
              Learn more about our mission and impact by clicking here.
            </Link>
            <Link href="/mission&impact">
              <ArrowRight className="bg-black rounded-full hover:bg-opacity-80 " />
            </Link>
          </div> */}
        </div>

        {/* Right Section */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 lg:w-[40%] ">
          <div>
            <Image
              src="/images/about/amani-hero.png"
              alt="Student 1"
              width={1200}
              height={1200}
              className="rounded-lg object-cover h-[240px] lg:h-[450px] w-full mb-4"
            />
            <Image
              src="/images/about/girls.jpg"
              alt="Students walking"
              width={1200}
              height={1200}
              className="rounded-lg object-cover h-[150px] lg:h-[250px] w-full"
            />
          </div>
          <div>
            <Image
              src="/images/about/teams.jpg"
              alt="Classroom"
              width={1200}
              height={1200}
              className="rounded-lg object-cover h-[150px] lg:h-[250px] w-full mb-4"
            />
            <Image
              src="/images/about/project.jpg"
              alt="Smiling student"
              width={1200}
              height={1200}
              className="rounded-lg object-cover h-[240px] lg:h-[450px] w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
