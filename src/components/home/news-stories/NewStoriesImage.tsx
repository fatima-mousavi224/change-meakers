import React from "react";
import layout from "public/images/home-page/layout.png";
import Image from "next/image";
import { CalenderIcon } from "@/components/icons/Icons";
import { Post } from "@prisma/client";
import moment from "moment";
import NoDataMessage from "@/components/common/NoDataMessage";
import Link from "next/link";

import { buildUpdateDetailHref } from "@/utilities/updateDetailHref";

interface NewStoriesImageProps {
  filteredPosts: Post[];
}

export default function NewStoriesImage({
  filteredPosts,
}: NewStoriesImageProps) {
  // No Posts State
  if (!filteredPosts || filteredPosts.length === 0) {
    return <NoDataMessage />;
  }

  return (
    <>
      <div className="flex lg:flex-row flex-col w-full gap-4">
        {/* Big image */}
        {filteredPosts[0] && (
          <div className="lg:w-[60%] w-full h-[528px] rounded-[20px] overflow-hidden relative">
            <Link
              href={buildUpdateDetailHref(
                { id: filteredPosts[0].id, shortId: filteredPosts[0].shortId },
                "/",
              )}
            >
              <Image
                src={filteredPosts[0]?.postImages[0]?.image || ""}
                alt="Big story"
                width={1200}
                height={1200}
                className="w-full h-full object-cover rounded-[20px]"
              />
              <Image
                src={layout.src}
                alt="Layout overlay"
                width={1200}
                height={1200}
                className="absolute inset-0 w-full h-full"
              />
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-2 bg-gradient-to-r from-[#15181E] to-transparent px-3 py-1.5 rounded-full w-fit">
                  <CalenderIcon />
                  <p className="text-sm font-medium text-white">
                    {moment(filteredPosts[0]?.postDate).format("DD.MM.YYYY")}
                  </p>
                </div>
                <h2 className="md:text-2xl text-sm font-bold">
                  {filteredPosts[0]?.title}
                </h2>
                <p
                  className="md:text-sm text-xs line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: filteredPosts[0]?.description,
                  }}
                />
              </div>
            </Link>
          </div>
        )}

        {/* Smaller images section */}
        <div className="lg:w-[40%] w-full flex flex-col gap-4">
          {/* Top smaller image */}
          {filteredPosts[1] && (
            <div className="w-full h-[272px] rounded-[20px] overflow-hidden relative">
              <Link
                href={buildUpdateDetailHref(
                  { id: filteredPosts[1].id, shortId: filteredPosts[1].shortId },
                  "/",
                )}
              >
                <Image
                  src={filteredPosts[1]?.postImages[0]?.image || ""}
                  alt="Small story"
                  width={1200}
                  height={1200}
                  className="w-full h-full object-cover rounded-[20px]"
                />
                <Image
                  src={layout.src}
                  alt="Layout overlay"
                  width={1200}
                  height={1200}
                  className="absolute inset-0 h-full w-full"
                />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-[#15181E] to-transparent px-3 py-1.5 rounded-full w-fit">
                    <CalenderIcon />
                    <p className="text-sm font-medium text-white">
                      {moment(filteredPosts[1]?.postDate).format("DD.MM.YYYY")}
                    </p>
                  </div>
                  <h3 className="text-lg font-bold">
                    {filteredPosts[1]?.title}
                  </h3>
                  <p
                    className="text-sm line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html: filteredPosts[1]?.description,
                    }}
                  />
                </div>
              </Link>
            </div>
          )}

          {/* Bottom smaller images */}
          <div className="w-full flex flex-wrap gap-4">
            {filteredPosts.slice(2, 4).map((post, index) => (
              <div
                key={index}
                className="w-[calc(50%-0.5rem)] h-[236px] rounded-[20px] overflow-hidden relative"
              >
                <Link
                  href={buildUpdateDetailHref(
                    { id: post.id, shortId: post.shortId },
                    "/",
                  )}
                >
                  <Image
                    src={post?.postImages[0]?.image || ""}
                    alt={`Small story ${index + 2}`}
                    width={1200}
                    height={1200}
                    className="w-full h-full object-cover rounded-[20px]"
                  />
                  <Image
                    src={layout.src}
                    alt="Layout overlay"
                    width={800}
                    height={800}
                    className="absolute inset-0 w-full h-full"
                  />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-[#15181E] to-transparent px-3 py-1.5 rounded-full w-fit">
                      <CalenderIcon />
                      <p className="text-sm font-medium text-white">
                        {moment(post?.postDate).format("DD.MM.YYYY")}
                      </p>
                    </div>
                    <h3 className="text-lg font-bold">{post?.title}</h3>
                    <p
                      className="text-sm line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: post?.description,
                      }}
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
