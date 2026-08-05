"use client";

import {
  FaFacebookF,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

type OpportunityShareFooterProps = {
  title: string;
  sharePath: string;
  shareLabel?: string;
};

function buildShareLinks(title: string, sharePath: string) {
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${sharePath}`
      : sharePath;

  return [
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      Icon: FaFacebookF,
    },
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
      Icon: FaXTwitter,
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      Icon: FaLinkedinIn,
    },
  ];
}

export default function OpportunityShareFooter({
  title,
  sharePath,
  shareLabel = "Share the opportunity with others",
}: OpportunityShareFooterProps) {
  const shareLinks = buildShareLinks(title, sharePath);

  return (
    <div className="mt-12 border-t border-[#E4E7EC] pt-8 sm:mt-14 sm:pt-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-plusJakartaSans text-[12px] font-semibold uppercase tracking-[0.12em] text-[#094181] sm:text-[13px]">
          {shareLabel}
        </p>

        <div className="flex items-center gap-2">
          {shareLinks.map(({ label, href, Icon }, index) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="group inline-flex animate-footer-social-in transition-transform duration-300 ease-out hover:-translate-y-1.5 active:translate-y-0"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-primary-50 text-white shadow-sm transition-all duration-300 ease-out group-hover:scale-110 group-hover:bg-[#252525] group-hover:shadow-md group-active:scale-95">
                <Icon
                  className="size-[15px] transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6"
                  aria-hidden
                />
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
