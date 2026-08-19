import Image from "next/image";
import { truncateText } from "../../utilities/truncateText";
import { Post } from "@prisma/client";
import Link from "next/link";
import { getUpdateDetailPath } from "@/utilities/updateDetailHref";

export default function UpdateCard({
  id,
  shortId,
  author,
  title,
  authorImage,
  description,
  postImages,
  postDate,
  //@ts-ignore
  Category,
  createdAt,
}: Post) {
  const formattedDate = new Date(postDate!).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  return (
    <Link
      href={getUpdateDetailPath({ id, shortId })}
      key={id}
      className="border border-gray-200 hover:bg-gray-100 rounded-lg p-4 cursor-pointer duration-100"
    >
      <Image
        src={postImages[0].image}
        alt="update card"
        width={378}
        height={500}
        className="w-full md:h-[300px] object-cover rounded-md"
      />
      <button className="py-1 px-4 text-primary-50 bg-primary-50 bg-opacity-10 rounded-md my-3">
        {Category.title}
      </button>

      <div className="space-y-4 ">
        <h2 className="text-lg font-semibold line-clamp-3">{title}</h2>
        <p className="text-sm leading-6 text-gray-400">
          <div
            dangerouslySetInnerHTML={{ __html: truncateText(description, 100) }}
          />
        </p>

        <div className="flex gap-2 flex-col-reverse">
          <div className="flex items-center gap-2 shrink-0">
            <Image
              src={authorImage?.image || ""}
              alt="author"
              width={30}
              height={30}
              className="rounded-full size-8 object-cover"
            />
            <span className="font-semibold text-[13px] text-gray-500">
              {author}
            </span>
          </div>

          <span className="font-semibold text-[13px] text-gray-400">
            {formattedDate}
          </span>
        </div>
      </div>
    </Link>
  );
}
