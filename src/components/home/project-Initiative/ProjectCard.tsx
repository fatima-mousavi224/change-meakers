import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ProjectCardProps {
  project: {
    id: string;
    projectTitle: string;
    uploadCardImage?: string;
    cardDescription?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

function ProjectCard({ project }: ProjectCardProps) {
  // Format the date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Ongoing";
    const date = new Date(dateString);
    const year = date.getFullYear();
    return `Duration: ${year} – Present`;
  };

  return (
    <div className="max-w-sm rounded-xl overflow-hidden shadow-lg relative group">
      <Image
        src={project.uploadCardImage || ""}
        alt={project.projectTitle}
        className="w-full h-80 object-cover"
        width={400}
        height={320}
      />
      <div className="absolute space-y-3 inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-center text-white px-4">
        <p className="text-xs mb-1 text-gray-200">
          {formatDate(project.createdAt)}
        </p>
        <h2 className="text-lg text-gray-200 mb-4">{project.projectTitle}</h2>
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <Link
            href={`/programs/${project.id}`}
            className="bg-transparent border border-gray-200  text-gray-300 text-xs font-medium px-4 py-2 rounded-md hover:bg-gray-200 hover:text-black transition"
          >
            Learn more
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
