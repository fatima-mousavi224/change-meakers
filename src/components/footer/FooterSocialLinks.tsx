"use client";

import { FOOTER_SOCIAL_LINKS } from "@/constant/footerSocialLinks";
import Link from "next/link";

export default function FooterSocialLinks() {
  return (
    <div className="flex flex-wrap items-center gap-2">
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
          <span className="flex size-9 items-center justify-center rounded-full bg-[#252525] text-white shadow-sm transition-all duration-300 ease-out group-hover:scale-110 group-hover:bg-primary-50 group-hover:shadow-md group-active:scale-95">
            <Icon
              className="size-[15px] transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6"
              aria-hidden
            />
          </span>
        </Link>
      ))}
    </div>
  );
}
