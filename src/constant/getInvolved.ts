import type { LucideIcon } from "lucide-react";
import { Handshake, HeartHandshake, UserRound } from "lucide-react";

export type GetInvolvedItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export const GET_INVOLVED_ITEMS: GetInvolvedItem[] = [
  {
    id: "join-programs",
    title: "Join Our Programs",
    description:
      "Students can register to receive information about classes, opportunities, and upcoming programs.",
    href: "/get-involved/join-our-programs",
    icon: UserRound,
  },
  {
    id: "partner",
    title: "Partner with Us",
    description:
      "We work with organizations and institutions to expand education and youth initiatives.",
    href: "/get-involved/partner-with-us",
    icon: Handshake,
  },
  {
    id: "volunteer",
    title: "Volunteer with Us",
    description:
      "Join our network of volunteers supporting programs, mentoring, and activities.",
    href: "/get-involved/volunteer-with-us",
    icon: HeartHandshake,
  },
];
