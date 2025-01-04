"use client";
import { Category, Post } from "@prisma/client";
import React, { useState } from "react";
import UpdateCard from "./CardUpdate";
import Image from "next/image";

interface UpdateSectionProps {
  posts: Post[];
  categories: Category[];
}

const BlogPosts = ({ posts, categories }: UpdateSectionProps) => {
  const initialVisibleCount = 8; // Initial number of posts visible
  const incrementCount = 4; // Number of posts to add or remove

  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [visibleCount, setVisibleCount] = useState<number>(initialVisibleCount); // Start with 8 posts visible
  // Add the "All" category option
  const extendedCategories = [
    { id: "ALL", title: "All" }, // Add "All" as a custom category
    ...categories,
  ];


  // Separate categories into first five and remaining
  const visibleCategories = extendedCategories.slice(0, 5);
  const dropdownCategories = extendedCategories.slice(5);

  // Filter posts by category
  const filterPosts = (category: string) => {
    setActiveCategory(category);
    setVisibleCount(8); // Reset visible count when filtering
    if (category === "ALL") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post) => post.categoryId === category);
      setFilteredPosts(filtered);
    }
  };

  // Show more posts when "Load More" is clicked
  const loadMorePosts = () => {
    setVisibleCount((prevCount) => prevCount + 4);
  };

  // Show fewer posts when "Load Less" is clicked
  const loadLessPosts = () => {
    setVisibleCount((prevCount) =>
      prevCount - incrementCount > initialVisibleCount
        ? prevCount - incrementCount
        : initialVisibleCount
    );
  };

  return (
    <div className="px-4 py-8">
      {/* Filter Categories */}
      <div className="flex space-x-0 lg:space-x-4 mb-8">
        {dropdownCategories.length > 0 && (
          <select
            value={activeCategory}
            onChange={(e) => filterPosts(e.target.value)}
            className="border border-gray-300 rounded-lg px-2 py-2 text-[#BEBEBE] text-sm bg-white shadow-sm 
            outline-none focus:ring-2 focus:ring-primary-50 focus:border-transparent w-40 hidden lg:block"
          >
            <option value="" disabled>
              Other
            </option>
            {dropdownCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        )}
        <div className="overflow-x-auto  hidden lg:flex">
          {/* Render the first 5 categories as buttons */}
          {visibleCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => filterPosts(category.id)}
              className={`px-4 py-2 rounded-lg font-medium text-gray-400 ${
                activeCategory === category.id ? "bg-primary-50 text-white" : ""
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>
        <select
          className="border border-gray-300 rounded-lg w-full sm:w-80 px-2 py-2 text-[#BEBEBE] text-sm bg-white shadow-sm 
        outline-none focus:ring-2 focus:ring-primary-50 lg:hidden"
          onChange={(e) => filterPosts(e.target.value)}
        >
          {extendedCategories?.map((category, index) => (
            <option key={index} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>

      {/* Blog Posts */}
      {filteredPosts.length === 0 ? (
        <div className="flex justify-center w-full">
          <Image
            src="/images/nodata.png"
            alt="No Posts"
            width={900}
            height={900}
            className="self-center w-[40%] h-[40%]"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPosts.slice(0, visibleCount).map((post) => (
            <UpdateCard key={post.id} {...post} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filteredPosts.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMorePosts}
            className="px-4 py-2 border-2 border-gray-300 text-gray-400 rounded-md font-medium hover:bg-primary-50 cursor-pointer hover:text-white duration-100"
          >
            Load More
          </button>
        </div>
      )}
      {visibleCount > initialVisibleCount && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadLessPosts}
            className="px-4 py-2 border-2 border-gray-300 text-gray-400 rounded-md font-medium hover:bg-primary-50 cursor-pointer hover:text-white duration-100"
          >
            Load Less
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogPosts;
