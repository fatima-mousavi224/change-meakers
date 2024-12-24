"use client";

import { Category, Post } from "@prisma/client";
import { useState } from "react";

interface NewStoriesHeaderProps {
  categories: Category[];
  onCategoryChange?: (category: Category) => void; // Optional callback for parent
}

const NewStoriesHeader = ({
  categories,
  onCategoryChange,
}: NewStoriesHeaderProps) => {
  // Handle state internally
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    categories[0]
  );

  const extendedCategories: Category[] = [
    { id: "ALL", title: "All" } as Category, // Ensure "All" conforms to Category type
    ...categories,
  ];
  // Function to handle category selection
  const handleCategorySelect = (category: Category) => {
    console.log("Selected Category:", category);
    setSelectedCategory(category);

    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  // Function to handle left arrow click
  const currentIndex = categories.indexOf(selectedCategory);
  const handlePrev = () => {
    const prevIndex =
      (currentIndex - 1 + categories.length) % categories.length;
    handleCategorySelect(categories[prevIndex]);
  };

  // Function to handle right arrow click
  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % categories.length;
    handleCategorySelect(categories[nextIndex]);
  };

  return (
    <div className="flex items-center space-x-3 w-full">
      {/*  Dropdown */}
      <select
        className="border border-gray-300 rounded-lg w-40 px-2 py-2 text-[#BEBEBE] text-sm bg-white shadow-sm 
        outline-none focus:ring-2 focus:ring-primary-50 hidden xl:block"
        onChange={(e) => {
          const selectedCategory = categories.find(
            (category) => category.id === e.target.value
          );
          if (selectedCategory) {
            handleCategorySelect(selectedCategory);
          }
        }}
      >
        {categories?.slice(5, 8)?.map((category, index) => (
          <option key={index} value={category.id}>
            {category.title}
          </option>
        ))}
      </select>

      {/* mobile - laptop select */}
      <select
        className="border border-gray-300 rounded-lg w-full sm:w-80 px-2 py-2 text-[#BEBEBE] text-sm bg-white shadow-sm 
    outline-none focus:ring-2 focus:ring-primary-50 xl:hidden"
        onChange={(e) => {
          const selectedCategory = extendedCategories.find(
            (category) => category.id === e.target.value
          );
          if (selectedCategory) {
            handleCategorySelect(selectedCategory);
          }
        }}
      >
        {extendedCategories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.title}
          </option>
        ))}
      </select>

      {/* Swiper Slider */}
      <div className="w-[82%] h-11 pt-1 text-[#BEBEBE] overflow-x-auto hidden xl:block">
        <div className="flex w-2/3 justify-between">
          {extendedCategories?.slice(0, 6)?.map((category, index) => (
            <div key={index}>
              <button
                onClick={() => handleCategorySelect(category)}
                className={`${
                  selectedCategory === category
                    ? "bg-primary-50 text-white"
                    : "bg-transparent text-[#BEBEBE]"
                } px-1 py-2 rounded font-medium text-sm w-32 ml-1 transition hover:bg-primary-100 hover:text-white`}
              >
                {category.title}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden xl:flex relative top-2 right-0 transform -translate-y-1/3  space-x-2">
        <button
          disabled={currentIndex === 0}
          onClick={handlePrev}
          className={`text-primary-50 sm:h-[30px] w-[35px] h-[30px] bg-white/100 rounded-xl shadow-[0px_0px_5px_5px_#2222220D] text-lg ${
            currentIndex === 0 ? "opacity-50 cursor-pointer" : ""
          }`}
        >
          ❮
        </button>
        <button
          onClick={handleNext}
          className="text-primary-50 sm:h-[30px] w-[35px] h-[30px] bg-white/100 rounded-xl shadow-[0px_0px_5px_5px_#2222220D] text-lg"
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default NewStoriesHeader;
