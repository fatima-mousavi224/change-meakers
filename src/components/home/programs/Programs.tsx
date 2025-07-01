"use client";

import Image from "next/image";
import Link from "next/link";
import { TouchEvent, useEffect, useState } from "react";
// components/StatsCard.tsx
import Icon from "@/components/common/IconComponent";
import Subscribe from "@/components/contact-us/Subscribe";
import Header from "@/components/current-program-page/Header";
import ProgramsSliders from "@/components/home/programs/ProgramsSliders";
import ParticipantsInfo from "@/components/mission-and-impact/Participants/ParticipantsInfo";
import {
  HighlightedImpact,
  Impact,
  LiveMoment,
  NewsletterItem,
  OfferIcon,
  PhotoAlbum,
  Project,
  RelatedLink,
  StandardImpact,
  StatusAndIcon,
  StudentItem,
  TeamCard,
  Voice,
} from "@prisma/client";
import { CiCalendar } from "react-icons/ci";
import { FaLink, FaLinkedinIn } from "react-icons/fa6";
import { TfiReload } from "react-icons/tfi";
import { cn } from "utilities/cn";
import leftQute from "../../../../public/images/home-page/leftQuete.png";
import line from "../../../../public/images/home-page/line.png";
import news1 from "../../../../public/images/home-page/news-stories/news1.png";
import rightQute from "../../../../public/images/home-page/rightQuete.png";
import { RighArrow } from "../../icons/Icons";

// Extended type to include relations
type ProjectWithRelations = Project & {
  statusAndIcons: StatusAndIcon[];
  teamCards: TeamCard[];
  studentItems: StudentItem[];
  voices: Voice[];
  liveMoments: LiveMoment[];
  relatedLinks: RelatedLink[];
  newsletterItems: NewsletterItem[];
  photoAlbums: PhotoAlbum[];
  offerIcons: OfferIcon[];
};

type ImpactWithRelations = Impact & {
  highlightedImpacts: HighlightedImpact[];
  standardImpacts: StandardImpact[];
};
const Programs = ({
  project,
  impacts,
}: {
  project: ProjectWithRelations;
  impacts: ImpactWithRelations[];
}) => {


  // Get all standard impacts and highlighted impacts from all impact objects
  const allStandardImpacts =
    impacts?.flatMap((impact) => impact.standardImpacts || []) || [];
  const allHighlightedImpacts =
    impacts?.flatMap((impact) => impact.highlightedImpacts || []) || [];

  // Create a flat array of all images from all standard impacts
  const allImages = allStandardImpacts.flatMap(
    (impact) =>
      impact.galleryPhoto?.map((image, imageIndex) => ({
        image,
        impact,
        imageIndex,
        impactIndex: allStandardImpacts.indexOf(impact),
      })) || []
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [visionGoalActiveIndex, setVisionGoalActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [visionGoalTouchStart, setVisionGoalTouchStart] = useState<
    number | null
  >(null);
  const [visionGoalTouchEnd, setVisionGoalTouchEnd] = useState<number | null>(
    null
  );
  const [isMobile, setIsMobile] = useState(false);
  const [visibleStudents, setVisibleStudents] = useState(3); // Show 3 students initially
  const [visibleTeamCards, setVisibleTeamCards] = useState(3); // Show 3 highlighted impacts initially
  const [visibleHighlightedImpacts, setVisibleHighlightedImpacts] = useState(4); // Show 3 highlighted impacts initially

  // Get hero sections from project data
  const studentItems = project?.studentItems || [];

  // Function to load more students
  const loadMoreStudents = () => {
    setVisibleStudents(studentItems.length); // Load 3 more students
  };

  const loadLessStudents = () => {
    setVisibleStudents(3); // Load 3 less students
  };

  const loadMoreHighlightedImpact = () => {
    setVisibleHighlightedImpacts(allHighlightedImpacts.length); // Show all highlighted impacts
  };

  const loadLessHighlightedImpact = () => {
    setVisibleHighlightedImpacts(4); // Show only 4 highlighted impacts initially
  };

  const loadMoreTeamCards = () => {
    setVisibleTeamCards(project?.teamCards?.length || 0); // Show all team cards
  };

  const loadLessTeamCards = () => {
    setVisibleTeamCards(3); // Show only 3 team cards
  };

  // Filter out null/empty hero images
  const validHeroImages =
    project?.heroImage?.filter((img) => img && img.trim() !== "") || [];

  // Filter out null/empty vision/goal images
  const validVisionGoalImages = [
    project?.visionGoalImage1,
    project?.visionGoalImage2,
    project?.visionGoalImage3,
    project?.visionGoalImage4,
  ].filter((img) => img && img.trim() !== "");

  // Get visible students
  const visibleStudentItems = studentItems.slice(0, visibleStudents);
  const hasMoreStudents = visibleStudents < studentItems.length;

  // Get visible highlighted impacts
  const visibleHighlightedImpactsItems = allHighlightedImpacts.slice(
    0,
    visibleHighlightedImpacts
  );
  const hasMoreHighlightedImpacts =
    visibleHighlightedImpacts < allHighlightedImpacts.length;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (validHeroImages.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % validHeroImages.length);
      }, 5000); // 5 seconds per slide

      return () => clearInterval(interval);
    }
  }, [validHeroImages.length]);

  // Auto-slide for vision/goal slider
  useEffect(() => {
    if (validVisionGoalImages.length > 1) {
      const interval = setInterval(() => {
        setVisionGoalActiveIndex(
          (prevIndex) => (prevIndex + 1) % validVisionGoalImages.length
        );
      }, 4000); // 4 seconds per slide

      return () => clearInterval(interval);
    }
  }, [validVisionGoalImages.length]);

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
      setActiveIndex((prevIndex) => (prevIndex + 1) % validHeroImages.length);
    } else if (isRightSwipe) {
      setActiveIndex(
        (prevIndex) =>
          (prevIndex - 1 + validHeroImages.length) % validHeroImages.length
      );
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Vision/Goal slider touch handlers
  const handleVisionGoalTouchStart = (e: TouchEvent) => {
    setVisionGoalTouchStart(e.targetTouches[0].clientX);
  };

  const handleVisionGoalTouchMove = (e: TouchEvent) => {
    setVisionGoalTouchEnd(e.targetTouches[0].clientX);
  };

  const handleVisionGoalTouchEnd = () => {
    if (!visionGoalTouchStart || !visionGoalTouchEnd) return;
    const distance = visionGoalTouchStart - visionGoalTouchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setVisionGoalActiveIndex(
        (prevIndex) => (prevIndex + 1) % validVisionGoalImages.length
      );
    } else if (isRightSwipe) {
      setVisionGoalActiveIndex(
        (prevIndex) =>
          (prevIndex - 1 + validVisionGoalImages.length) %
          validVisionGoalImages.length
      );
    }

    setVisionGoalTouchStart(null);
    setVisionGoalTouchEnd(null);
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  const goToPrevious = () => {
    setActiveIndex(
      (prevIndex) =>
        (prevIndex - 1 + validHeroImages.length) % validHeroImages.length
    );
  };

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % validHeroImages.length);
  };

  // Vision/Goal slider functions
  const goToVisionGoalSlide = (index: number) => {
    setVisionGoalActiveIndex(index);
  };

  const goToVisionGoalPrevious = () => {
    setVisionGoalActiveIndex(
      (prevIndex) =>
        (prevIndex - 1 + validVisionGoalImages.length) %
        validVisionGoalImages.length
    );
  };

  const goToVisionGoalNext = () => {
    setVisionGoalActiveIndex(
      (prevIndex) => (prevIndex + 1) % validVisionGoalImages.length
    );
  };

  console.log("🚀 ~ project id:", project);
  console.log("🚀 ~ validHeroImages:", validHeroImages);
  console.log("🚀 ~ validVisionGoalImages:", validVisionGoalImages);
  console.log("🚀 ~ allHighlightedImpacts:", allHighlightedImpacts);
  console.log("🚀 ~ visibleHighlightedImpacts:", visibleHighlightedImpacts);
  console.log(
    "🚀 ~ visibleHighlightedImpactsItems:",
    visibleHighlightedImpactsItems
  );
  console.log("🚀 ~ hasMoreHighlightedImpacts:", hasMoreHighlightedImpacts);

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
              {validHeroImages.length > 0 ? (
                <Image
                  src={validHeroImages[activeIndex] ?? ""}
                  alt={validHeroImages[activeIndex] ?? ""}
                  fill
                  className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out opacity-100 z-0 rounded-[35px]"
                />
              ) : (
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-[35px] flex items-center justify-center">
                  <div className="text-center text-white">
                    <h2 className="text-4xl font-bold mb-4">
                      Welcome to Our Program
                    </h2>
                    <p className="text-xl">
                      Empowering girls through education and technology
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Overlay with Dynamic Text and Button */}
            <div className="absolute inset-0 z-20 bg-black bg-opacity-40 flex flex-col justify-end items-start sm:p-10 p-5 font-plusJakartaSans rounded-[35px]">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {project?.heroTitle || "Welcome to Our Program"}
              </h2>
              {project?.subheading && (
                <p className="text-sm md:text-lg text-white mb-1 font-bold font-plusJakartaSans">
                  {project?.subheading}
                </p>
              )}
              {project?.slogan && (
                <p className="text-[#F2F2F2] font-plusJakartaSans mb-3">
                  {project?.slogan}
                </p>
              )}
              {project?.buttonName && project?.buttonLink ? (
                <Link
                  href={project?.buttonLink || "/about"}
                  className="bg-white text-black_color text-md font-medium py-2 px-4 rounded-full hover:bg-gray-200 flex items-center text-center gap-2"
                >
                  <span>{project?.buttonName}</span>
                  <RighArrow />
                </Link>
              ) : (
                <Link
                  href="/about"
                  className="bg-white text-black_color text-md font-medium py-2 px-4 rounded-full hover:bg-gray-200 flex items-center text-center gap-2"
                >
                  <span>Learn More</span>
                  <RighArrow />
                </Link>
              )}
            </div>

            {/* Pagination Dots in Bottom Right Corner - Only show if multiple slides */}
            {validHeroImages.length > 1 && (
              <div className="absolute bottom-10 right-10 z-30 flex space-x-2 items-center">
                {validHeroImages.map((_, index) => (
                  <span
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`size-2 rounded-full transition-colors cursor-pointer ${
                      index === activeIndex ? "bg-white size-3" : "bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Prev and Next Buttons on Borders - Only show if multiple slides */}
            {validHeroImages.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute -left-5 top-1/2 shadow-2xl transform -translate-y-1/2 hover:bg-gradient-to-l hover:from-[#bebebe66] hover:to-[#FFFFFF00] bg-gradient-to-l from-[#FFFFFF66] to-[#FFFFFF00] text-xl text-primary-50 w-10 h-10 rounded-[14px] p-1 z-30 items-center justify-center sm:flex hidden"
                >
                  &#10094;
                </button>
                <button
                  onClick={goToNext}
                  className="absolute -right-5 top-1/2 transform shadow-2xl -translate-y-1/2 bg-gradient-to-r from-[#FFFFFF66] to-[#FFFFFF00] sm:flex hidden hover:bg-gradient-to-r hover:from-[#bebebe66] hover:to-[#FFFFFF00] text-xl text-blue-600 w-10 h-10 rounded-[14PX] p-1 z-30 items-center justify-center"
                >
                  &#10095;
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="bg-light_gray overflow-x-hidden md:bg-white max-w-screen-2xl mx-auto mt-10 px-6">
        <div className="bg-light_gray rounded-xl py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6  items-center">
          {project?.statusAndIcons?.slice(0, 4).map((statusIcon, index) => (
            <div
              key={index}
              className="flex md:px-10 space-x-3 items-center gap-2 sm:w-1/4"
            >
              <div className="bg-white rounded-xl p-8 shadow-sm relative">
                <Image
                  src={statusIcon.statusIcon ?? ""}
                  alt={statusIcon.iconTitle}
                  width={500}
                  height={500}
                  className="absolute top-2 left-3 size-10 "
                />
              </div>
              <div>
                <h3 className="text-base font-semibold">
                  {statusIcon.iconTitle}
                </h3>
                <p className="text-sm text-gray-500 w-40 md:w-56 line-clamp-2">
                  {statusIcon.shortDescription}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* our vission & our goal & slider section */}
      <section className="max-w-screen-2xl px-6 mx-auto mt-10 overflow-x-hidden">
        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-6  justify-center ">
          {/* goal and vission part */}
          <div className="grid col-span-1 gap-4">
            {/* our vission card */}
            <div className=" bg-light_gray rounded-xl shadow shadow-gray-400 py-4 px-5">
              <h3 className="text-2xl font-semibold">{project?.visionTitle}</h3>
              <p className="text-gray-500 my-8">{project?.visionText}</p>
            </div>

            {/* our gaol card */}
            <div className=" bg-light_gray rounded-xl shadow shadow-gray-400 py-4 px-5">
              <h3 className="text-2xl font-semibold">{project?.goalTitle}</h3>
              <p className="text-gray-500 my-8">{project?.goalText}</p>
            </div>
          </div>

          {/* slider section */}
          <div className="grid col-span-1">
            <div className="lg:w-full">
              <div className="relative overflow-hidden rounded-xl shadow-lg z-20">
                {/* Full Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-50 via-transparent to-transparent opacity-90 z-30 rounded-xl"></div>

                <div
                  className="relative sm:h-[75vh] h-[40vh] overflow-hidden"
                  onTouchStart={handleVisionGoalTouchStart}
                  onTouchMove={handleVisionGoalTouchMove}
                  onTouchEnd={handleVisionGoalTouchEnd}
                >
                  {validVisionGoalImages.length > 0 ? (
                    validVisionGoalImages.map((section, index) => (
                      <div
                        key={index}
                        className={cn(
                          "absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out",
                          {
                            "opacity-100 z-0": index === visionGoalActiveIndex,
                            "opacity-0 z-0": index !== visionGoalActiveIndex,
                          }
                        )}
                      >
                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-black opacity-40 z-10"></div>

                        {/* Image */}
                        <Image
                          src={section ?? ""}
                          alt={section ?? ""}
                          fill
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h2 className="text-2xl font-bold mb-4">
                          Vision & Goals
                        </h2>
                        <p className="text-lg">
                          Our vision and goals for the future
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Centered Pagination Dots */}
                {validVisionGoalImages.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40 flex space-x-2 items-center justify-center">
                    {validVisionGoalImages.map((_, index) => (
                      <span
                        key={index}
                        onClick={() => goToVisionGoalSlide(index)}
                        className={cn(
                          "rounded-full transition-colors cursor-pointer",
                          index === visionGoalActiveIndex
                            ? "bg-white size-3"
                            : "bg-gray-400 size-2"
                        )}
                      />
                    ))}
                  </div>
                )}
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
            {project?.sectionTitleAbout}
          </h2>

          {/* Intro Paragraph */}
          <p
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: project?.bodyText ?? "" }}
          />
          {/* Join Section */}
          <Link
            href={project?.buttonLink2 ?? ""}
            className="bg-sky-800 shadow shadow-gray-400 text-white text-sm pl-5 pr-3 py-2 rounded-full flex items-center gap-2 hover:bg-blue-800 transition w-fit"
          >
            {project?.buttonName2}
            <div className="w-5 h-5 flex items-center justify-center">
              <RighArrow />
            </div>
          </Link>
        </div>
      </section>

      {/* Voices from the Classroom section */}
      <section className="bg-light_gray mt-10">
        <div className=" max-w-screen-2xl mx-auto lg:p-20 md:p-16 px-2 py-10 rounded-lg my-8">
          <div className="flex items-center mx-auto justify-center gap-2 w-40 rounded-2xl bg-primary-50 bg-opacity-15 p-2">
            <Icon icon="dot" height={8} width={10} />
            <span className="text-xs text-primary-50 font-semibold">
              Our Students
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl my-2 lg:text-4xl 2xl:text-5xl text-center py-2 font-semibold">
            {project?.sectionTitleStudents}
          </h3>
          <p className="text-paragraph_color text-center text-sm md:text-base">
            {project?.sectionDescriptionStudents}
          </p>
          <ParticipantsInfo data={project?.voices ?? []} />
        </div>
      </section>

      {/* The journey to code */}
      <section className="max-w-screen-2xl px-4 mx-auto mt-5">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 md:py-20">
          {/* Left Section: Text Content */}
          <div className="w-full md:w-1/2">
            <div className="border-l-8 rounded-lg border-primary-800 pl-4 mb-8">
              <h1 className="text-3xl font-bold">{project?.heroTitleMedia}</h1>
              <p>{project?.shortDescriptionMedia}</p>
            </div>
            <p className="text-gray-600 mb-4 text-sm md:text-base lg:text-lg">
              {project?.fullVideoDescription ?? ""}
            </p>
          </div>

          {/* Right Section: Video Embed */}
          <div className="relative w-full md:w-[45%]">
            <iframe
              src={project?.videoLink ?? ""}
              allowFullScreen
              className="rounded-2xl shadow-lg sm:w-[90%] w-full h-[200px] md:h-[300px] lg:h-[400px]"
            ></iframe>
            {/* Caption Overlay with Small Primary Background */}
            <div className="absolute md:-bottom-6 -bottom-3 -z-10 md:right-4 -right-3 bg-primary-100 px-3 py-1 text-sm text-white h-32 w-32 rounded-2xl" />
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
            {project?.offerIcons?.map((offer: any, index: any) => (
              <div
                key={index}
                className="rounded-xl p-6 shadow border border-gray-200 hover:shadow-lg transition duration-300"
              >
                <div className="size-16 rounded-full bg-slate-200">
                  <Image
                    src={offer?.url ? offer?.url : ""}
                    width={500}
                    height={500}
                    alt="offer icon"
                    className="size-16 rounded-full p-2"
                  />
                </div>
                <h3 className="text-lg font-medium my-2 line-clamp-2">
                  {offer?.iconTitle || ""}
                </h3>
                <p className="text-gray-600 mb-4">
                  {offer?.shortDescription || ""}
                </p>
                <a href="#" className="text-blue-500 hover:underline">
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
            {project?.sectionTitleTeam}
          </h2>
          <p className="mb-8 max-w-3xl mx-auto text-base md:text-lg text-gray-600">
            {project?.sectionDescriptionTeam}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {project?.teamCards
              ?.slice(0, visibleTeamCards)
              .map((member: TeamCard) => (
                <div
                  key={member?.id}
                  className="bg-white rounded-lg shadow-lg relative md:h-[500px] overflow-hidden group"
                >
                  {/* Image container */}
                  <div className="relative z-0">
                    {member?.image ? (
                      <Image
                        src={member.image}
                        alt={member?.name ?? "Team member"}
                        width={400}
                        height={400}
                        className="rounded-t-lg w-full h-80 md:h-96 group-hover:ease-in-out md:group-hover:h-[500px] object-cover transition-all duration-700 ease-in-out"
                      />
                    ) : (
                      <div className="rounded-t-lg h-80 md:h-96 group-hover:ease-in-out md:group-hover:h-[500px] bg-gray-300 flex items-center justify-center">
                        <div className="text-gray-500 text-center">
                          <div className="text-6xl mb-2">👤</div>
                          <p className="text-sm">No Image</p>
                        </div>
                      </div>
                    )}
                    <div className="border-t-8 border-sky-800 group-hover:hidden transition duration-150"></div>
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
                          {member?.link && (
                            <Link
                              href={member.link}
                              className="cursor-pointer block mx-auto w-full mt-4 md:mt-20"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {member?.icon ? (
                                <Image
                                  src={member.icon}
                                  alt="member icon"
                                  width={32}
                                  height={32}
                                  className="size-8 mx-auto bg-blue-600 text-white rounded"
                                />
                              ) : (
                                <FaLinkedinIn className="size-8 mx-auto bg-blue-600 text-white rounded" />
                              )}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Load More/Less Button for Team Cards */}
          {project?.teamCards && project.teamCards.length > 3 && (
            <div className="flex space-x-4 justify-between cursor-pointer hover:opacity-80 w-40 mt-10 shadow transition duration-150 shadow-gray-400 active:shadow-none mx-auto bg-white rounded-full px-4 py-2">
              <button
                onClick={
                  visibleTeamCards === 3 ? loadMoreTeamCards : loadLessTeamCards
                }
                className="text-sm font-medium"
              >
                {visibleTeamCards === 3 ? "Load More" : "Load Less"}
              </button>
              <TfiReload className="text-black size-5" />
            </div>
          )}

          {/* Show total count info for team cards */}
          {project?.teamCards && project.teamCards.length > 0 && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Showing {Math.min(visibleTeamCards, project.teamCards.length)} of{" "}
              {project.teamCards.length} team members
            </div>
          )}
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
            {project?.sectionTitleStudents}
          </h2>
          <p className="mb-8 max-w-3xl mx-auto text-base md:text-lg text-gray-600">
            {project?.sectionDescriptionStudents}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {visibleStudentItems && visibleStudentItems.length > 0 ? (
              visibleStudentItems.slice(0, visibleStudents).map((member) => (
                <div
                  key={member?.id}
                  className="bg-white rounded-lg shadow-lg relative md:h-[500px] overflow-hidden group"
                >
                  {/* Image container */}
                  <div className="relative z-0">
                    {member?.image ? (
                      <Image
                        src={member.image}
                        alt={member?.name ?? "Student"}
                        width={400}
                        height={400}
                        className="rounded-t-lg w-full h-80 md:h-96 group-hover:ease-in-out md:group-hover:h-[500px] object-cover transition-all duration-700 ease-in-out"
                      />
                    ) : (
                      <div className="rounded-t-lg h-80 md:h-96 group-hover:ease-in-out md:group-hover:h-[500px] bg-gray-300 flex items-center justify-center">
                        <div className="text-gray-500 text-center">
                          <div className="text-6xl mb-2">👤</div>
                          <p className="text-sm">No Image</p>
                        </div>
                      </div>
                    )}
                    <div className="border-t-8 border-sky-800 group-hover:hidden transition duration-150"></div>
                    <div className="group-hover:py-0 py-6 group-hover:hidden transition duration-150">
                      <h3 className="text-xl font-semibold">
                        {member?.name ?? "Student Name"}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {member?.role ?? "Student Role"}
                      </p>
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
                            {member?.name ?? "Student Name"}
                          </h3>
                          <p className="text-base md:text-base text-gray-600 mb-2">
                            {member?.role ?? "Student Role"}
                          </p>
                          <p className="text-sm line-clamp-6 md:text-base text-blue-500 mb-2">
                            {member?.biography ??
                              "Student biography will appear here."}
                          </p>
                          {member?.link && (
                            <Link
                              href={member.link}
                              className="cursor-pointer block mx-auto w-full mt-4 md:mt-20"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {member?.icon ? (
                                <Image
                                  src={member.icon}
                                  alt="member icon"
                                  width={32}
                                  height={32}
                                  className="size-8 mx-auto bg-blue-600 text-white rounded"
                                />
                              ) : (
                                <FaLinkedinIn className="size-8 mx-auto bg-blue-600 text-white rounded" />
                              )}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">
                  No student items found. Please add some students to see them
                  here.
                </p>
              </div>
            )}
          </div>

          {/* Load More Button - Only show if there are more students to load */}
          {studentItems.length > 3 && (
            <div
              onClick={hasMoreStudents ? loadMoreStudents : loadLessStudents}
              className="flex space-x-4 justify-between cursor-pointer hover:opacity-80 w-40 mt-10 shadow transition duration-150 shadow-gray-400 active:shadow-none mx-auto bg-white rounded-full px-4 py-2"
            >
              <button className="text-sm font-medium">
                {hasMoreStudents ? "Load More" : "Load Less"}
              </button>
              <TfiReload className="text-black size-5" />
            </div>
          )}

          {/* Show total count info */}
          {studentItems.length > 0 && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Showing {visibleStudentItems.length} of {studentItems.length}{" "}
              students
            </div>
          )}
        </div>
      </section>

      {/* Quotation section */}
      <section className="bg-blue-900 mt-10 lg:py-10">
        <div className=" max-w-screen-2xl px-4 mx-auto flex justify-center text-white py-6 md:p-16">
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
                {project?.addQuote}
              </p>
              <p className="text-xs md:text-lg text-center text-gray-300 mt-4">
                - {project?.nameRole}
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
            <Header btnName="Photos" title={project?.sectionTitlePhoto ?? ""} />
            <p className="text-center text-sm md:text-base text-gray-600 md:max-w-2xl mx-auto">
              {project?.sectionDescriptionPhoto}
            </p>
            <div className="flex items-center justify-center sm:w-[360px] md:w-[90%] mx-auto">
              <ProgramsSliders data={project?.photoAlbums ?? []} />
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
            {project?.sectionTitleNewsletter}
          </h1>
          <p className="text-gray-600">
            {project?.sectionDescriptionNewsletter}
          </p>
        </div>

        {/* Newsletter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {project?.newsletterItems?.map((newsletter) => (
            <div
              key={newsletter?.id}
              className="flex bg-light_gray rounded-lg shadow-md overflow-hidden p-4 gap-5"
            >
              <Image
                src={newsletter.newsLetterImage ?? ""}
                alt="white page"
                width={500}
                height={500}
                className="size-28 md:size-40 lg:size-60 object-cover"
              />
              <div>
                {/* Date Tag */}
                <div className=" flex mt-4 space-x-2 items-center text-gray-700">
                  <CiCalendar className="size-6" />{" "}
                  <span>
                    {newsletter.date.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Card Content */}
                <div className="pt-10">
                  <h2 className="text-lg font-bold mb-2">{newsletter.title}</h2>
                  <p className="text-gray-600 mb-4">{newsletter.description}</p>
                  <a
                    href={newsletter.url ?? ""}
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
                    <div className="absolute h-80  md:h-[440px] lg:h-[450px] xl:h-[565px] inset-0 bg-gradient-to-t from-primary-50 via-transparent to-transparent opacity-90 z-30 rounded-xl"></div>

                    <div
                      className="relative h-80 md:h-[440px] lg:h-[450px] xl:h-[565px] overflow-hidden"
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      {allImages.map(({ image }, index) => (
                        <div
                          key={index}
                          className={cn(
                            "absolute top-0 left-0 w-full h-80 md:h-[440px] lg:h-[450px] xl:h-[565px] transition-opacity duration-500 ease-in-out",
                            {
                              "opacity-100 z-0": index === activeIndex,
                              "opacity-0 z-0": index !== activeIndex,
                            }
                          )}
                        >
                          {/* Dark Overlay */}
                          <div className="absolute inset-0 bg-black opacity-40 z-10"></div>

                          {/* Image */}
                          {image ? (
                            <Image
                              src={image || ""}
                              alt="Impact image"
                              width={500}
                              height={500}
                              className="w-full h-80 md:h-[440px] lg:h-[450px] xl:h-[530px] 2xl:xl:h-[600px] object-cover"
                            />
                          ) : (
                            <div className="w-full h-80 md:h-[440px] lg:h-[450px] xl:h-[530px] 2xl:xl:h-[555px] bg-gray-300 flex items-center justify-center">
                              <div className="text-gray-500 text-center">
                                <div className="text-6xl mb-2">📸</div>
                                <p className="text-sm">No Image</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Centered Pagination Dots */}
                    <div className="absolute bottom-10 right-10 transform z-40 flex space-x-2 items-center justify-center">
                      {allImages.map(({ image }, index) => (
                        <span
                          key={index}
                          onClick={() => goToSlide(index)}
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
                          src={
                            allImages[activeIndex]?.impact?.writerPhoto || ""
                          }
                          alt="profile image"
                          width={50}
                          height={50}
                          className="rounded-full size-14"
                        />
                        <div>
                          <h3 className="text-sm md:text-base text-gray-300">
                            {allImages[activeIndex]?.impact?.writersName}
                          </h3>
                          <h3 className="text-base md:text-lg md:font-semibold text-slate-100">
                            {allImages[activeIndex]?.impact?.title}
                          </h3>
                          <p className="text-sm text-gray-300">
                            {allImages[activeIndex]?.impact?.date &&
                              new Date(
                                allImages[activeIndex].impact.date
                              ).toLocaleDateString("en-US", {
                                month: "long",
                                year: "numeric",
                              })}
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
              {visibleHighlightedImpactsItems.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-md">
                  <Image
                    src={visibleHighlightedImpactsItems[0]?.coverPhoto || news1}
                    alt="card image"
                    width={500}
                    height={500}
                    className="rounded-t-xl "
                  />
                  <div className="p-4 space-y-2">
                    <h3 className="w-full text-2xl font-semibold">
                      {visibleHighlightedImpactsItems[0]?.title2}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {visibleHighlightedImpactsItems[0]?.contentDescription2}
                    </p>
                    <span className="text-xs text-gray-500">
                      {visibleHighlightedImpactsItems[0]?.date2 &&
                        new Date(
                          visibleHighlightedImpactsItems[0].date2
                        ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                  <div className="text-gray-500">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-xl font-semibold mb-2">
                      No Impact Data
                    </h3>
                    <p className="text-sm">
                      No highlighted impacts available at the moment.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional highlighted impacts grid */}
          {visibleHighlightedImpactsItems.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-14">
              {/* Map visible highlighted impacts starting from index 1 (second item) */}
              {visibleHighlightedImpactsItems
                .slice(1)
                .map((highlighted, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-md">
                    <Image
                      src={highlighted?.coverPhoto || news1}
                      alt="card image"
                      width={500}
                      height={500}
                      className="rounded-t-xl "
                    />
                    <div className="p-4 space-y-2">
                      <h3 className="w-full text-2xl font-semibold">
                        {highlighted?.title2}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {highlighted?.contentDescription2}
                      </p>
                      <span className="text-xs text-gray-500">
                        {highlighted?.date2 &&
                          new Date(highlighted.date2).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Load More/Less Button for Highlighted Impacts */}
          {allHighlightedImpacts.length > 4 && (
            <div
              onClick={
                hasMoreHighlightedImpacts
                  ? loadMoreHighlightedImpact
                  : loadLessHighlightedImpact
              }
              className="flex space-x-4 justify-between cursor-pointer hover:opacity-80 w-40 mt-10 shadow transition duration-150 shadow-gray-400 active:shadow-none mx-auto bg-white rounded-full px-4 py-2"
            >
              <button className="text-sm font-medium">
                {hasMoreHighlightedImpacts ? "Load More" : "Load Less"}
              </button>
              <TfiReload className="text-black size-5" />
            </div>
          )}

          {/* Show total count info for highlighted impacts */}
          {allHighlightedImpacts.length > 0 && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Showing{" "}
              {Math.min(
                visibleHighlightedImpacts,
                allHighlightedImpacts.length
              )}{" "}
              of {allHighlightedImpacts.length} highlighted impacts
            </div>
          )}
        </div>
      </section>

      {/* live moments section */}
      <section className="bg-light_gray mt-10 py-10">
        <div className="max-w-screen-2xl px-4 mx-auto">
          <h3 className="text-4xl font-bold my-8">Live Moments: Follow Us</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center justify-center pb-5">
            {project?.liveMoments?.map((moment) => (
              <Link href={moment?.link} key={moment?.id}>
                <Image
                  src={moment?.image || ""}
                  alt="live moment"
                  width={500}
                  height={500}
                  className="rounded w-full h-[400px] md:h-[500px] lg:h-[700px] object-fill"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* this program support section */}
      <section className="mt-20">
        <div className="max-w-screen-2xl px-4 mx-auto ">
          <h3 className="text-3xl font-bold text-slate-900">
            {project?.sectionTitleSDGs}
          </h3>
          <p className="text-gray-500 my-2 max-w-2xl">
            {project?.sectionTextSDGs}
          </p>
          <div className="flex space-x-5 my-5">
            {[
              project?.sdgsImage1,
              project?.sdgsImage2,
              project?.sdgsImage3,
              project?.sdgsImage4,
            ].map((icon, index) => (
              <Image
                src={icon || ""}
                alt="icons1"
                width={500}
                height={500}
                className="size-20"
              />
            ))}
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
            <span className="rounded-xl bg-light_gray p-2">
              <FaLink />
            </span>
            <h3>RelatedLinks</h3>
          </div>

          <div className="flex space-x-4">
            {project?.relatedLinks?.map((link) => (
              <Link
                href={link?.buttonLink}
                className="bg-slate-400 rounded-full px-4 py-1 text-sky-700 border cursor-pointer border-blue-600 hover:opacity-90"
              >
                {link?.buttonName}
              </Link>
            ))}
          </div>

          <h3 className="text-3xl md:text-5xl font-bold w-sm my-14 mx-auto text-center">
            Need a website? Let an Afghan girl build it. 👋
          </h3>

          {/* subscribe section */}
          <Subscribe />
        </div>
      </section>
    </div>
  );
};

export default Programs;
