import Image from 'next/image'
import projectImage from "../../../../public/images/programs/human_rights/slider_2.jpg";
import React from 'react'

function ProjectCard() {
  return (
    <div className="max-w-sm rounded-xl overflow-hidden shadow-lg relative group">
          <Image
            src={projectImage}
            alt="Newspapers"
            className="w-full h-80 object-cover"
          />
          <div className="absolute space-y-3 inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-center text-white px-4">
            <p className="text-xs mb-1 text-gray-200">Duration: 2020 – 2026</p>
            <h2 className="text-lg text-gray-200 mb-4">
              The United Nations Conference is happening in NY
            </h2>
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              <button className="bg-transparent border border-gray-200  text-gray-300 text-xs font-medium px-4 py-2 rounded-md hover:bg-gray-200 hover:text-black transition">
                Learn more
              </button>
            </div>
          </div>
        </div>
  )
}

export default ProjectCard