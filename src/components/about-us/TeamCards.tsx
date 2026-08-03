import React from "react";

import amani from "public/images/about/Amani.png";
import hussaini from "public/images/about/Hussaini.png";
import massie from "public/images/about/Massie.png";
import background from "public/images/about/Background.jpg";
import back from "public/images/about/back.png";
import Image from "next/image";
import Link from "next/link";
import { ArrowCircleUp, ArrowRight, Instagram, LinkIcon } from "../icons/Icons";
import { FaGlobe, FaX } from "react-icons/fa6";
import { Linkedin } from "lucide-react";

const TeamCards = () => {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {/* Card 1 */}

      <div
        className="w-80 rounded-lg shadow-lg overflow-hidden border relative "
        style={{
          backgroundImage: `url(${back.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="group">
          <Image
            src={amani}
            alt="Mohammad Jawid Amani"
            width={320}
            height={376}
            loading="lazy"
            sizes="320px"
            className="h-[376px] w-full overflow-hidden object-cover object-top z-10"
          />
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-white h-[376px] bg-opacity-60 flex flex-col justify-center items-center text-center text-primary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out">
            <p className="text-sm px-4 text-justify">
              Mohammad Jawid Amani is the Founder and Executive Director of Change Makers of the World. He is responsible for the organization’s strategic direction, program development, and external engagement related to education and youth-focused initiatives.

              His work has focused on education access and youth participation in Afghanistan, including coordination of community-based activities and engagement with national and international platforms.
            </p>
            <div className="flex gap-2 mt-4">
              <Link
                href={"https://www.jawidamani.com/"}
                target="_blank"
                className="bg-primary-50 bg-opacity-15 hover:bg-opacity-30 rounded-md size-8 flex items-center justify-center"
              >
                <FaGlobe />
              </Link>
              {/* <Link
                href={"https://www.instagram.com/jawid_amani/"}
                className="bg-primary-50 bg-opacity-15 hover:bg-opacity-30 rounded-md size-8 flex items-center justify-center"
              >
                <Instagram />
              </Link> */}
              <Link
                href="www.linkedin.com/in/jawidamani/"
                target="_blank"
                className="bg-primary-50 bg-opacity-15 hover:bg-opacity-30 rounded-md size-8 flex items-center justify-center"
              >
                <Linkedin />
              </Link>
            </div>
          </div>
        </div>

        <div className="h-[10px] bg-primary-50 w-full"></div>
        <div className="p-4 text-center">
          <h3 className="font-normal text-lg text-black_color">
            Mohammad Jawid Amani
          </h3>
          {/* <p className="text-sm text-paragraph_color">Founder</p> */}
        </div>
      </div>
      {/* Card 2 */}
      <div
        className="w-80 rounded-lg shadow-lg overflow-hidden border relative "
        style={{
          backgroundImage: `url(${back.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="group">
          <Image
            src={massie}
            alt="massie"
            width={320}
            height={376}
            loading="lazy"
            sizes="320px"
            className="h-[376px] w-full overflow-hidden object-cover object-top z-10"
          />
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-white h-[376px] bg-opacity-60 flex flex-col justify-center items-center text-center text-primary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out">
            <p className="text-sm px-4 text-justify">
              Masuda Rahmati serves as President of Change Makers of the World in the United States. She supports organizational coordination, outreach, and engagement with partners based in the U.S., with a focus on strengthening program support and external relations.

              She has a professional background in business and authorship, which informs her role in supporting the organization’s education-related initiatives and engagement efforts connected to Afghanistan.
            </p>
            <div className="flex gap-2 mt-4">
              <Link
                href='https://www.masudarahmati.com/'
                className="bg-primary-50 bg-opacity-15 hover:bg-opacity-30 rounded-md size-8 flex items-center justify-center"
              >
                <FaGlobe />
              </Link>
            </div>
          </div>
        </div>

        <div className="h-[10px] bg-primary-50 w-full"></div>
        <div className="p-4 text-center">
          <h3 className="font-normal text-lg text-black_color">
            Masuda Rahmati
          </h3>
          {/* <p className="text-sm text-paragraph_color">President - USA</p> */}
        </div>
      </div>

      {/* <div
        className="w-80 rounded-lg shadow-lg overflow-hidden border relative bg-gray-100 h-[469px]"
        style={{
          backgroundImage: `url(${background.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${massie.src})`,
          }}
        ></div>
        <div className="h-[10px] bg-primary-100 z-30 w-full mt-5"></div>
        <Link
          href={"about/rahmati"}
          className="absolute bottom-0 w-full bg-white bg-opacity-80 z-10 flex flex-col items-center p-4 h-[437px]"
        >
          <h3 className="text-lg text-black_color">Massie Rahmati</h3>
          <p className="text-sm text-paragraph_color mb-4">President - USA</p>
          <p className="text-sm text-justify text-primary-50 px-4">
            Ms. Rahmati is the President of Change Makers of the World in the
            USA. She has been recognized by the United States Congress for her
            efforts to inspire women to embrace self-love, independence,
            education, and confidence. Today, she continues to advocate for
            human rights and stands in solidarity with the people of Afghanistan
            during these challenging times.
          </p>
          <div className="flex gap-2 mt-4">
            <Link
              href={"#"}
              className="bg-primary-50 bg-opacity-15 rounded-md size-8 flex items-center justify-center"
            >
              <Telegram />
            </Link>
            <Link
              href={"#"}
              className="bg-primary-50 bg-opacity-15 rounded-md size-8 flex items-center justify-center"
            >
              <Instagram />
            </Link>
            <Link
              href={"#"}
              className="bg-primary-50 bg-opacity-15 rounded-md size-8 flex items-center justify-center"
            >
              <ArrowRight />
            </Link>
          </div>
        </Link>
      </div> */}

      {/* Card 3 */}
      <div
        className="w-80 rounded-lg shadow-lg overflow-hidden border relative group"
        style={{
          backgroundImage: `url(${back.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="group">
          <Image
            src={hussaini}
            alt="Mohammad Reza Hussaini"
            width={320}
            height={376}
            loading="lazy"
            sizes="320px"
            className="h-[376px] w-full overflow-hidden object-cover object-top z-10"
          />
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-white h-[376px] bg-opacity-60 flex flex-col justify-center items-center text-center text-primary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out delay-100">
            <p className="text-sm px-4 text-justify">
              Mohammad Reza Hussaini is involved with Change Makers of the World through support to program activities connected to education and youth participation. He contributes to the organization’s work by engaging in education related and social initiatives.

              Based in the United States, his involvement supports coordination and engagement related to the organization’s activities.
            </p>
            <div className="flex gap-2 mt-4">
              <Link
                href="https://x.com/m_rezahussaini"
                target="_blank"
                className="bg-primary-50 bg-opacity-15 hover:bg-opacity-30 rounded-md size-8 flex items-center justify-center"
              >
                <FaX />
              </Link>
              {/* <Link
                href={"www.instagram.com/m_rezahussaini"}
                className="bg-primary-50 bg-opacity-15 hover:bg-opacity-30 rounded-md size-8 flex items-center justify-center"
              >
                <Instagram />
              </Link> */}
              {/* <Link
                href={"about/hussaini"}
                className="bg-primary-50 hover:bg-opacity-30 bg-opacity-15 rounded-md size-8 flex items-center justify-center"
              >
                <ArrowRight />
              </Link> */}
            </div>
          </div>
        </div>

        <div className="h-[10px] bg-primary-50 w-full"></div>
        <div className="p-4 text-center">
          <h3 className="font-normal text-lg text-black_color">
            Mohammad Reza Hussaini
          </h3>
          {/* <p className="text-sm text-paragraph_color">Founder</p> */}
        </div>
      </div>
    </div>
  );
};

export default TeamCards;
