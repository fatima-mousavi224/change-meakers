import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTelegram,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import type { IconType } from "react-icons";

export type FooterSocialLink = {
  href: string;
  label: string;
  Icon: IconType;
};

export const FOOTER_SOCIAL_LINKS: FooterSocialLink[] = [
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
