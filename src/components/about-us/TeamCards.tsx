import React from "react";

import amani from "public/images/about/Amani.png";
import hussaini from "public/images/about/Hussaini.png";
import massie from "public/images/about/Massie.png";
import background from "public/images/about/Background.jpg";
import back from "public/images/about/back.png";
import Image from "next/image";
import Link from "next/link";
import { ArrowCircleUp, ArrowRight, Instagram, Telegram } from "../icons/Icons";
import { FaGlobe } from "react-icons/fa6";

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
            width={1200}
            height={1200}
            className="w-full h-[376px] object-cover object-top overflow-hidden z-10"
          />
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-white h-[376px] bg-opacity-60 flex flex-col justify-center items-center text-center text-primary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out">
            <p className="text-sm px-4 text-justify">
              Mohammad Jawid Amani is an Afghan education activist and the
              founder of Change Makers of the World, a volunteer community
              focused on improving education and advocating for human rights in
              Afghanistan. He also co-founded Afghanistan’s National Youth
              Consensus, a platform that gave young Afghans a voice in important
              national discussions, including the Afghan peace process.
            </p>
            <div className="flex gap-2 mt-4">
              <Link
                href={"https://www.jawidamani.com/"}
                className="bg-primary-50 bg-opacity-15 hover:bg-opacity-30 rounded-md size-8 flex items-center justify-center"
              >
                <FaGlobe />
              </Link>
              <Link
                href={"https://www.instagram.com/jawid_amani/"}
                className="bg-primary-50 bg-opacity-15 hover:bg-opacity-30 rounded-md size-8 flex items-center justify-center"
              >
                <Instagram />
              </Link>
              <Link
                href={"about/amani"}
                className="bg-primary-50 bg-opacity-15 hover:bg-opacity-30 rounded-md size-8 flex items-center justify-center"
              >
                <ArrowRight />
              </Link>
            </div>
          </div>
        </div>

        <div className="h-[10px] bg-primary-50 w-full"></div>
        <div className="p-4 text-center">
          <h3 className="font-normal text-lg text-black_color">
            Mohammad Jawid Amani
          </h3>
          <p className="text-sm text-paragraph_color">Founder</p>
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
            width={1200}
            height={1200}
            className="w-full h-[376px] object-cover object-top overflow-hidden z-10"
          />
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-white h-[376px] bg-opacity-60 flex flex-col justify-center items-center text-center text-primary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out">
            <p className="text-sm px-4 text-justify">
              Ms. Rahmati is the President of Change Makers of the World in the
              USA. She has been recognized by the United States Congress for her
              efforts to inspire women to embrace self-love, independence,
              education, and confidence. Today, she continues to advocate for
              human rights and stands in solidarity with the people of
              Afghanistan during these challenging times.
            </p>
            <div className="flex gap-2 mt-4">
              <Link
                href={"about/rahmati"}
                className="bg-primary-50 bg-opacity-15 hover:bg-opacity-30 rounded-md size-8 flex items-center justify-center"
              >
                <ArrowRight />
              </Link>
            </div>
          </div>
        </div>

        <div className="h-[10px] bg-primary-50 w-full"></div>
        <div className="p-4 text-center">
          <h3 className="font-normal text-lg text-black_color">
            Massie Rahmati
          </h3>
          <p className="text-sm text-paragraph_color">President - USA</p>
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
            width={1200}
            height={1200}
            className="w-full h-[376px] object-cover object-top z-10 overflow-hidden"
          />
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-white h-[376px] bg-opacity-60 flex flex-col justify-center items-center text-center text-primary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out delay-100">
            <p className="text-sm px-4 text-justify">
              Mohammad Reza Hussaini, currently based in the USA, is a leading
              advocate for peace, education, and human rights. He is the founder
              of the National Youth Consensus for Peace and Change Makers of the
              World. Additionally, he leads Peshtaaz LLC, an organization
              working on the Jobs4Peace initiative. Hussaini has partnered with
              local organizations, the Afghan government, and the international
              community to support and implement projects that promote human
              rights and peace.
            </p>
            <div className="flex gap-2 mt-4">
              <Link
                href={"https://www.rezahussaini.com/"}
                className="bg-primary-50 bg-opacity-15 hover:bg-opacity-30 rounded-md size-8 flex items-center justify-center"
              >
                <FaGlobe />
              </Link>
              <Link
                href={"www.instagram.com/m_rezahussaini"}
                className="bg-primary-50 bg-opacity-15 hover:bg-opacity-30 rounded-md size-8 flex items-center justify-center"
              >
                <Instagram />
              </Link>
              <Link
                href={"about/hussaini"}
                className="bg-primary-50 hover:bg-opacity-30 bg-opacity-15 rounded-md size-8 flex items-center justify-center"
              >
                <ArrowRight />
              </Link>
            </div>
          </div>
        </div>

        <div className="h-[10px] bg-primary-50 w-full"></div>
        <div className="p-4 text-center">
          <h3 className="font-normal text-lg text-black_color">
            Mohammad Reza Hussaini
          </h3>
          <p className="text-sm text-paragraph_color">Founder</p>
        </div>
      </div>
    </div>
  );
};

export default TeamCards;
