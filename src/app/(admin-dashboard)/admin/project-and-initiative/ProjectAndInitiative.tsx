"use client";
import React, { useState } from "react";
import { FaEyeSlash, FaEdit, FaTrash } from "react-icons/fa";
import image1 from "../../../../../public/images/home-page/hero-section/slide1.png";
import image2 from "../../../../../public/images/home-page/hero-section/slide2.png";
import image3 from "../../../../../public/images/home-page/hero-section/slide3.png";
import logo from "../../../../../public/images/logo.jpg";
import Image from "next/image";
import { IoIosArrowDown, IoIosSearch } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import Link from "next/link";

// const initialProjects = Array(8).fill(0).map((_, index) => ({
//   id: index,
//   title: `Project ${index + 1}`,
//   type: "Project type",
//   images: [image1, image2, image3],
// }));

const initialProjects = [
  {
    id: 1,
    title: "TaskHive",
    type: "Web Application",
    images: [image1, image2, image3]
  },
  {
    id: 2,
    title: "PortfoLink",
    type: "Personal Portfolio",
    images: [image1, image2, image3]
  },
  {
    id: 3,
    title: "NoteSphere",
    type: "Mobile App",
    images: [image1, image2, image3]
  },
  {
    id: 4,
    title: "EduTrack",
    type: "Learning Management System",
    images: [image1, image2, image3]
  },
  {
    id: 5,
    title: "ShopNest",
    type: "E-commerce Website",
    images: [image1, image2, image3]
  },
  {
    id: 6,
    title: "Evently",
    type: "Event Management Platform",
    images: [image1, image2, image3]
  },
  {
    id: 7,
    title: "DevConnect",
    type: "Social Network Platform",
    images: [image1, image2, image3]
  },
  {
    id: 8,
    title: "FinSight",
    type: "Finance Dashboard",
    images: [image1, image2, image3]
  },
  
];

function ProjectAndInitiative() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("All");

  const filteredProjects = initialProjects.filter((project) =>
    project.title.toLowerCase().includes(search.toLowerCase())
  );

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sort === "Newest") return b.id - a.id;
    if (sort === "Oldest") return a.id - b.id;
    return 0;
  });

  const handleDelete = (id: number) => {
    // In a real app, update state or make an API call
    console.log(`Delete project with id: ${id}`);
  };

  return (
    
    <div className="min-h-screen md:p-6">
      <div className="relative flex justify-center md:justify-end">
        <select className="bg-[#134C83] text-white px-4 py-2 rounded shadow-md flex items-center gap-2 w-36 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="Projects">Projects</option>
          <option value="Initiative">Initiative</option>
        </select>
        <IoIosArrowDown className="absolute right-3 top-3 text-white" />
      </div>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 justify-between items-center mb-6 pt-4 md:pt-10">
        <Link href={`/admin/project-and-initiative/new-project`} className="bg-gradient-to-r from-[#134C83] to-[#4497E8] text-white shadow-md hover:opacity-90 active:shadow-none px-4 py-2 rounded transition-colors duration-150">
          Create New Project
        </Link>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative pl-3 w-72 flex items-center bg-white rounded-md">
            <IoIosSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-none focus:outline-none focus:ring-0 rounded-md px-2 py-2 w-full"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-72 md:w-48 bg-white px-4 py-2 border-none rounded text-gray-700 focus:outline-none"
          >
            <option value="All">Sort by: All</option>
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {sortedProjects.map((project, index) => (
          <div key={project.id} className="bg-white relative rounded-lg shadow p-4 flex flex-col">
            <div className="relative">
              <button
                className={`hidden md:block absolute top-1/2 left-0 transform -translate-y-1/2 bg-white p-1 rounded-2xl shadow-md cursor-pointer z-10 prev-button-${index}`}
              >
                <MdOutlineNavigateBefore className="size-3" />
              </button>
              <button
                className={`hidden md:block absolute top-1/2 right-0 transform -translate-y-1/2 bg-white p-1 rounded-2xl shadow-md cursor-pointer z-10 next-button-${index}`}
              >
                <MdOutlineNavigateNext className="size-3" />
              </button>
              <Swiper
                loop={true}
                pagination={{ clickable: true }}
                mousewheel={true}
                keyboard={true}
                navigation={{
                  prevEl: `.prev-button-${index}`,
                  nextEl: `.next-button-${index}`,
                }}
                modules={[Navigation, Pagination]}
                className="mySwiper"
              >
                {project.images.map((img, i) => (
                  <SwiperSlide key={i}>
                      <Image
                        src={img}
                        alt={`${project.title} slide ${i + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </SwiperSlide>
                ))}
              </Swiper>

              <Image
                src={logo}
                alt={`${project.title} logo`}
                width={24}
                height={24}
                className="size-8 object-cover absolute top-2 right-2 z-50 p-1 rounded-full shadow"
              />
            </div>

            <div className="flex space-x-2 justify-center items-center absolute right-4 bottom-16 text-xs w-20 bg-sky-100 text-blue-700 px-2 py-1 rounded-full">
              <span className="w-2 h-2 bg-sky-700 rounded-full"></span>
              <Link href={`/admin/project-and-initiative/impact/${project.id}`}>Impact</Link>
            </div>

            <div className="flex justify-between items-center mt-8">
              <div className="mt-3">
                <h3 className="text-sm font-semibold">{project.title}</h3>
                <p className="text-gray-500 text-xs">{project.type}</p>
              </div>
              <div className="flex gap-3 text-lg text-gray-600">
                <Link href={`/programs/${project.id}`}>
                <FaEyeSlash
                  aria-label={`Hide ${project.title}`}
                  className="hover:text-blue-500 cursor-pointer size-4"
                />
                </Link>
                <Link href={`/admin/project-and-initiative/new-project`}>
                <FaEdit
                  aria-label={`Edit ${project.title}`}
                  className="hover:text-blue-500 cursor-pointer size-4"
                />
                </Link>
                <FaTrash
                  aria-label={`Delete ${project.title}`}
                  className="text-red-500 hover:text-red-600 cursor-pointer size-4"
                  onClick={() => handleDelete(project.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectAndInitiative;