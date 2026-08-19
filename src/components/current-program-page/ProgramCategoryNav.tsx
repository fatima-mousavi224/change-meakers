import Link from "next/link";

import {
  PROGRAM_CATEGORIES,
  type ProgramCategoryId,
} from "@/constant/programTabs";
import { cn } from "@/utilities/cn";

type ProgramCategoryNavProps = {
  activeCategoryId: ProgramCategoryId;
};

export default function ProgramCategoryNav({
  activeCategoryId,
}: ProgramCategoryNavProps) {
  return (
    <nav
      aria-label="Program categories"
      className="grid grid-cols-3 gap-2 sm:gap-3 lg:w-[300px] lg:shrink-0 lg:grid-cols-1 lg:gap-4"
    >
      {PROGRAM_CATEGORIES.map((category) => {
        const Icon = category.icon;
        const isActive = category.id === activeCategoryId;

        return (
          <Link
            key={category.id}
            href={category.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "font-plusJakartaSans transition-colors duration-200",
              "flex flex-col items-center justify-center gap-2 rounded-[12px] border px-2 py-4 text-center sm:px-3 sm:py-5",
              "lg:flex-row lg:justify-start lg:gap-4 lg:px-5 lg:py-5 lg:text-left",
              isActive
                ? "border-[#252525] bg-[#252525] text-white"
                : "border-[#E5E7EB] bg-white text-[#252525] hover:border-[#D1D5DB]"
            )}
          >
            <Icon
              className="size-6 shrink-0 sm:size-7 lg:size-[26px]"
              strokeWidth={1.75}
              aria-hidden
            />
            <span className="text-[11px] font-medium leading-tight sm:text-[12px] lg:text-[16px] lg:leading-snug">
              {category.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
