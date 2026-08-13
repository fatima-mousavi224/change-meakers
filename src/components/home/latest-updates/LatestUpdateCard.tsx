"use client";

import type { Post } from "@/types/database";
import { ArrowRightIcon, CalendarIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export type UpdatePost = Post & {
  Category?: {
    title: string;
  } | null;
};

type LatestUpdateCardProps = {
  post: UpdatePost;
};

const FALLBACK_UPDATE_IMAGE = "/images/update-component-image.jpg";

function formatPostDate(date: Date | null | undefined) {
  const value = date ? new Date(date) : new Date();
  return value.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function resolvePostImage(post: UpdatePost) {
  const image =
    post.authorImage?.image?.trim() ||
    post.postImages?.[0]?.image?.trim();
  if (!image) return FALLBACK_UPDATE_IMAGE;
  return image;
}

export default function LatestUpdateCard({ post }: LatestUpdateCardProps) {
  const [imageSrc, setImageSrc] = useState(() => resolvePostImage(post));
  const categoryTitle = post.Category?.title ?? "Updates";
  const isRemoteImage =
    imageSrc.startsWith("http") || imageSrc.startsWith("/uploads/");

  useEffect(() => {
    setImageSrc(resolvePostImage(post));
  }, [post]);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white shadow-sm">
      <Link
        href={`/updates/${post.id}`}
        className="relative block h-[210px] w-full sm:h-[230px] lg:h-[250px]"
      >
        <Image
          src={imageSrc}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 75vw, 33vw"
          unoptimized={isRemoteImage}
          onError={() => setImageSrc(FALLBACK_UPDATE_IMAGE)}
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-paragraph_color">
            <CalendarIcon className="size-4 shrink-0" aria-hidden />
            <time
              dateTime={post.postDate?.toString()}
              className="font-plusJakartaSans text-[12px] sm:text-[13px]"
            >
              {formatPostDate(post.postDate)}
            </time>
          </div>

          <span className="shrink-0 rounded-full bg-secondary_color px-3 py-1 font-plusJakartaSans text-[11px] font-medium text-primary-50 sm:text-[12px]">
            {categoryTitle}
          </span>
        </div>

        <Link href={`/updates/${post.id}`} className="mt-4 block flex-1">
          <h3 className="font-plusJakartaSans text-[16px] font-bold leading-snug text-[#252525] line-clamp-3 sm:text-[18px]">
            {post.title}
          </h3>
        </Link>

        <Link
          href={`/updates/${post.id}`}
          className="group mt-4 inline-flex w-fit items-center gap-1.5 font-plusJakartaSans text-[13px] font-medium text-primary-50 sm:text-[14px]"
        >
          <span>Read More</span>
          <ArrowRightIcon
            className="size-4 stroke-[2] transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden
          />
        </Link>
      </div>
    </article>
  );
}
