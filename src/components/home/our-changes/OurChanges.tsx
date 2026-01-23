"use client";

import CountUp from "react-countup";
// Icons commented out for now — design should look good without them
// import {
//   PeopleIcon,
//   Presentasion,
//   Materails,
//   Documents,
// } from "../../icons/Icons";

const data = [
  {
    // icon: <PeopleIcon />,
    title: <CountUp end={10000} start={0} separator="," duration={2} />,
    description: "Individuals reached through education and advocacy programs",
  },
  {
    // icon: <Presentasion />,
    title: <CountUp end={2000} start={0} separator="," duration={2} />,
    description: "Educational materials provided to students",
  },
  {
    // icon: <Materails />,
    title: <CountUp end={50} start={0} separator="," duration={2} />,
    description: "Community-based initiatives implemented",
  },
  // {
  //   // icon: <Documents />,
  //   title: <CountUp end={60000} start={0} separator="," duration={2} />,
  //   description: "Individuals empowered through our Change eLibrary",
  // },
];

export default function Ourchanges() {
  return (
    <div>
      <div className="mx-auto sm:p-6 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 flex flex-col items-center text-center"
            >
              {/* Decorative top accent for each card (works without icons) */}
              <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary-300 via-primary-200 to-primary-400 mb-4" />

              <h2 className="font-extrabold text-2xl sm:text-3xl text-gray-900 flex items-baseline gap-1">
                {item.title}
                <span className="text-2xl">+</span>
              </h2>

              <p className="text-gray-500 sm:text-sm text-xs mt-2">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
