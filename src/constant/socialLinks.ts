import type { IconType } from "react-icons";
import { FaFacebookF, FaTelegram } from "react-icons/fa6";

export const SOCIAL_ICON_SRC = {
  linkedin: "/icons/linkedin-header.svg",
  x: "/icons/x-header.svg",
  youtube: "/icons/youtube-header.svg",
  instagram: "/icons/instagram-header.svg",
} as const;

export type BrandedSocialPlatform = keyof typeof SOCIAL_ICON_SRC;

export type SocialLinkItem = {
  href: string;
  label: string;
  src?: string;
  Icon?: IconType;
};

export const socialLinks: SocialLinkItem[] = [
  {
    href: "https://www.linkedin.com/company/cmw-world/",
    label: "LinkedIn",
    src: SOCIAL_ICON_SRC.linkedin,
  },
  {
    href: "https://www.x.com/cmw_world",
    label: "X",
    src: SOCIAL_ICON_SRC.x,
  },
  {
    href: "https://youtube.com/@cmw_world",
    label: "YouTube",
    src: SOCIAL_ICON_SRC.youtube,
  },
  {
    href: "https://www.instagram.com/cmw.world",
    label: "Instagram",
    src: SOCIAL_ICON_SRC.instagram,
  },
];

export const FOOTER_SOCIAL_LINKS: SocialLinkItem[] = [
  {
    href: "https://www.facebook.com/cmw.world",
    label: "Facebook",
    Icon: FaFacebookF,
  },
  {
    href: "https://www.x.com/cmw_world",
    label: "X",
    src: SOCIAL_ICON_SRC.x,
  },
  {
    href: "https://youtube.com/@cmw_world",
    label: "YouTube",
    src: SOCIAL_ICON_SRC.youtube,
  },
  {
    href: "https://www.instagram.com/cmw.world",
    label: "Instagram",
    src: SOCIAL_ICON_SRC.instagram,
  },
  {
    href: "https://t.me/cmworld_org",
    label: "Telegram",
    Icon: FaTelegram,
  },
  {
    href: "https://www.linkedin.com/company/cmw-world/",
    label: "LinkedIn",
    src: SOCIAL_ICON_SRC.linkedin,
  },
];

export type SocialLink = (typeof socialLinks)[number];

export function getBrandedSocialIconSrc(platform: BrandedSocialPlatform) {
  return SOCIAL_ICON_SRC[platform];
}
