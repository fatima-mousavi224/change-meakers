"use client";
import React, { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import { TfiReload } from "react-icons/tfi";
import Link from "next/link";

interface Project {
  id: string;
  projectTitle: string;
  uploadCardImage?: string;
  cardDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

function ProjectInitiatives() {
  // State to track number of visible projects
  const [visibleProjects, setVisibleProjects] = useState(4); // Start with 4 for mobile
  const [projects, setProjects] = useState<Project[]>([]);
  console.log("🚀 ~ ProjectInitiatives ~ projects:", projects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects", { method: "GET" });
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        console.log("🚀 ~ fetchProjects ~ data:", data);
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Function to handle "Load More" click
  const handleLoadMore = () => {
    setVisibleProjects((prev) => prev + 4); // Load 4 more projects
  };

  // Function to handle "Less More" click
  const handleLoadLess = () => {
    setVisibleProjects((prev) => Math.max(4, prev - 4)); // Load 4 less projects, minimum 4
  };

  if (loading)
    return (
      <div className="bg-light_gray">
        <div className="max-w-7xl mx-auto py-10 px-8">
          <h2 className="text-3xl mb-12 font-bold text-left">
            Projects & Initiatives
          </h2>
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading projects...</p>
          </div>
        </div>
      </div>
    );

  if (!projects || projects.length === 0) {
    return (
      <div className="bg-light_gray">
        <div className="max-w-7xl mx-auto py-10 px-8">
          <h2 className="text-3xl mb-12 font-bold text-left">
            Projects & Initiatives
          </h2>
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">No projects available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light_gray">
      <div className="max-w-7xl mx-auto py-10 px-8">
        <h2 className="text-3xl mb-12 font-bold text-left">
          Projects & Initiatives
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.slice(0, visibleProjects).map((project) => (
            <div key={project.id}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
        {visibleProjects < projects.length && (
          <div
            onClick={handleLoadMore}
            className="flex justify-between cursor-pointer hover:opacity-80 w-36 mt-10 shadow transition duration-150 shadow-gray-400 active:shadow-none mx-auto bg-white rounded-full px-4 py-2"
          >
            <button>Load More</button>
            <TfiReload className="text-black size-5" />
          </div>
        )}

        {visibleProjects > 4 && (
          <div
            onClick={handleLoadLess}
            className="flex justify-between cursor-pointer hover:opacity-80 w-32 mt-10 shadow transition duration-150 shadow-gray-400 active:shadow-none mx-auto bg-white rounded-full px-4 py-2"
          >
            <button>See Less</button>
            <TfiReload className="text-black size-5" />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectInitiatives;
