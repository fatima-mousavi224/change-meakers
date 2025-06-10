'use client';
import React, { useState } from "react";
import ProjectCard from "./ProjectCard";
import { TfiReload } from "react-icons/tfi";
import projectImage1 from "../../../../public/images/programs/human_rights/slider_1.jpg";
import projectImage2 from "../../../../public/images/programs/human_rights/slider_2.jpg";
import projectImage3 from "../../../../public/images/programs/human_rights/slider_3.jpg";
import projectImage4 from "../../../../public/images/programs/human_rights/slider_4.jpg";
import projectImage5 from "../../../../public/images/programs/human_rights/slider_5.jpg";
import projectImage6 from "../../../../public/images/programs/human_rights/slider_6.jpg";
import projectImage7 from "../../../../public/images/programs/human_rights/slider_7.jpg";
import projectImage8 from "../../../../public/images/programs/human_rights/slider_8.jpg";


const projects = [
  {
    id: 1,
    title: "Project 1",
    image: projectImage1,
    projectDuration: "Duration: 2020 – 2026",
  },
  // Add more projects as needed
  { id: 2, title: "The United Nations Conference is happening in NY", image: projectImage2, projectDuration: "Duration: 2020 – 2026" },
  { id: 3, title: "The Human Rights Initiative", image: projectImage3, projectDuration: "Duration: 2020 – 2026" },
  { id: 4, title: "The Climate Change Initiative", image: projectImage4, projectDuration: "Duration: 2020 – 2026" },
  { id: 5, title: "The afghan girls coding program", image: projectImage5, projectDuration: "Duration: 2020 – 2026" },
  { id: 6, title: "The Girls in Tech Initiative", image: projectImage6, projectDuration: "Duration: 2020 – 2026" },
  { id: 7, title: "The Girls Who Code Initiative", image: projectImage7, projectDuration: "Duration: 2020 – 2026" },
  { id: 8, title: "The Women in STEM Initiative", image: projectImage8, projectDuration: "Duration: 2020 – 2026" },
];

function ProjectInitiatives() {
  // State to track number of visible projects
  const [visibleProjects, setVisibleProjects] = useState(4); // Start with 3 for mobile

  // Function to handle "Load More" click
  const handleLoadMore = () => {
    setVisibleProjects((prev) => prev + 4); // Load 3 more projects
  };

   // Function to handle "Less More" click
  const handleLoadLess = () => {
    setVisibleProjects((prev) => prev - 4); // Load 3 more projects
  };


  return (
    <div className="bg-light_gray">
      <div className="max-w-7xl mx-auto py-10 px-8">
        <h2 className="text-3xl mb-12 font-bold text-left">
          Projects & Initiatives
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.slice(0, visibleProjects).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        {visibleProjects < projects.length && (
          <div onClick={handleLoadMore} className="flex justify-between cursor-pointer hover:opacity-80 w-36 mt-10 shadow transition duration-150 shadow-gray-400 active:shadow-none mx-auto bg-white rounded-full px-4 py-2">
            <button>Load More</button>
            <TfiReload className="text-black size-5" />
          </div>
        )}

          {visibleProjects >= 8 && (
          <div onClick={handleLoadLess} className="flex justify-between cursor-pointer hover:opacity-80 w-32 mt-10 shadow transition duration-150 shadow-gray-400 active:shadow-none mx-auto bg-white rounded-full px-4 py-2">
            <button >See Less</button>
            <TfiReload className="text-black size-5" />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectInitiatives;
