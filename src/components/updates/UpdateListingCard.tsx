import type { UpdateListItem } from "@/constant/updatesListing";
import { cn } from "@/utilities/cn";
import { CalendarIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

const FALLBACK_IMAGE = "/images/update-component-image.jpg";

type UpdateListingCardProps = {
  update: UpdateListItem;
  layout?: "horizontal" | "vertical";
};

function formatPostDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function CategoryBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex w-fit items-center rounded-[4px] bg-[#4B6BFB0D] px-[10px] py-[5px] font-plusJakartaSans text-[12px] font-medium leading-none text-[#134C83]">
      {label}
    </span>
  );
}

function DateRow({ date, className }: { date: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-[6px] font-plusJakartaSans text-[12px] font-medium leading-none text-primary-50",
        className,
      )}
    >
      <CalendarIcon
        className="size-[14px] shrink-0"
        strokeWidth={1.8}
        aria-hidden
      />
      <span>{formatPostDate(date)}</span>
    </div>
  );
}

export default function UpdateListingCard({
  update,
  layout = "horizontal",
}: UpdateListingCardProps) {
  const imageSrc = update.image?.trim() || FALLBACK_IMAGE;
  const isRemoteImage = imageSrc.startsWith("http");

  if (layout === "vertical") {
    return (
      <Link
        href={`/updates/${update.id}`}
        className="group block w-full overflow-hidden rounded-[16px] border border-[#EDEDED] bg-[#F9F9F9] transition-all duration-200 hover:shadow-[0_4px_18px_rgba(0,0,0,0.06)]"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[16px]">
          <Image
            src={imageSrc}
            alt={update.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="100vw"
            unoptimized={isRemoteImage}
          />
        </div>

        <div className="flex flex-col gap-4 p-4">
          <div className="space-y-[7px]">
            <CategoryBadge label={update.category} />
            <h3 className="line-clamp-2 font-plusJakartaSans text-[16px] font-semibold leading-[1.4] text-[#252525]">
              {update.title}
            </h3>
            <p className="line-clamp-2 font-plusJakartaSans text-[13px] text-[#8A8A8A]">
              {update.excerpt}
            </p>
          </div>
          <DateRow date={update.postDate} />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/updates/${update.id}`}
      className="group flex w-full min-h-[300px] overflow-hidden rounded-[16px] border border-[#EDEDED] bg-[#F9F9F9] p-[13px] transition-all duration-200 hover:shadow-[0_4px_18px_rgba(0,0,0,0.06)]"
    >
      <div className="relative min-h-[272px] w-[43%] shrink-0 overflow-hidden rounded-[10px]">
        <Image
          src={imageSrc}
          alt={update.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="43vw"
          unoptimized={isRemoteImage}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-6 py-[8px] pl-[24px] pr-[8px]">
        <div className="min-w-0">
          <CategoryBadge label={update.category} />
          <h3 className="mt-[13px] line-clamp-3 max-w-[620px] font-plusJakartaSans text-[20px] font-semibold leading-[1.45] text-[#252525]">
            {update.title}
          </h3>
          <p className="mt-[11px] line-clamp-2 font-plusJakartaSans text-[16px] font-normal text-[#8A8A8A]">
            {update.excerpt}
          </p>
        </div>
        <DateRow date={update.postDate} className="pb-[3px]" />
      </div>
    </Link>
  );
}
