

import type { GetInvolvedItem } from "@/constant/getInvolved";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type GetInvolvedCardProps = {
  item: GetInvolvedItem;
};

export default function GetInvolvedCard({ item }: GetInvolvedCardProps) {
  const Icon = item.icon;

  return (
    <article className="group flex h-full flex-col rounded-[16px] border border-[#E4E7EC] bg-white p-6 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-[#134C8329] hover:shadow-[0_8px_24px_rgba(19,76,131,0.1)]">
      <div className="flex size-12 items-center justify-center rounded-[12px] border border-transparent bg-[#134C8314] transition-colors duration-300 group-hover:border-[#134C833D] group-hover:bg-[#134C8329]">
        <Icon
          className="size-6 text-primary-50"
          strokeWidth={1.75}
          aria-hidden
        />
      </div>

      <h3 className="mt-5 font-plusJakartaSans text-[18px] font-bold leading-snug text-[#252525] sm:text-[20px]">
        {item.title}
      </h3>

      <p className="mt-3 flex-1 font-plusJakartaSans text-[14px] leading-[22px] text-paragraph_color sm:text-[15px] sm:leading-[24px]">
        {item.description}
      </p>

      <div className="mt-6 flex justify-start">
        <Link
          href={item.href}
          className="group/btn inline-flex w-fit items-center gap-2 rounded-xl border border-[#D0D5DD] px-5 py-2.5 font-plusJakartaSans text-[13px] font-medium text-black_color transition-colors duration-200 hover:border-primary-50 hover:bg-primary-50 hover:text-white sm:text-[14px]"
        >
          <span>Learn More</span>
          <ArrowRightIcon
            className="size-4 shrink-0 stroke-[2] text-[#252525] transition-all duration-200 group-hover/btn:translate-x-1 group-hover/btn:text-white"
            aria-hidden
          />
        </Link>
      </div>
    </article>
  );
}