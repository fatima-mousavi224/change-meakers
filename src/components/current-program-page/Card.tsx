import React, { useState } from "react";
import { ArrowCircleDown, ArrowCircleUp } from "../icons/Icons";

type CardProps = {
  number: string;
  title: string;
  desc: string;
};

type CardData = {
  cardData: CardProps[];
};

export default function Card({ cardData }: CardData) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Toggle description expansion
  const toggleDescription = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:mt-10 mt-4 max-w-screen-2xl px-4 mx-auto">
      {cardData.map((item, index) => {
        const isExpanded = expandedIndex === index;

        return (
          <div
            key={index}
            className={`p-6 rounded-xl shadow-md bg-white space-y-4 relative transition-all duration-500 ${
              isExpanded ? "h-auto" : "h-fit"
            }`}
          >
            <h2 className="text-lg font-bold text-primary-100">
              {item.number}
            </h2>
            <h1 className="text-xl font-semibold text-black_color">
              {item.title}
            </h1>

            {/* Container for the description with animation */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isExpanded
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-24 opacity-75"
              }`}
            >
              <p className="text-paragraph_color">{item.desc}</p>
            </div>

            {/* Button and toggle */}
            <div
              className="flex items-center justify-between mt-4 cursor-pointer transition-all duration-500"
              onClick={() => toggleDescription(index)}
            >
              <p className="text-primary-100">
                {isExpanded ? "See Less" : "Learn More"}
              </p>
              <button className="text-primary-100">
                {isExpanded ? <ArrowCircleUp /> : <ArrowCircleDown />}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
