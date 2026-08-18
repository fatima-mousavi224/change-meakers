"use client";

import { useRouter } from "next/navigation";

import { isSafeInternalReturnPath } from "@/utilities/updateDetailHref";

type UpdateDetailBackButtonProps = {
  returnTo?: string | null;
  fallbackHref?: string;
};

export default function UpdateDetailBackButton({
  returnTo,
  fallbackHref = "/updates",
}: UpdateDetailBackButtonProps) {
  const router = useRouter();
  const safeReturnTo = isSafeInternalReturnPath(returnTo) ? returnTo! : null;

  const handleBack = () => {
    if (safeReturnTo) {
      router.push(safeReturnTo);
      return;
    }

    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center gap-2 font-plusJakartaSans text-[15px] font-medium text-white transition-opacity hover:opacity-80 sm:text-[16px]"
    >
      <span aria-hidden>←</span>
      <span>Back</span>
    </button>
  );
}
