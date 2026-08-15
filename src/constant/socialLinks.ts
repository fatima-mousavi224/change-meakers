import {
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import type { IconType } from "react-icons";

export type SocialLink = {
  href: string;
  label: string;
  Icon: IconType;
};

export const socialLinks: SocialLink[] = [
  {
    href: "https://www.linkedin.com/company/cmw-world/",
    label: "LinkedIn",
    Icon: FaLinkedinIn,
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
];
