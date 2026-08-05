"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect } from "react";

import type { ContentDetailModalContent } from "@/types/contentDetailModal";
import { cn } from "@/utilities/cn";

type ContentDetailModalProps = {
  open: boolean;
  onClose: () => void;
  content: ContentDetailModalContent | null;
  scrollToTopOnOpen?: boolean;
};

export default function ContentDetailModal({
  open,
  onClose,
  content,
  scrollToTopOnOpen = true,
}: ContentDetailModalProps) {
  useEffect(() => {
    if (open && scrollToTopOnOpen) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [open, scrollToTopOnOpen]);

  if (!content) {
    return null;
  }

  const isLargeImage = content.imageScale === "large";

  return (
    <Dialog open={open} onClose={onClose} className="relative z-[100]">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-[#000000A6] transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-h-full justify-center px-4 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:px-10 lg:pb-16 lg:pt-32">
          <DialogPanel
            transition
            className="relative w-full max-w-[920px] transform overflow-hidden rounded-[20px] bg-white px-6 py-8 text-left shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:px-10 sm:py-10 lg:px-14 lg:py-12 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 font-plusJakartaSans text-[15px] font-medium text-primary-50 transition-opacity hover:opacity-80 sm:text-[16px]"
            >
              <ArrowLeftIcon className="size-4 stroke-[2]" aria-hidden />
              <span>Back</span>
            </button>

            <h2 className="mt-5 text-center font-plusJakartaSans text-[24px] font-bold leading-tight text-[#000000] sm:mt-6 sm:text-[28px] lg:text-[32px]">
              {content.title}
            </h2>

            {content.image ? (
              <div
                className={cn(
                  "relative mx-auto mt-8 w-full max-w-[620px] sm:mt-10",
                  isLargeImage
                    ? "h-[220px] sm:h-[260px] lg:h-[280px]"
                    : "h-[200px] sm:h-[240px] lg:h-[260px]",
                )}
              >
                <Image
                  src={content.image}
                  alt={content.imageAlt ?? content.title}
                  fill
                  className={cn(
                    "object-contain object-center",
                    isLargeImage
                      ? "scale-[1.25] sm:scale-[1.3] lg:scale-[1.35]"
                      : "scale-[1.1] sm:scale-[1.12] lg:scale-[1.15]",
                  )}
                  sizes="(max-width: 1024px) 100vw, 620px"
                />
              </div>
            ) : null}

            <div className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">
              {content.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="font-plusJakartaSans text-[15px] leading-[28px] text-[#9E9E9E] sm:text-[16px] sm:leading-[30px] lg:text-[17px]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
