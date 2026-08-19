import { PhoneIcon } from "lucide-react";
import { DONATE_URL } from "@/constant/donate";

export const navigation = [
  {
    name: "Home",
    href: "/",
    icon: "/images/navbar/1.svg",
    current: true,
  },
  { name: "About", href: "/about", icon: "/images/navbar/2.svg" },
  {
    name: "Programs",
    href: "/programs",
    icon: "/images/navbar/2.svg",
  },
  { name: "Opportunities", href: "/opportunities", icon: "/images/navbar/3.svg" },
  {
    name: "Updates",
    href: "/updates",
    icon: "/images/navbar/4.svg",
  },
  {
    name: "Contact",
    href: "/contact",
    icon: "/images/navbar/5.svg",
  },
];

export const mobileNavigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Programs", href: "/programs" },
  { name: "Opportunities", href: "/opportunities" },
  { name: "Updates", href: "/updates" },
  { name: "Contact", href: "/contact" },
];

export const importantButtons = [
  { name: " Donate ", href: DONATE_URL, icon: PhoneIcon },
];

export const countryData = [
  { value: "usa", label: "United States of America" },
  { value: "pak", label: "Pakistan" },
  { value: "irn", label: "Iran" },
  { value: "aus", label: "Australia" },
  { value: "ind", label: "India" },
  { value: "chn", label: "China" },
  { value: "jpn", label: "Japan" },
  { value: "gbr", label: "United Kingdom" },
  { value: "fra", label: "France" },
  { value: "deu", label: "Germany" },
  { value: "ita", label: "Italy" },
  { value: "esp", label: "Spain" },
  { value: "can", label: "Canada" },
  { value: "bra", label: "Brazil" },
  { value: "rus", label: "Russia" },
  { value: "zaf", label: "South Africa" },
  { value: "mex", label: "Mexico" },
  { value: "arg", label: "Argentina" },
  { value: "sau", label: "Saudi Arabia" },
  { value: "tur", label: "Turkey" },
];
