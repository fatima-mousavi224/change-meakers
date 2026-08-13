"use client";

import NoDataMessage from "@/components/common/NoDataMessage";
import SectionHeading from "@/components/common/SectionHeading";
import LatestUpdateCard, {
  type UpdatePost,
} from "@/components/home/latest-updates/LatestUpdateCard";
import { cn } from "@/utilities/cn";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";

type LatestUpdatesProps = {
  posts: UpdatePost[];
  title?: string;
  viewAllText?: string;
  collapseText?: string;
  className?: string;
  viewAllClassName?: string;
  initialVisibleCount?: number;
  viewAllMode?: "link" | "expand";
};

export default function LatestUpdates({
  posts,
  title = "Latest Updates",
  viewAllText = "View all Updates",
  collapseText = "Show Less",
  className,
  viewAllClassName,
  initialVisibleCount = 3,
  viewAllMode = "link",
}: LatestUpdatesProps) {
  const [showAll, setShowAll] = useState(false);
  const [allPosts, setAllPosts] = useState(posts);

  useEffect(() => {
    setAllPosts(posts);
  }, [posts]);

  useEffect(() => {
    if (viewAllMode !== "expand") return;

    let cancelled = false;

    fetch("/api/post")
      .then((response) => response.json())
      .then((data: UpdatePost[]) => {
        if (cancelled || !Array.isArray(data)) return;

        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.postDate ?? 0).getTime() -
            new Date(a.postDate ?? 0).getTime(),
        );

        setAllPosts(sorted);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [viewAllMode]);

  const linkModeLimit = 3;
  const sourcePosts = viewAllMode === "expand" ? allPosts : posts;
  const displayPosts =
    viewAllMode === "link"
      ? sourcePosts.slice(0, linkModeLimit)
      : showAll
        ? sourcePosts
        : sourcePosts.slice(0, initialVisibleCount);

  const showExpandButton =
    viewAllMode === "expand" && sourcePosts.length > 0;

  if (!sourcePosts.length) {
    return <NoDataMessage />;
  }

  return (
    <section className={cn("py-8 lg:py-12", className)}>
      <SectionHeading title={title} />

      {/* Mobile: one row, 1 full card + half of next visible */}
      <div className="md:hidden w-full overflow-hidden">
        <div className="flex flex-nowrap gap-4 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {displayPosts.map((post) => (
            <div
              key={post.id}
              data-update-slide
              className="w-[calc((100%-1rem)/1.5)] max-w-[340px] shrink-0 snap-start"
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

      {(viewAllMode === "link" || showExpandButton) && (
        <div className={cn("mt-10 flex justify-center", viewAllClassName)}>
          {viewAllMode === "link" ? (
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
          ) : (
            <button
              type="button"
              onClick={() => setShowAll((current) => !current)}
              className="group inline-flex w-fit items-center gap-2 rounded-xl border border-[#D0D5DD] px-5 py-2.5 font-plusJakartaSans text-[13px] font-medium text-black_color transition-colors duration-200 hover:border-primary-50 hover:bg-primary-50 hover:text-white sm:text-[14px]"
            >
              <span>{showAll ? collapseText : viewAllText}</span>
              <ArrowRightIcon
                className={cn(
                  "size-4 stroke-[2] transition-transform duration-200",
                  showAll
                    ? "rotate-[-90deg] group-hover:-translate-y-1"
                    : "group-hover:translate-x-1",
                )}
                aria-hidden
              />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
