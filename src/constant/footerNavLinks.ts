import { DONATE_URL } from "@/constant/donate";

export const FOOTER_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "Updates", href: "/updates" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_MOBILE_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Program", href: "/programs" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "Updates", href: "/updates" },
  { label: "Contact", href: "/contact" },
  { label: "Donate", href: DONATE_URL },
] as const;

export const FOOTER_COPYRIGHT_START_YEAR = 2020;
