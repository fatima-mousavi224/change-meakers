import { cn } from "@/utilities/cn";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type OpportunityPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function getVisiblePages(page: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (page <= 3) {
    return [1, 2, 3, "ellipsis", totalPages] as const;
  }

  if (page >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages] as const;
  }

  return [1, "ellipsis", page, "ellipsis", totalPages] as const;
}

export default function OpportunityPagination({
  page,
  totalPages,
  onPageChange,
}: OpportunityPaginationProps) {
  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <nav
      aria-label="Opportunities pagination"
      className="flex items-center justify-center gap-2"
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="flex size-9 items-center justify-center rounded-[8px] border border-[#D0D5DD] bg-white text-[#252525] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeftIcon className="size-4" />
      </button>

      {visiblePages.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="px-1 font-plusJakartaSans text-[14px] text-[#667085]"
          >
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-current={item === page ? "page" : undefined}
            onClick={() => onPageChange(item)}
            className={cn(
              "flex size-9 items-center justify-center rounded-[8px] font-plusJakartaSans text-[14px] font-medium transition-colors",
              item === page
                ? "bg-primary-50 text-white"
                : "border border-[#D0D5DD] bg-white text-[#252525] hover:border-primary-50",
            )}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="flex size-9 items-center justify-center rounded-[8px] border border-[#D0D5DD] bg-white text-[#252525] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRightIcon className="size-4" />
      </button>
    </nav>
  );
}
