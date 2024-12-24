"use client";

import CountUp from "react-countup";
import {
  PeopleIcon,
  Presentasion,
  Materails,
  Documents,
} from "../../icons/Icons";

const data = [
  {
    icon: <PeopleIcon />,
    title: <CountUp end={10000} start={0} />,
    description: "People Supported by Our Programs",
  },
  {
    icon: <Presentasion />,
    title: <CountUp end={186} start={0} />,
    description: "Initiatives Launched for Change",
  },
  {
    icon: <Materails />,
    title: <CountUp end={2000} start={0} />,
    description: "School Materials Provided to Students",
  },
  {
    icon: <Documents />,
    title: <CountUp end={60000} start={0} />,
    description: "Individuals Empowered through our Change eLibrary",
  },
];

export default function Ourchanges() {
  return (
    <div>
      <div className="bg-[#F2F2F2] rounded-xl sm:p-4 md:p-6">
        <div className="grid grid-cols-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="w-full lg:p-3 p-2 flex lg:flex-row flex-col gap-4 items-center"
            >
              <div className="bg-white sm:size-14 size-9 sm:p-4 p-2 rounded-xl shadow-lg flex justify-center items-center">
                {item.icon}
              </div>
              <div className="lg:w-2/3 lg:text-start text-center">
                <h2 className="sm:font-extrabold font-semibold sm:text-lg text-xs ">
                  {item.title}+
                </h2>
                <p className="text-[#BEBEBE] sm:text-base text-[10px]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
