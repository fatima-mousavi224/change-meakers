"use client";

import { ReactNode, useState } from "react";
import CurrentProgramBanner from "./CurrentProgramBanner";
import EducationAccess from "./EducationAccess";
import HumanRights from "./HumanRights";
import HumanitarianSupport from "./HumanitarianSupport";

interface buttonContent {
  id: number;
  label: string;
  content: ReactNode;
}
export const buttonContents: buttonContent[] = [
  {
    id: 1,
    label: "Education Access",
    content: <EducationAccess />,
  },
  {
    id: 2,
    label: "Human Rights",
    content: <HumanRights />,
  },
  {
    id: 3,
    label: "Humanitarian Support",
    content: <HumanitarianSupport />,
  },
];
export default function CurrentProgram() {
  const [activeButton, setActiveButton] = useState(1);

  return (
    <div className="overflow-x-hidden mt-4">
      <div className=" px-4 max-w-screen-2xl mx-auto">
        <CurrentProgramBanner
          activeButton={activeButton}
          setActiveButton={setActiveButton}
        />
      </div>
      <div className="flex flex-col my-5 lg:my-20 sm:my-10 gap-8 items-center md:flex-row w-full justify-center">
        <div className="flex flex-col gap-10 md:gap-20 w-full">
          {buttonContents.find((button) => button.id === activeButton)?.content}
        </div>
      </div>
    </div>
  );
}
