
import type { OpportunityItem } from "@/constant/opportunities";
import { getOpportunityHref } from "@/constant/opportunities";
import { cn } from "@/utilities/cn";
import { CalendarIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

const FALLBACK_IMAGE = "/images/update-component-image.jpg";

type OpportunityCardProps = {
  opportunity: OpportunityItem;
  layout?: "horizontal" | "vertical";
};

function formatDeadline(deadline: string) {
  return new Date(deadline).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getDeadlineTone(deadline: string) {
  const daysUntilDeadline = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24),
  );

  if (daysUntilDeadline < 0) return "text-[#D92D20]";
  if (daysUntilDeadline <= 14) return "text-[#D92D20]";

  return "text-[#039855]";
}

function CategoryBadge({ label }: { label: string }) {
  return (
    <span
      className="
        inline-flex
        w-fit
        items-center
        rounded-[4px]
        bg-[#4B6BFB0D]
        px-[10px]
        py-[5px]
        font-plusJakartaSans
        text-[12px]
        font-medium
        leading-none
        text-[#134C83]
      "
    >
      {label}
    </span>
  );
}

function DeadlineRow({
  deadline,
  className,
}: {
  deadline: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-[6px] font-plusJakartaSans text-[12px] font-medium leading-none",
        getDeadlineTone(deadline),
        className,
      )}
    >
      <CalendarIcon
        className="size-[14px] shrink-0"
        strokeWidth={1.8}
        aria-hidden
      />

      <span>Deadline: {formatDeadline(deadline)}</span>
    </div>
  );
}

export default function OpportunityCard({
  opportunity,
  layout = "horizontal",
}: OpportunityCardProps) {
  const imageSrc = opportunity.image?.trim() || FALLBACK_IMAGE;
  const isRemoteImage = imageSrc.startsWith("http");

  /*
   * ============================================================
   * VERTICAL
   * ============================================================
   */

  if (layout === "vertical") {
    return (
      <Link
        href={getOpportunityHref(opportunity)}
        className="
          group
          block
          w-full
          overflow-hidden
          rounded-[16px]
          border
          border-[#EDEDED]
          bg-[#F9F9F9]
          transition-all
          duration-200
          hover:shadow-[0_4px_18px_rgba(0,0,0,0.06)]
        "
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[16px]">
          <Image
            src={imageSrc}
            alt={opportunity.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="100vw"
            unoptimized={isRemoteImage}
          />
        </div>

        <div className="flex flex-col gap-4 p-4">
          <div className="space-y-[7px]">
            <CategoryBadge label={opportunity.category} />

            <h3 className="line-clamp-2 font-plusJakartaSans text-[16px] font-semibold leading-[1.4] text-[#252525]">
              {opportunity.title}
            </h3>

            <p className="font-plusJakartaSans text-[13px] text-[#8A8A8A]">
              {opportunity.location}
            </p>
          </div>

          <DeadlineRow deadline={opportunity.deadline} />
        </div>
      </Link>
    );
  }

  /*
   * ============================================================
   * HORIZONTAL
   * ============================================================
   */

  return (
    <Link
      href={getOpportunityHref(opportunity)}
      className="
        group
        flex
        w-full
        min-h-[300px]
        overflow-hidden
        rounded-[16px]
        border
        border-[#EDEDED]
        bg-[#F9F9F9]
        p-[13px]
        transition-all
        duration-200
        hover:shadow-[0_4px_18px_rgba(0,0,0,0.06)]
      "
    >
      {/* IMAGE */}
      <div
        className="
          relative
          min-h-[272px]
          w-[43%]
          shrink-0
          overflow-hidden
          rounded-[10px]
        "
      >
        <Image
          src={imageSrc}
          alt={opportunity.title}
          fill
          className="
            object-cover
            transition-transform
            duration-300
            group-hover:scale-[1.02]
          "
          sizes="43vw"
          unoptimized={isRemoteImage}
        />
      </div>

      {/* CONTENT */}
      <div
        className="
          flex
          min-w-0
          flex-1
          flex-col
          justify-between
          gap-6
          py-[8px]
          pr-[8px]
          pl-[24px]
        "
      >
        <div className="min-w-0">
          {/* CATEGORY */}
          <CategoryBadge label={opportunity.category} />

          {/* TITLE */}
          <h3
            className="
              mt-[13px]
              line-clamp-3
              max-w-[620px]
              font-plusJakartaSans
              text-[20px]
              font-semibold
              leading-[1.45]
              text-[#252525]
            "
          >
            {opportunity.title}
          </h3>

          {/* LOCATION */}
          <p
            className="
              mt-[11px]
              font-plusJakartaSans
              text-[16px]
              font-normal
              text-[#8A8A8A]
            "
          >
            {opportunity.location}
          </p>
        </div>

        {/* DEADLINE */}
        <DeadlineRow
          deadline={opportunity.deadline}
          className="pb-[3px]"
        />
      </div>
    </Link>
  );
}