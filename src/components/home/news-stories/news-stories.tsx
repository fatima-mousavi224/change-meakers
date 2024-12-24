"use client";
import { Category, Post } from "@prisma/client";
import NewStoriesHeader from "./NewStoriesHeader";
import NewStoriesImage from "./NewStoriesImage";
import { useState } from "react";

interface NewsStoriesProps {
  posts: Post[];
  categories: Category[];
}

export default function NewsStories({ posts, categories }: NewsStoriesProps) {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);

  // function to handle category change and filter posts
  const handleCategoryChange = (category: Category) => {
    if (category.id === "Latest") {
      setFilteredPosts(posts); // Reset to all posts
    } else {
      const filteredPosts = posts.filter(
        (post) => post.categoryId === category.id
      );
      setFilteredPosts(filteredPosts.slice(0, 4));
    }
  };

  return (
    <div className="py-10">
      <h1 className="font-bold text-[40px] font-plusJakartaSans">
        News & Stories
      </h1>
      <p className="text-[12px] md:text-[18px] font-plusJakartaSans text-[#717171] w-full md:w-[75%]">
        Stay connected with Change Makers of the World's latest updates!
        Discover news, stories from the field, and insights in our press
        releases, leadership's updates, articles, and monthly newsletters.
      </p>

      <div className="my-10">
        <NewStoriesHeader
          categories={categories}
          onCategoryChange={handleCategoryChange}
        />
      </div>
      <div>
        <NewStoriesImage filteredPosts={filteredPosts} />
      </div>
    </div>
  );
}
