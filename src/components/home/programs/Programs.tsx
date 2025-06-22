"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React, { TouchEvent, useEffect, useState } from "react";
// components/StatsCard.tsx
import { FaUsers } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import Icon from "@/components/common/IconComponent";
import { educationSlideData } from "@/lib/data";
import { HiOfficeBuilding } from "react-icons/hi";
import { FaLink } from "react-icons/fa6";
import { TbMessagePause } from "react-icons/tb";
import { PiChalkboardTeacherFill } from "react-icons/pi";
import { FaArrowRightLong } from "react-icons/fa6";
import { BsBarChartSteps } from "react-icons/bs";
import { RighArrow } from "../../icons/Icons";
import image1 from "../../../../public/images/home-page/hero-section/slide1.png";
import imgUrl from "../../../../public/images/home-page/hero-section/slide1.png";
import image2 from "../../../../public/images/home-page/hero-section/slide2.png";
import image3 from "../../../../public/images/home-page/hero-section/slide3.png";
import leftQute from "../../../../public/images/home-page/leftQuete.png";
import rightQute from "../../../../public/images/home-page/rightQuete.png";
import whitePaper from "../../../../public/images/home-page/whitePaper.png";
import news1 from "../../../../public/images/home-page/news-stories/news1.png";
import profile from "../../../../public/images/home-page/avatar.png";
import liveImage1 from "../../../../public/images/home-page/liveImage1.png";
import liveImage2 from "../../../../public/images/home-page/liveImage2.png";
import liveImage3 from "../../../../public/images/home-page/liveImage3.png";
import icons1 from "../../../../public/images/home-page/icons1.png";
import icons2 from "../../../../public/images/home-page/icons2.png";
import icons3 from "../../../../public/images/home-page/icons3.png";
import line from "../../../../public/images/home-page/line.png";
import { cn } from "utilities/cn";
import { CiCalendar } from "react-icons/ci";
import ParticipantsInfo from "@/components/mission-and-impact/Participants/ParticipantsInfo";
import { FaLinkedinIn } from "react-icons/fa6";
import { TfiReload } from "react-icons/tfi";
import Header from "@/components/current-program-page/Header";
import Sliders from "@/components/current-program-page/Sliders";
import { useParams } from "next/navigation";
import { OfferIcon, Project, TeamCard, Voice } from "@prisma/client";

interface Slide {
  image: StaticImageData;
  mobileImage?: StaticImageData;
}

const slides: Slide[] = [
  { image: image1 },
  { image: image2 },
  { image: image3 },
];

const Programs = () => {

  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    } else if (isRightSwipe) {
      setActiveIndex(
        (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
      );
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // programs section
  const stats = [
    {
      icon: <FaUsers className="text-2xl text-blue-700" />,
      title: "15+",
      description: "girls trained in coding and digital skills",
    },
    {
      icon: <HiOfficeBuilding className="text-2xl text-blue-700" />,
      title: "2 cities",
      description: "Kabul and Herat",
    },
    {
      icon: <PiChalkboardTeacherFill className="text-2xl text-blue-700" />,
      title: "5",
      description: "dedicated local and international instructors",
    },
    {
      icon: <BsBarChartSteps className="text-2xl text-blue-700" />,
      title: "5 levels",
      description:
        "of coding: Scratch, HTML/CSS, Python, JavaScript, Web Design",
    },
  ];

  // Team Members meet section
 
  // const TeamMembers = [
  //   {
  //     name: "Laila",
  //     course: "Web Development (HTML, CSS, JavaScript)",
  //     imgUrl: imgUrl, // Replace with actual image path
  //     description:
  //       "Laila had to leave school at a young age and stayed home for years with no access to learning. When she joined the academy, she didn’t know how to use a computer. Now, just a few months in, she’s building web pages with HTML and CSS. She comes to every class, asks questions, and says learning to code has given her a new sense of direction. Her goal is to become a freelance web developer and support her family from home.",
  //   },
  //   {
  //     name: "Marwa",
  //     course: "UI/UX Design Basics",
  //     imgUrl: imgUrl, // Replace with actual image path
  //     description:
  //       "Laila had to leave school at a young age and stayed home for years with no access to learning. When she joined the academy, she didn’t know how to use a computer. Now, just a few months in, she’s building web pages with HTML and CSS. She comes to every class, asks questions, and says learning to code has given her a new sense of direction. Her goal is to become a freelance web developer and support her family from home.",
  //   },
  //   {
  //     name: "Amina",
  //     course: "Introduction to Python Programming",
  //     imgUrl: imgUrl, // Replace with actual image path
  //     description:
  //       "Laila had to leave school at a young age and stayed home for years with no access to learning. When she joined the academy, she didn’t know how to use a computer. Now, just a few months in, she’s building web pages with HTML and CSS. She comes to every class, asks questions, and says learning to code has given her a new sense of direction. Her goal is to become a freelance web developer and support her family from home.",
  //   },
  // ];

  // Team Members meet section
  const Students = [
    {
      name: "Laila",
      course: "Web Development (HTML, CSS, JavaScript)",
      imgUrl: imgUrl, // Replace with actual image path
      description:
        "Laila had to leave school at a young age and stayed home for years with no access to learning. When she joined the academy, she didn’t know how to use a computer. Now, just a few months in, she’s building web pages with HTML and CSS. She comes to every class, asks questions, and says learning to code has given her a new sense of direction. Her goal is to become a freelance web developer and support her family from home.",
    },
    {
      name: "Marwa",
      course: "UI/UX Design Basics",
      imgUrl: imgUrl, // Replace with actual image path
      description:
        "Laila had to leave school at a young age and stayed home for years with no access to learning. When she joined the academy, she didn’t know how to use a computer. Now, just a few months in, she’s building web pages with HTML and CSS. She comes to every class, asks questions, and says learning to code has given her a new sense of direction. Her goal is to become a freelance web developer and support her family from home.",
    },
    {
      name: "Amina",
      course: "Introduction to Python Programming",
      imgUrl: imgUrl, // Replace with actual image path
      description:
        "Laila had to leave school at a young age and stayed home for years with no access to learning. When she joined the academy, she didn’t know how to use a computer. Now, just a few months in, she’s building web pages with HTML and CSS. She comes to every class, asks questions, and says learning to code has given her a new sense of direction. Her goal is to become a freelance web developer and support her family from home.",
    },
  ];

  // our monthly newslate archive
  const newsletters = [
    {
      date: "February 2025",
      title: "First Classes Begin",
      description:
        "Our first group of students started coding and design lessons in Kabul and nearby areas.",
      link: "#",
    },
    {
      date: "April 2025",
      title: "Safe Spaces, Real Skills",
      description:
        "We expanded in-person sessions with stronger equipment and safer learning spaces.",
      link: "#",
    },
    {
      date: "March 2025",
      title: "Learning HTML, Building Confidence",
      description:
        "Students completed their first websites and shared reflections on their progress.",
      link: "#",
    },
  ];
  
  const [projects, setProjects] = useState<
    (Project & {
      voices: Voice[];
      offerIcons: OfferIcon[];
      teamCards: TeamCard[]
    }) | null
  >(null);
  console.log("🚀 ~ projects id:", projects)
  const [loading, setLoading] = useState(true);
  const params= useParams();
  const id= params.id as string;
  
    useEffect(() => {
      const fetchProjects = async () => {
        try {
          const response = await fetch(`/api/projects/${id}`, { method: "GET" });
          if (!response.ok) throw new Error("Failed to fetch projects");
          const data = await response.json();
          // console.log("🚀 ~ fetchProjects ~ data:", data);
          setProjects(data);
        } catch (error) {
          console.error("Error fetching projects:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchProjects();
    }, [id]);
    

  return (
    <div>
      {/* Hero section */}
      <section className="max-w-screen-2xl px-4 mx-auto">
        <div className="lg:px-2">
          <div className="relative w-full max-w-[96vw] mx-auto mt-3 rounded-[35px] shadow-lg z-20">
            {/* Full Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-800 via-transparent to-transparent opacity-90 z-10 rounded-[35px]"></div>

            <div
              className="relative w-full sm:h-[80vh] h-[70vh] overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >

                <Image
                  src={projects?.heroImage ?? "" }
                  alt={projects?.heroTitle ?? ""}
                  fill
                  className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out opacity-100 z-0" : "opacity-0"
                   rounded-[35px]`}
                />
            </div>

            {/* Overlay with Static Text and Button */}
            <div className="absolute inset-0 z-20 bg-black bg-opacity-40 flex flex-col justify-end items-start sm:p-10 p-5 font-plusJakartaSans rounded-[35px]">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {projects?.heroTitle}
              </h2>
              <p className="text-sm md:text-lg text-white mb-1 font-bold font-plusJakartaSans">
                Our Vision: Together, we can change the world.
              </p>
              <p className="text-[#F2F2F2] font-plusJakartaSans mb-3">
                Stand With Us: #LetAfghanGirlsLearn
              </p>
              <Link
                href="/about"
                className="bg-white text-black_color text-md font-medium py-2 px-4 rounded-full hover:bg-gray-200 flex items-center text-center gap-2"
              >
                <span>Learn More</span>
                <RighArrow />
              </Link>
            </div>

            {/* Pagination Dots in Bottom Right Corner */}
            <div className="absolute bottom-10 right-10 z-30 flex space-x-2 items-center">
              {slides.map((_, index) => (
                <span
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`size-2 rounded-full transition-colors cursor-pointer ${
                    index === activeIndex ? "bg-white size-3" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>

            {/* Prev and Next Buttons on Borders */}
            <button
              onClick={() =>
                setActiveIndex(
                  (activeIndex - 1 + slides.length) % slides.length
                )
              }
              className="absolute -left-5 top-1/2 shadow-2xl transform -translate-y-1/2 hover:bg-gradient-to-l hover:from-[#bebebe66] hover:to-[#FFFFFF00] bg-gradient-to-l from-[#FFFFFF66] to-[#FFFFFF00] text-xl text-primary-50 w-10 h-10 rounded-[14px] p-1 z-30 items-center justify-center sm:flex hidden"
            >
              &#10094;
            </button>
            <button
              onClick={() => setActiveIndex((activeIndex + 1) % slides.length)}
              className="absolute -right-5 top-1/2 transform shadow-2xl -translate-y-1/2 bg-gradient-to-r from-[#FFFFFF66] to-[#FFFFFF00] sm:flex hidden hover:bg-gradient-to-r hover:from-[#bebebe66] hover:to-[#FFFFFF00] text-xl text-blue-600 w-10 h-10 rounded-[14PX] p-1 z-30 items-center justify-center"
            >
              &#10095;
            </button>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="bg-light_gray overflow-x-hidden md:bg-white max-w-screen-2xl mx-auto mt-10 px-6">
        <div className="bg-light_gray rounded-xl py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6  items-center">
            <div
              className="flex md:px-10 space-x-3 items-center gap-2 sm:w-1/4"
            >
              <div className="bg-white rounded-xl p-8 shadow-sm relative">
                <Image src={projects?.statusIcon1 ?? ""} alt={projects?.iconTitleStatus1 as string} width={500} height={500} className="absolute top-2 left-2 size-12 " />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{projects?.iconTitleStatus1}</h3>
                <p className="text-sm text-gray-500 w-40 md:w-56 line-clamp-2">
                  {projects?.shortDescriptionStatus1}
                </p>
              </div>
            </div>
            <div
              className="flex md:px-10 space-x-3 items-center gap-2 sm:w-1/4"
            >
              <div className="bg-white rounded-xl p-8 shadow-sm relative">
                <Image src={projects?.statusIcon2 ?? ""} alt={projects?.iconTitleStatus2 as string} width={500} height={500} className="absolute top-2 left-2 size-12 rounded-xl " />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{projects?.iconTitleStatus2}</h3>
                <p className="text-sm text-gray-500 w-40 md:w-56 line-clamp-2">
                  {projects?.shortDescriptionStatus2}
                </p>
              </div>
            </div>
        </div>
      </section>

      {/* our vission & our goal & slider section */}
      <section className="max-w-screen-2xl px-4 mx-auto mt-10 overflow-x-hidden">
        <div className="flex flex-col-reverse md:flex-row gap-6 ">
          {/* goal and vission part */}
          <div className="grid col-span-1 gap-4">
            {/* our vission card */}
            <div className="max-w-2xl bg-light_gray rounded-xl shadow shadow-gray-400 py-4 px-5">
              <h3 className="text-2xl font-semibold">{}</h3>
              <p className="text-gray-500 my-8">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Obcaecati quis tempore, odit sit ad at temporibus harum
                dignissimos aut quia ab praesentium quod laudantium nostrum
                voluptates fuga. Numquam, aperiam repellendus. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Atque eveniet quam quo
                adipisci nulla voluptate et blanditiis aut quae ut recusandae
                repellat tempore soluta minima in expedita culpa, optio omnis.
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              </p>
            </div>

            {/* our gaol card */}
            <div className="max-w-2xl bg-light_gray rounded-xl shadow shadow-gray-400 py-4 px-5">
              <h3 className="text-2xl font-semibold">Our Goal</h3>
              <p className="text-gray-500 my-8">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Obcaecati quis tempore, odit sit ad at temporibus harum
                dignissimos aut quia ab praesentium quod laudantium nostrum
                voluptates fuga. Numquam, aperiam repellendus. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Atque eveniet quam quo
                adipisci nulla voluptate et blanditiis aut quae ut recusandae
                repellat tempore soluta minima in expedita culpa, optio omnis.
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              </p>
            </div>
          </div>

          {/* slider section */}
          <div className="grid col-span-1">
            <div className="lg:w-[42vw]">
              <div className="relative overflow-hidden rounded-xl shadow-lg z-20">
                {/* Full Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-50 via-transparent to-transparent opacity-90 z-30 rounded-xl"></div>

                <div
                  className="relative sm:h-[75vh] h-[40vh] overflow-hidden"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {slides.map((slide, index) => (
                    <div
                      key={index}
                      className={cn(
                        "absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out",
                        {
                          "opacity-100 z-0": index === activeIndex,
                          "opacity-0 z-0": index !== activeIndex,
                        }
                      )}
                    >
                      {/* Dark Overlay */}
                      <div className="absolute inset-0 bg-black opacity-40 z-10"></div>

                      {/* Image */}
                      <Image
                        src={
                          isMobile && slide.mobileImage
                            ? slide.mobileImage
                            : slide.image
                        }
                        alt={`Slide ${index + 1}`}
                        fill
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Centered Pagination Dots */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40 flex space-x-2 items-center justify-center">
                  {slides.map((_, index) => (
                    <span
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        "rounded-full transition-colors cursor-pointer",
                        index === activeIndex
                          ? "bg-white size-3"
                          : "bg-gray-400 size-2"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About the program section  */}
      <section className="max-w-screen-2xl px-4 mx-auto mt-10">
        <div className="bg-light_gray p-8 rounded-xl shadow text-gray-800 space-y-6">
          {/* Title */}
          <h2 className="text-2xl font-semibold text-center">
            About the Program
          </h2>

          {/* Intro Paragraph */}
          <p className="text-sm leading-relaxed">
            This is a one-year, free coding and digital skills program for girls
            in Afghanistan who cannot attend school. It’s built to work both
            in-person and online, with small class sizes, clear instruction, and
            practical outcomes. Each student receives access to a laptop,
            internet (if needed), and step-by-step training aimed at real
            skills, real projects, and real opportunities.
          </p>

          {/* Curriculum Section */}
          <div>
            <h3 className="font-semibold text-sky-800 uppercase mb-2">
              Curriculum:
            </h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                Digital Literacy: Computer use, typing, file handling, online
                safety
              </li>
              <li>Web Development: HTML, CSS, JavaScript</li>
              <li>
                Python Programming: Problem-solving and basic application
                development
              </li>
              <li>
                Freelancing Skills: Portfolio building, online communication,
                job platforms
              </li>
              <li>
                Final Project: Each student completes a personal website or
                application
              </li>
            </ul>
            <p className="text-sm mt-2">
              Lessons are delivered in Dari or English, depending on the
              student’s level.
            </p>
          </div>

          {/* Program Structure */}
          <div>
            <h3 className="font-semibold text-sky-800 uppercase mb-2">
              Program Structure:
            </h3>
            <p className="text-sm mb-2">
              The program starts with a 6-month core phase focused on coding and
              design. Students who continue may join an extended track of up to
              18 months for advanced skills and deeper learning.
            </p>
            <p className="text-sm">
              Classes are held 2–3 times per week, either in-person or online.
              In-person classes take place in safe, women-only spaces with
              stable internet and full equipment. Each student receives close
              support from instructors and mentors and works toward completing a
              final project by the end of the program.
            </p>
          </div>

          {/* Join Section */}
          <div>
            <h3 className="font-semibold text-sky-800 uppercase mb-2">
              Join the Program:
            </h3>
            <p className="text-sm mb-4">
              If you live near one of our locations or have access to the
              internet, you can apply to become a student. Fill out the form
              carefully. Spaces are limited, and only selected applicants will
              be contacted.
            </p>
            <button className="bg-sky-800 shadow shadow-gray-400 text-white text-sm pl-5 pr-3 py-2 rounded-full flex items-center gap-2 hover:bg-blue-800 transition">
              Apply Now{" "}
              <span className="bg-white p-1 rounded-full ml-4 text-black">
                <FaArrowRight />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Voices from the Classroom section */}
      <section className="bg-light_gray mt-10">
        <div className=" max-w-screen-2xl mx-auto lg:p-20 md:p-16 px-2 py-10 rounded-lg my-8">
          <div className="flex items-center mx-auto justify-center gap-2 w-40 rounded-2xl bg-primary-50 bg-opacity-15 p-2">
            <Icon icon="dot" height={8} width={10} />
            <span className="text-xs text-primary-50 font-semibold">
              {projects?.sectionTitleStudents}
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl my-2 lg:text-4xl 2xl:text-5xl text-center py-2 font-semibold">
            “Voices from the Classroom”
          </h3>
          <p className="text-paragraph_color text-center text-sm md:text-base">
            {projects?.sectionDescriptionStudents}
          </p>
          {projects?.voices && <ParticipantsInfo Voices={projects.voices} />}
        </div>
      </section>

      {/* The journey to code */}
      <section className="max-w-screen-2xl px-4 mx-auto mt-5">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 md:py-20">
          {/* Left Section: Text Content */}
          <div className="w-full md:w-1/2">
            <div className="border-l-8 rounded-lg border-primary-800 pl-4 mb-8">
              <h1 className="text-3xl font-bold">The Journey Code</h1>
              <p>From first click to code.</p>
            </div>
            <p className="text-gray-600 mb-4 text-sm md:text-base lg:text-lg">
              This short video shows how our classes work, from the classrooms
              and equipment to the way students learn step by step. It’s a look
              at what coding education really looks like for girls in
              Afghanistan today.
              <p className="mt-2">
                Visit our YouTube channel to follow our latest updates and
                projects from around the world.
              </p>
            </p>
          </div>

          {/* Right Section: Video Embed */}
          <div className="relative w-full md:w-[45%]">
            <iframe
              src="https://www.youtube.com/embed/FLL63GwTaFQ"
              allowFullScreen
              className="rounded-2xl shadow-lg sm:w-[90%] w-full h-[200px] md:h-[300px] lg:h-[400px]"
            ></iframe>
            {/* Caption Overlay with Small Primary Background */}
            <div className="absolute md:-bottom-6 -bottom-3 -z-10 md:right-4 -right-3 bg-primary-100 px-3 py-1 text-sm text-white h-32 w-32 rounded-2xl"></div>
          </div>
        </div>
      </section>

      {/* What we offer section */}
      <section className="max-w-screen-2xl px-4 mx-auto  py-12">
        <div className="mt-5">
          <h2 className="text-3xl font-bold mb-8 text-center">
            What We Offer?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {projects?.offerIcons.map((offer, index) => (
              <div
                key={index}
                className="rounded-xl p-6 shadow bg-slate-50 hover:shadow-lg transition duration-300"
              >
                <Image src={offer?.url?offer?.url:""} width={500} height={500} alt="offer icon" className="size-16 rounded-xl" />
                <h3 className="text-xl font-semibold mb-2 line-clamp-1">
                  {offer?.iconTitle || ""}
                </h3>
                <p className="text-gray-600 mb-4">{offer?.shortDescription || ""}</p>
                <a
                  href="#"
                  className="text-blue-500 font-semibold hover:underline"
                >
                  Learn More
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Meet Section */}
       <section className="max-w-screen-2xl px-4 mx-auto mt-10">
        <div className="py-10 text-center">
          <div className="flex items-center mx-auto justify-center gap-2 w-28 rounded-full bg-primary-50 bg-opacity-15 p-2 mb-6">
            <Icon icon="dot" height={8} width={10} />
            <span className=" text-primary-50 font-semibold">Team</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-semibold mb-4">
            Meet Our Team Members and Volunteers
          </h2>
          <p className="mb-8 max-w-3xl mx-auto text-base md:text-lg text-gray-600">
            For security and privacy reasons, some of our team members and
            volunteers are not listed here. In some cases, nicknames or symbolic
            photos are used to protect their identity.
          </p>
          <div className="flex flex-col md:flex-row justify-center md:space-x-6 mt-8 gap-6">
            {loading || !projects ? (
              <p>Loading...</p>
            ) : (
              projects?.teamCards?.length ?(
              projects?.teamCards?.map((member: TeamCard, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg md:w-1/3 relative md:h-[500px] overflow-hidden group"
                >
                {/* Image container */}
                <div className="relative z-0">
                  <Image
                    src={member?.image ||  "/default-avatar.jpg"}
                    alt={member?.name || "Team member"}
                    className="rounded-t-lg h-80 md:h-96 group-hover:ease-in-out md:group-hover:h-[500px] object-cover  transition-all duration-700 ease-in-out"
                  />
                  <div className="border-t-8 border-sky-800  group-hover:hidden transition duration-150"></div>
                  <div className="group-hover:py-0 py-6 group-hover:hidden transition duration-150">
                    <h3 className="text-xl font-semibold">{member?.name}</h3>
                    <p className="text-gray-600 mb-2">{member?.role}</p>
                  </div>
                  {/* Overlay details */}
                  <div
                    className="absolute inset-0 bg-white group-hover:ease-in-out bg-opacity-90 flex items-start justify-center p-4 
                    translate-y-full opacity-0 transition-opacity duration-500 group-hover:translate-y-0 group-hover:opacity-100 z-10"
                  >
                    <div className="text-center">
                      <div className="h-4 md:h-14 w-full bg-gray-900 absolute left-0 right-0 top-0"></div>
                      <div className="w-full border-4 md:border-8 border-t border-sky-800 absolute top-4 md:top-14 left-0 right-0 "></div>
                      <div className="mt-4 md:mt-20">
                        <h3 className="text-lg md:text-xl font-semibold">
                          {member.name}
                        </h3>
                        <p className="text-base md:text-base text-gray-600 mb-2">
                          {member?.role}
                        </p>
                        <p className="text-sm line-clamp-6 md:text-base text-blue-500 mb-2">
                          {member?.biography}
                        </p>
                        <Link
                          href="#"
                          className="cursor-pointer block mx-auto w-full mt-4 md:mt-20"
                        >
                          <FaLinkedinIn className="size-8 mx-auto bg-blue-600 text-white rounded" />
                          <img src={member?.icon || ""} alt="members icon" className="size-8 mx-auto bg-blue-600 text-white rounded" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))):
            <p>No team members round?</p>
          )}
          </div>
        </div>
      </section>

      {/* Students Meet Section */}
      <section className="max-w-screen-2xl px-4 mx-auto mt-10">
        <div className="py-10 text-center">
          <div className="flex items-center mx-auto justify-center gap-2 w-28 rounded-full bg-primary-50 bg-opacity-15 p-2 mb-6">
            <Icon icon="dot" height={8} width={10} />
            <span className=" text-primary-50 font-semibold">Students</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-semibold mb-4">
            Meet Our Student Ambassadors
          </h2>
          <p className="mb-8 max-w-3xl mx-auto text-base md:text-lg text-gray-600">
            To protect our students, some names and photos shown here have been
            changed or replaced with symbolic images. Others are used with
            permission. We always prioritize the safety and privacy of every
            participant.
          </p>
          <div className="flex flex-col md:flex-row justify-center md:space-x-6 mt-8 gap-6">
            {Students.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg md:w-1/3 relative md:h-[500px] overflow-hidden group"
              >
                {/* Image container */}
                <div className="relative z-0">
                  <Image
                    src={member.imgUrl}
                    alt={member.name}
                    className="rounded-t-lg h-80 md:h-96 group-hover:ease-in-out md:group-hover:h-[500px] object-cover  transition-all duration-700 ease-in-out"
                  />
                  <div className="border-t-8 border-sky-800  group-hover:hidden transition duration-150"></div>
                  <div className="group-hover:py-0 py-6 group-hover:hidden transition duration-150">
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-gray-600 mb-2">{member.course}</p>
                  </div>
                  {/* Overlay details */}
                  <div
                    className="absolute inset-0 bg-white group-hover:ease-in-out bg-opacity-90 flex items-start justify-center p-4 
                    translate-y-full opacity-0 transition-opacity duration-500 group-hover:translate-y-0 group-hover:opacity-100 z-10"
                  >
                    <div className="text-center">
                      <div className="h-4 md:h-14 w-full bg-gray-900 absolute left-0 right-0 top-0"></div>
                      <div className="w-full border-4 md:border-8 border-t border-sky-800 absolute top-4 md:top-14 left-0 right-0 "></div>
                      <div className="mt-4 md:mt-20">
                        <h3 className="text-lg md:text-xl font-semibold">
                          {member.name}
                        </h3>
                        <p className="text-base md:text-base text-gray-600 mb-2">
                          {member.course}
                        </p>
                        <p className="text-sm line-clamp-6 md:text-base text-blue-500 mb-2">
                          {member.description}
                        </p>
                        <Link
                          href="#"
                          className="cursor-pointer block mx-auto w-full mt-4 md:mt-20"
                        >
                          <FaLinkedinIn className="size-8 mx-auto bg-blue-600 text-white rounded" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Optional: a button or other content */}
              </div>
            ))}
          </div>
          <div className="flex space-x-4 justify-between cursor-pointer hover:opacity-80 w-40 mt-10 shadow transition duration-150 shadow-gray-400 active:shadow-none mx-auto bg-white rounded-full px-4 py-2">
            <button className="">Load More</button>
            <TfiReload className="text-black size-5" />
          </div>
        </div>
      </section>

      {/* Quotation section */}
      <section className="bg-blue-900 mt-10 lg:py-10">
        <div className=" max-w-screen-2xl px-4 mx-auto text-white py-6 md:p-16">
          <div className="flex space-x-3 md:space-x-12 items-center mb-4">
            <Image
              src={leftQute}
              alt="left quete"
              width={500}
              height={500}
              className="w-8 md:w-28 -translate-y-16"
            />
            <div>
              <p className="flex-1 text-xs md:text-lg text-gray-300">
                This program was never about building something big. It was
                about creating a safe, serious space for a few girls to keep
                learning when all doors were closing. We started small, and we
                still are, but it’s working, and that matters.
              </p>
              <p className="text-xs md:text-lg text-center text-gray-300 mt-4">
                - Reza Hussaini, Founder
              </p>
            </div>
            <Image
              src={rightQute}
              alt="left quete"
              width={500}
              height={500}
              className="w-8 md:w-28"
            />
          </div>
        </div>
      </section>

      {/* inside classroom section */}
      <section className="max-w-screen-2xl px-4 mx-auto mt-10">
        <div className="flex flex-col gap-10 ">
          <div className="flex flex-col gap-4 items-center justify-center max-w-screen-2xl mx-auto">
            <Header btnName="Photos" title="Inside the Classroom" />
            <p className="text-center text-sm md:text-base text-gray-600 md:max-w-2xl mx-auto">
              For safety reasons, we avoid publishing clear images of students’
              faces. Some photos may be blurred or cropped to protect their
              identity.
            </p>
            <div className="flex items-center justify-center sm:w-[360px] md:w-[90%] mx-auto">
              <Sliders data={educationSlideData} />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Archive Section */}
      <section className="max-w-screen-2xl px-4 mx-auto mt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center mx-auto justify-center gap-2 w-48 rounded-full bg-primary-50 bg-opacity-15 p-2 mb-6">
            <Icon icon="dot" height={8} width={10} />
            <span className=" text-primary-50 font-semibold">
              {" "}
              Newsletter Archive
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Our Monthly Newsletters Archive
          </h1>
          <p className="text-gray-600">
            Browse all past issues of our monthly newsletters. Each one shares
            updates, stories, and progress from inside the academy.
          </p>
        </div>

        {/* Newsletter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newsletters.map((newsletter, index) => (
            <div
              key={index}
              className="flex bg-light_gray rounded-lg shadow-md overflow-hidden p-4"
            >
              <Image
                src={whitePaper}
                alt="white page"
                width={500}
                height={500}
                className="size-28 md:size-40 lg:size-60 object-cover"
              />
              <div>
                {/* Date Tag */}
                <div className=" flex mt-4 space-x-2 items-center text-gray-700">
                  <CiCalendar className="size-6" />{" "}
                  <span>{newsletter.date}</span>
                </div>

                {/* Card Content */}
                <div className="pt-10">
                  <h2 className="text-lg font-bold mb-2">{newsletter.title}</h2>
                  <p className="text-gray-600 mb-4">{newsletter.description}</p>
                  <a
                    href={newsletter.link}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Download PDF
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Impact section */}
      <section className="bg-light_gray mt-10">
        <div className="max-w-screen-2xl px-4 mx-auto py-10">
          <h3 className="text-4xl font-semibold mt-5 mb-10">Impact</h3>

          {/* card and slider */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* slider section */}
            <div className="col-span-2">
              <div className="grid col-span-1">
                <div className="w-full">
                  <div className="relative overflow-hidden rounded-xl shadow-lg z-20">
                    {/* Full Gradient Overlay */}
                    <div className="absolute h-80  md:h-[440px] lg:h-[450px] xl:h-[530px] 2xl:xl:h-[555px] inset-0 bg-gradient-to-t from-primary-50 via-transparent to-transparent opacity-90 z-30 rounded-xl"></div>

                    <div
                      className="relative h-80 md:h-[440px] lg:h-[450px] xl:h-[530px] 2xl:xl:h-[555px] overflow-hidden"
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      {slides.map((slide, index) => (
                        <div
                          key={index}
                          className={cn(
                            "absolute top-0 left-0 w-full h-80 md:h-[440px] lg:h-[450px] xl:h-[530px] 2xl:xl:h-[555px] transition-opacity duration-500 ease-in-out",
                            {
                              "opacity-100 z-0": index === activeIndex,
                              "opacity-0 z-0": index !== activeIndex,
                            }
                          )}
                        >
                          {/* Dark Overlay */}
                          <div className="absolute inset-0 bg-black opacity-40 z-10"></div>

                          {/* Image */}
                          <Image
                            src={
                              isMobile && slide.mobileImage
                                ? slide.mobileImage
                                : slide.image
                            }
                            alt={`Slide ${index + 1}`}
                            fill
                            className="w-full h-80 md:h-[440px] lg:h-[450px] xl:h-[530px] 2xl:xl:h-[555px] object-cover"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Centered Pagination Dots */}
                    <div className="absolute bottom-10 right-10 transform z-40 flex space-x-2 items-center justify-center">
                      {slides.map((_, index) => (
                        <span
                          key={index}
                          onClick={() => setActiveIndex(index)}
                          className={cn(
                            "rounded-full transition-colors cursor-pointer",
                            index === activeIndex
                              ? "bg-white size-3"
                              : "bg-gray-400 size-2"
                          )}
                        />
                      ))}
                    </div>

                    {/* profile */}
                    <div className=" absolute left-4 md:left-10 bottom-20 z-50">
                      <div className="flex space-x-5 items-center">
                        <Image
                          src={profile}
                          alt="profile image"
                          width={50}
                          height={50}
                          className="rounded-full size-14"
                        />
                        <div>
                          <h3 className="text-sm md:text-base text-gray-300">
                            Reza Ahmadi
                          </h3>
                          <h3 className="text-base md:text-lg md:font-semibold text-slate-100">
                            An Article About Afghanistan And It’s Future
                          </h3>
                          <p className="text-sm text-gray-300">
                            0 hours 3 minutes
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* card */}
            <div className="col-span-1">
              <div className="bg-white rounded-2xl shadow-md">
                <Image
                  src={news1}
                  alt="card image"
                  width={500}
                  height={500}
                  className="rounded-t-xl "
                />
                <div className="p-4 space-y-2">
                  <h3 className="w-full text-2xl font-semibold">
                    Two Students Accepted to Remote Global Tech Scholarships
                  </h3>
                  <p className="text-sm text-gray-500">
                    Our Young Leader in the way of success. This Happening
                    because of the soft change.
                  </p>
                  <span className="text-xs text-gray-500">05.06.2024</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-14">
            {/* first card */}
            <div className="bg-white rounded-2xl shadow-md">
              <Image
                src={news1}
                alt="card image"
                width={500}
                height={500}
                className="rounded-t-xl "
              />
              <div className="p-4 space-y-2">
                <h3 className="w-full text-2xl font-semibold">
                  Two Students Accepted to Remote Global Tech Scholarships
                </h3>
                <p className="text-sm text-gray-500">
                  Our Young Leader in the way of success. This Happening because
                  of the soft change.
                </p>
                <span className="text-xs text-gray-500">05.06.2024</span>
              </div>
            </div>

            {/* second card */}
            <div className="bg-white rounded-2xl shadow-md">
              <Image
                src={news1}
                alt="card image"
                width={500}
                height={500}
                className="rounded-t-xl "
              />
              <div className="p-4 space-y-2">
                <h3 className="w-full text-2xl font-semibold">
                  Two Students Accepted to Remote Global Tech Scholarships
                </h3>
                <p className="text-sm text-gray-500">
                  Our Young Leader in the way of success. This Happening because
                  of the soft change.
                </p>
                <span className="text-xs text-gray-500">05.06.2024</span>
              </div>
            </div>

            {/* third card */}
            <div className="bg-white rounded-2xl shadow-md">
              <Image
                src={news1}
                alt="card image"
                width={500}
                height={500}
                className="rounded-t-xl "
              />
              <div className="p-4 space-y-2">
                <h3 className="w-full text-2xl font-semibold">
                  Two Students Accepted to Remote Global Tech Scholarships
                </h3>
                <p className="text-sm text-gray-500">
                  Our Young Leader in the way of success. This Happening because
                  of the soft change.
                </p>
                <span className="text-xs text-gray-500">05.06.2024</span>
              </div>
            </div>
          </div>

          {/* load more button */}
          <div className="flex space-x-4 justify-between cursor-pointer hover:opacity-80 w-40 mt-10 shadow transition duration-150 shadow-gray-400 active:shadow-none mx-auto bg-white rounded-full px-4 py-2">
            <button className="">Load More</button>
            <TfiReload className="text-black size-5" />
          </div>
        </div>
      </section>

      {/* live moments section */}
      <section className="bg-light_gray mt-10 py-10">
        <div className="max-w-screen-2xl px-4 mx-auto">
          <h3 className="text-4xl font-bold my-8">Live Moments: Follow Us</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center justify-center pb-5">
            <Image
              src={liveImage1}
              alt="liveImage1"
              width={500}
              height={500}
              className="rounded w-full h-[400px] md:h-[500px] lg:h-[700px] object-fill"
            />
            <Image
              src={liveImage2}
              alt="liveImage2"
              width={500}
              height={500}
              className="rounded w-full h-[400px] md:h-[500px] lg:h-[700px] object-fill"
            />
            <Image
              src={liveImage3}
              alt="liveImage3"
              width={500}
              height={500}
              className="rounded w-full h-[400px] md:h-[500px] lg:h-[700px] object-fill"
            />
          </div>
        </div>
      </section>

      {/* this program support section */}
      <section className="mt-20">
        <div className="max-w-screen-2xl px-4 mx-auto ">
          <h3 className="text-3xl font-bold text-slate-900">
            This Program Supports These Global Goals
          </h3>
          <p className="text-gray-500 my-2 max-w-2xl">
            By creating safe learning spaces and practical skills for Afghan
            girls, our program directly supports these United Nations
            Sustainable Development Goals (SDGs):
          </p>
          <div className="flex space-x-5 my-5">
            <Image
              src={icons1}
              alt="icons1"
              width={500}
              height={500}
              className="size-20"
            />
            <Image
              src={icons2}
              alt="icons2"
              width={500}
              height={500}
              className="size-20"
            />
            <Image
              src={icons3}
              alt="icons3"
              width={500}
              height={500}
              className="size-20"
            />
          </div>
        </div>
        <Image
          src={line}
          alt="line"
          width={500}
          height={500}
          className="w-full my-16"
        />

        <div className="space-y-14 mb-20 max-w-screen-2xl px-4 mx-auto">
          <div className="flex space-x-4">
            <span className="rounded-xl bg-light_gray p-2"><FaLink /></span>
          <h3>RelatedLinks</h3>
          </div>

          <div className="flex space-x-4">
            <Link href="#" className="bg-slate-400 rounded-full px-4 py-1 text-sky-700 border cursor-pointer border-blue-600 hover:opacity-90">About</Link>
            <Link href="#"  className="bg-slate-400 rounded-full px-4 py-1 text-sky-700 border cursor-pointer border-blue-600 hover:opacity-90">Programs</Link>
          </div>

          <h3 className="text-3xl md:text-5xl font-bold w-sm my-14 mx-auto text-center">Need a website? Let an Afghan girl build it. 👋</h3>

          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-4 lg:space-x-0 justify-between items-center bg-light_gray px-5 lg:px-10 py-14 ">
              <div className="bg-slate-400 p-4 rounded-full">
                <TbMessagePause className="size-7 text-sky-800" />
              </div>
              <h4 className="text-lg md:font-bold text-slate-700 w-sm">Stay updated! Subscribe to receive the latest news, events, and impact stories from our work.</h4>
              <div className="flex md:w-96 rounded-lg bg-white relative">
                <input type="text" placeholder="Enter Your Email Address" className="py-2 border-none bg-transparent rounded-lg w-full !focus:outline-none !focus:border-none focus:ring-0 px-4 " />
                <div className="bg-blue-900 p-3 rounded-lg absolute right-0 -top-0.5  cursor-pointer hover:opacity-80"><FaArrowRightLong className="text-white size-5" /></div>
              </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Programs;
