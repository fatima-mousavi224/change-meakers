"use client";

import { cn } from "@/utilities/cn";

type ContactSubmitButtonProps = {
  loading: boolean;
  className?: string;
};

export default function ContactSubmitButton({
  loading,
  className,
}: ContactSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-[12px] bg-primary-50 px-10 py-3 font-plusJakartaSans text-[14px] font-medium text-white transition-all duration-200 ease-out hover:scale-[1.03] hover:bg-primary-100 active:scale-[0.97] active:bg-primary-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100",
        className,
      )}
    >
      {!loading ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />
      ) : null}
      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Submitting...
          </>
        ) : (
          "Submit"
        )}
      </span>
    </button>
  );
}
