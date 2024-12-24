import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Post } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchResultListProps {
  searchResults: Post[];
}

export default function SearchResultList({
  searchResults,
}: SearchResultListProps) {
  console.log(searchResults);
  const router = useRouter();

  return (
    <ul role="list" className="divide-y divide-gray-100 ">
      {searchResults.map((post) => (
        <li key={post.id} className="relative py-5">
          <div
            className="px-4 sm:px-6 lg:px-8 cursor-pointer"
            onClick={() => router.push(`/updates/${post.id}`)}
          >
            <div className="mx-auto flex max-w-sm justify-between gap-x-6 items-center">
              <div className="flex items-center min-w-0 gap-x-4">
                <Image
                  alt="post image"
                  src={post?.postImages[0]?.image}
                  className="h-12 w-12 flex-none rounded-full bg-gray-50 border border-gray-300"
                  width={48}
                  height={48}
                />
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    <Link href={`/updates/${post.id}`}>
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
      ))}
    </ul>
  );
}
