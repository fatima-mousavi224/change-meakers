"use client";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTelegram,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { cn } from "@/utilities/cn";
import type { IconType } from "react-icons";
import Link from "next/link";

type FooterSocialLink = {
  href: string;
  label: string;
  Icon: IconType;
};

const FOOTER_SOCIAL_LINKS: FooterSocialLink[] = [
  {
    href: "https://www.facebook.com/cmw.world",
    label: "Facebook",
    Icon: FaFacebookF,
  },
  {
    href: "https://www.x.com/cmw_world",
    label: "X",
    Icon: FaXTwitter,
  },
  {
    href: "https://youtube.com/@cmw_world",
    label: "YouTube",
    Icon: FaYoutube,
  },
  {
    href: "https://www.instagram.com/cmw.world",
    label: "Instagram",
    Icon: FaInstagram,
  },
  {
    href: "https://t.me/cmworld_org",
    label: "Telegram",
    Icon: FaTelegram,
  },
  {
    href: "https://www.linkedin.com/company/cmw-world/",
    label: "LinkedIn",
    Icon: FaLinkedinIn,
  },
];

type FooterSocialLinksProps = {
  className?: string;
  compact?: boolean;
};

export default function FooterSocialLinks({
  className,
  compact = false,
}: FooterSocialLinksProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {FOOTER_SOCIAL_LINKS.map(({ href, label, Icon }, index) => (
        <Link
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="group inline-flex animate-footer-social-in transition-transform duration-300 ease-out hover:-translate-y-1.5 active:translate-y-0"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <span
            className={cn(
              "flex items-center justify-center rounded-full bg-[#252525] text-white shadow-sm transition-all duration-300 ease-out group-hover:scale-110 group-hover:bg-primary-50 group-hover:shadow-md group-active:scale-95",
              compact ? "size-6 md:size-9" : "size-9",
            )}
          >
            <Icon
              className={cn(
                "transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6",
                compact ? "size-[9px] md:size-[15px]" : "size-[15px]",
              )}
              aria-hidden
            />
          </span>
        </Link>
      ))}
    </div>
  );
}
