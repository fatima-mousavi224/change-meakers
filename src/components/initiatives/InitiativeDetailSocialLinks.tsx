"use client";

import type { InitiativeSocialLink } from "@/constant/initiativeDetailsContent";
import { cn } from "@/utilities/cn";
import { FaTelegramPlane } from "react-icons/fa";
import {
  FaFacebookF,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import Link from "next/link";
import type { IconType } from "react-icons";

const SOCIAL_CONFIG: Record<
  InitiativeSocialLink["type"],
  { label: string; Icon: IconType; iconClassName?: string }
> = {
  website: { label: "Website", Icon: FaGlobe },
  facebook: { label: "Facebook", Icon: FaFacebookF },
  x: { label: "X", Icon: FaXTwitter },
  linkedin: { label: "LinkedIn", Icon: FaLinkedinIn },
  instagram: { label: "Instagram", Icon: FaInstagram },
  youtube: { label: "YouTube", Icon: FaYoutube },
  github: { label: "GitHub", Icon: FaGithub },
  telegram: {
    label: "Telegram",
    Icon: FaTelegramPlane,
    iconClassName: "size-[22px] sm:size-[28px] lg:size-[30px]",
  },
};

type InitiativeDetailSocialLinksProps = {
  links: InitiativeSocialLink[];
  className?: string;
};

export default function InitiativeDetailSocialLinks({
  links,
  className,
}: InitiativeDetailSocialLinksProps) {
  if (!links.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-[4px] border-[3px] border-[#F2F2F2] bg-[#FFFFFF] px-1.5 py-1.5 sm:gap-1.5 sm:px-2.5 sm:py-2",
        className,
      )}
    >
      {links.map((link, index) => {
        const { label, Icon, iconClassName } = SOCIAL_CONFIG[link.type];

        return (
          <Link
            key={`${link.type}-${link.href}`}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="group inline-flex animate-footer-social-in transition-transform duration-300 ease-out hover:-translate-y-1.5 active:translate-y-0"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <span className="flex size-[36px] items-center justify-center rounded-[4px] bg-transparent text-[#A1A1AA] transition-all duration-300 ease-out group-hover:bg-[#252525] group-hover:text-white group-active:scale-95 sm:size-[48px] lg:size-[51px]">
              <Icon
                className={cn(
                  "size-[17px] transition-all duration-300 ease-out sm:size-[22px]",
                  iconClassName,
                )}
                aria-hidden
              />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
