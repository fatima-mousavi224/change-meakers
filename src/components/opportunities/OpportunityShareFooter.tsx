"use client";

import SocialIconButton from "@/components/common/SocialIconButton";
import { SOCIAL_ICON_SRC } from "@/constant/socialLinks";
import { FaFacebookF } from "react-icons/fa6";

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
      src: SOCIAL_ICON_SRC.x,
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      src: SOCIAL_ICON_SRC.linkedin,
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
          {shareLinks.map(({ label, href, src, Icon }, index) => (
            <div
              key={label}
              className="inline-flex animate-footer-social-in transition-transform duration-300 ease-out hover:-translate-y-1.5 active:translate-y-0"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <SocialIconButton
                href={href}
                label={label}
                src={src}
                Icon={Icon}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
