import React from "react";
import ProjectCard from "./ProjectCard";
import { TfiReload } from "react-icons/tfi";

function ProjectInitiatives() {
  return (
    <div className="bg-gray-200">
      <div className="max-w-7xl mx-auto py-10 px-8">
        <h2 className="text-3xl mb-12  font-bold text-left">
          Projects & Initiatives
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProjectCard />
            <ProjectCard />
            <ProjectCard />
            <ProjectCard />
            <ProjectCard />
            <ProjectCard />           
        </div>
        <div className="flex space-x-4 justify-between cursor-pointer hover:opacity-80 w-40 mt-10 shadow transition duration-150 shadow-gray-400 active:shadow-none mx-auto bg-white rounded-full px-4 py-2">
            <button className="">Load More</button>
            <TfiReload className="text-black size-5" />
        </div>
      </div>
    </div>
  );
}

export default ProjectInitiatives;
