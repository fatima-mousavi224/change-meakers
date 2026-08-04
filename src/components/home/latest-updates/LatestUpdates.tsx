"use client";

import NoDataMessage from "@/components/common/NoDataMessage";
import SectionHeading from "@/components/common/SectionHeading";
import LatestUpdateCard, {
  type UpdatePost,
} from "@/components/home/latest-updates/LatestUpdateCard";
import { cn } from "@/utilities/cn";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type LatestUpdatesProps = {
  posts: UpdatePost[];
  title?: string;
  viewAllText?: string;
  className?: string;
  viewAllClassName?: string;
};

export default function LatestUpdates({
  posts,
  title = "Latest Updates",
  viewAllText = "View all Updates",
  className,
  viewAllClassName,
}: LatestUpdatesProps) {
  const displayPosts = posts.slice(0, 3);

  if (!displayPosts.length) {
    return <NoDataMessage />;
  }

  return (
    <section className={cn("px-4 py-8 lg:px-[16px] lg:py-12", className)}>
      <SectionHeading title={title} />

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

      <div className={cn("mt-10 flex justify-center", viewAllClassName)}>
        <Link
          href="/updates"
          className="group inline-flex items-center gap-2 rounded-xl border border-[#D0D5DD] px-6 py-3 font-plusJakartaSans text-[14px] font-medium text-black_color transition-colors duration-200 hover:border-primary-50 hover:bg-primary-50 hover:text-white sm:text-[16px]"
        >
          <span>{viewAllText}</span>
          <ArrowRightIcon
            className="size-4 stroke-[2] transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden
          />
        </Link>
      </div>
    </section>
  );
}
