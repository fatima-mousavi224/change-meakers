"use client";

import NoDataMessage from "@/components/common/NoDataMessage";
import LatestUpdateCard, {
  type UpdatePost,
} from "@/components/home/latest-updates/LatestUpdateCard";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type LatestUpdatesProps = {
  posts: UpdatePost[];
};

export default function LatestUpdates({ posts }: LatestUpdatesProps) {
  const displayPosts = posts.slice(0, 3);

  if (!displayPosts.length) {
    return <NoDataMessage />;
  }

  return (
    <section className="py-8 lg:py-12 lg:px-[16px] px-4">
      <div className="mb-8 flex items-center gap-6 lg:mb-10">
        <h2 className="shrink-0 font-plusJakartaSans text-[22px] font-bold text-[#000000] sm:text-[34px] lg:text-[36px]">
          Latest Updates
        </h2>
        <div className="flex min-w-0 flex-1 items-center mt-2">
          <div className="h-px flex-1 bg-[#9E9E9E]" />

          <span className="mx-5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#9E9E9E] bg-white">
            <span className="h-3 w-3 rounded-full bg-[#9E9E9E]" />
          </span>

          <div className="h-px md:w-24 w-6 bg-[#9E9E9E]" />
        </div>
      </div>

      {/* Mobile: one row, 1 full card + half of next visible */}
      <div className="md:hidden w-full overflow-hidden">
        <div className="flex flex-nowrap gap-4 overflow-x-auto snap-x snap-mandatory px-4 -mx-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {displayPosts.map((post) => (
            <div
              key={post.id}
              data-update-slide
              className="w-[calc((100vw-2rem-1rem)/1.5)] max-w-[340px] shrink-0 snap-start"
            >
              <LatestUpdateCard post={post} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: three cards in one row (md and up) */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-5">
        {displayPosts.map((post) => (
          <LatestUpdateCard key={post.id} post={post} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          href="/updates"
          className="group inline-flex items-center gap-2 rounded-xl border border-[#D0D5DD] px-6 py-3 font-plusJakartaSans text-[14px] font-medium text-black_color transition-colors duration-200 hover:border-primary-50 hover:bg-primary-50 hover:text-white sm:text-[16px]"
        >
          <span>View all Updates</span>
          <ArrowRightIcon
            className="size-4 stroke-[2] transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden
          />
        </Link>
      </div>
    </section>
  );
}
