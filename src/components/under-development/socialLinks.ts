import {
  Facebook,
  Instagrams,
  Telegrams,
  Twitter,
  Youtube,
} from "@/icons/Icons";

export const socialLinks = [
  {
    href: "https://www.x.com/cmw_world",
    icon: Twitter,
    label: "Twitter / X",
  },
  {
    href: "https://www.instagram.com/cmw.world",
    icon: Instagrams,
    label: "Instagram",
  },
  {
    href: "https://www.facebook.com/cmw.world",
    icon: Facebook,
    label: "Facebook",
  },
  {
    href: "https://t.me/cmworld_org",
    icon: Telegrams,
    label: "Telegram",
  },
  {
    href: "https://youtube.com/@cmw_world",
    icon: Youtube,
    label: "YouTube",
  },
] as const;
