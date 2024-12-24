"use client";

import { Category } from "@prisma/client";
import { useState } from "react";

interface NewStoriesHeaderProps {
  categories: Category[];
  onCategoryChange?: (category: Category) => void; // Optional callback for parent
}

const NewStoriesHeader = ({
  categories,
  onCategoryChange,
}: NewStoriesHeaderProps) => {
  // Add "Latest" to the beginning of categories for internal use
  const extendedCategories: Category[] = [
    { id: "Latest", title: "Latest" } as Category,
    ...categories,
  ];

  const [selectedCategory, setSelectedCategory] = useState<Category>(
    extendedCategories[0]
  );

  // Categories for scrolling (5 items including "Latest")
  const scrollableCategories = extendedCategories.slice(0, 6);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  // Get the index of the current category in the scrollable list
  const currentIndex = scrollableCategories.findIndex(
    (category) => category.id === selectedCategory.id
  );

  // Handle left arrow click
  const handlePrev = () => {
    const prevIndex =
      (currentIndex - 1 + scrollableCategories.length) %
      scrollableCategories.length;
    handleCategorySelect(scrollableCategories[prevIndex]);
  };

  // Handle right arrow click
  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % scrollableCategories.length;
    handleCategorySelect(scrollableCategories[nextIndex]);
  };

  return (
    <div className="flex items-center space-x-3 w-full">
      {/* Dropdown for XL screens */}
      <select
        className="border border-gray-300 rounded-lg w-40 px-2 py-2 text-[#BEBEBE] text-sm bg-white shadow-sm 
          outline-none focus:ring-2 focus:ring-primary-50 hidden xl:block"
        onChange={(e) => {
          const selectedCategory = extendedCategories.find(
            (category) => category.id === e.target.value
          );
          if (selectedCategory) {
            handleCategorySelect(selectedCategory);
          }
        }}
      >
        {extendedCategories.slice(6, 9).map((category, index) => (
          <option key={index} value={category.id}>
            {category.title}
          </option>
        ))}
      </select>

      {/* Mobile and laptop select */}
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
          {scrollableCategories.map((category, index) => (
            <button
              key={index}
              onClick={() => handleCategorySelect(category)}
              className={`${
                selectedCategory.id === category.id
                  ? "bg-primary-50 text-white"
                  : "bg-transparent text-[#BEBEBE]"
              } px-1 py-2 rounded font-medium text-sm w-32 ml-1 transition hover:bg-primary-100 hover:text-white`}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>

      {/* Arrow Buttons */}
      <div className="hidden xl:flex relative top-2 right-0 transform -translate-y-1/3 space-x-2">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`text-primary-50 sm:h-[30px] w-[35px] h-[30px] bg-white rounded-xl shadow-lg text-lg ${
            currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          ❮
        </button>
        <button
          onClick={handleNext}
          className="text-primary-50 sm:h-[30px] w-[35px] h-[30px] bg-white rounded-xl shadow-lg text-lg"
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default NewStoriesHeader;
