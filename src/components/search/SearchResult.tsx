"use client";

import { ChevronRightIcon } from "@heroicons/react/20/solid";
import type { Post } from "@/types/database";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useUpdateDetailHref } from "@/hooks/useUpdateDetailHref";

interface SearchResultListProps {
  searchResults: Post[];
}

export default function SearchResultList({
  searchResults,
}: SearchResultListProps) {
  const router = useRouter();

  return (
    <ul role="list" className="divide-y divide-gray-100 ">
      {searchResults.map((post) => (
        <SearchResultItem key={post.id} post={post} router={router} />
      ))}
    </ul>
  );
}

function SearchResultItem({
  post,
  router,
}: {
  post: Post;
  router: ReturnType<typeof useRouter>;
}) {
  const detailHref = useUpdateDetailHref({
    id: post.id,
    shortId: post.shortId,
  });

  return (
    <li className="relative py-5">
      <div
        className="cursor-pointer px-4 sm:px-6 lg:px-8"
        onClick={() => router.push(detailHref)}
      >
        <div className="mx-auto flex max-w-sm items-center justify-between gap-x-6">
          <div className="flex min-w-0 items-center gap-x-4">
            <Image
              alt="post image"
              src={post?.postImages[0]?.image}
              className="h-12 w-12 flex-none rounded-full border border-gray-300 bg-gray-50"
              width={48}
              height={48}
            />
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                <Link href={detailHref}>
                  <span className="absolute inset-x-0 -top-px bottom-0" />
                  {post?.title}
                </Link>
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-4">
            <ChevronRightIcon
              aria-hidden="true"
              className="h-5 w-5 flex-none text-gray-400"
            />
          </div>
        </div>
      </div>
    </li>
  );
}
