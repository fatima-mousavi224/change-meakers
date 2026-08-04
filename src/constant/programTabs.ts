import { GraduationCap, Megaphone, Users, type LucideIcon } from "lucide-react";

export type ProgramCategoryId =
  | "youth-empowerment"
  | "girls-education"
  | "advocacy";

export type ProgramSection = {
  title: string;
  paragraphs: readonly string[];
};

export type ProgramCategory = {
  id: ProgramCategoryId;
  label: string;
  href: string;
  icon: LucideIcon;
  purpose: ProgramSection;
  activities: ProgramSection;
};

export const PROGRAM_CATEGORIES: ProgramCategory[] = [
  {
    id: "youth-empowerment",
    label: "Youth Empowerment",
    href: "/current-programs",
    icon: Users,
    purpose: {
      title: "Purpose",
      paragraphs: [
        "Change Makers of the World believes that young people have an important role in shaping positive change in their communities and in the future of Afghanistan. With more than two thirds of the country's population made up of youth, investing in their development is essential.",
        "Our Youth Empowerment Programs are designed to support high school and university students with the skills, confidence, and opportunities needed to succeed in their education, careers, and civic engagement. Particular attention is given to young women and those facing additional barriers after recent developments in Afghanistan.",
        "The programs aim to strengthen leadership, encourage cooperation and exchange among young people, and help participants identify challenges in their communities and respond through practical local initiatives. The knowledge and experience gained through these programs can also support success in multicultural academic and professional environments.",
      ],
    },
    activities: {
      title: "Activities",
      paragraphs: [
        "CMW delivers youth empowerment activities both in person in Afghanistan, mainly in Kabul and Herat, and online through digital platforms to reach wider communities.",
        "Activities include workshops, seminars, discussion forums, mentoring sessions, and collaborative initiatives where participants exchange ideas and learn from educators, professionals, mentors, and international speakers.",
        "Through these programs, participants build communication skills, confidence, teamwork, and active engagement. They also gain access to educational resources, leadership opportunities, and guidance for future pathways in education, employment, and community service.",
        "Many of these activities are implemented in cooperation with local organizations in Afghanistan and international partner institutions.",
      ],
    },
  },
  {
    id: "girls-education",
    label: "Girls' Education",
    href: "/girls-education",
    icon: GraduationCap,
    purpose: {
      title: "Purpose",
      paragraphs: [
        "Change Makers of the World works to support Afghan girls' access to learning at a time when formal schooling remains restricted for many. Education programs form the core of our activities and are designed to help girls continue learning through structured, capacity-based approaches tailored to local conditions.",
        "Our Girls' Education initiatives focus on creating safe learning environments, providing instructional support, and sharing educational resources that help students maintain continuity in their studies. Particular attention is given to girls who face additional barriers related to location, cost, and access to materials.",
        "These programs aim to strengthen academic confidence, support skill development, and help participants prepare for future educational and professional pathways through both in-person and online learning opportunities.",
      ],
    },
    activities: {
      title: "Activities",
      paragraphs: [
        "CMW supports girls' education through in-person learning spaces in Afghanistan, including community-based programs in Kabul and Herat, as well as online instruction in school subjects and preparatory courses.",
        "Activities include structured classes, recorded lessons, supplementary learning materials, scholarship information sharing, and coordination of locally implemented education initiatives.",
        "Through these programs, participants gain access to learning resources, mentorship, and guidance that support self-paced study and continued educational progress.",
        "Many of these activities are implemented in cooperation with local educators, community organizations, and international partner institutions committed to supporting Afghan girls' education.",
      ],
    },
  },
  {
    id: "advocacy",
    label: "Advocacy",
    href: "/advocacy",
    icon: Megaphone,
    purpose: {
      title: "Purpose",
      paragraphs: [
        "Change Makers of the World engages in advocacy to raise awareness about education access and human rights issues affecting Afghan girls and youth. As a non-political and non-religious volunteer community, we support structured dialogue on rights, inclusion, and equal opportunity.",
        "Our Advocacy initiatives aim to amplify the voices of Afghan youth on public platforms, encourage international engagement on education and human rights, and document experiences that reflect the realities facing communities in Afghanistan.",
        "These efforts are designed to support informed public understanding, strengthen coordination with partners, and contribute to broader human rights efforts while operating within defined organizational scope and resource limits.",
      ],
    },
    activities: {
      title: "Activities",
      paragraphs: [
        "CMW participates in structured dialogue and coordination with partners regarding education access, human rights, and youth inclusion through meetings, public statements, and collaborative initiatives.",
        "Activities include storytelling and documentation that reflects lived experiences through written profiles and interviews, conducted with attention to safety, consent, and participant wellbeing.",
        "The organization also supports awareness efforts related to girls' education and human rights, including engagement with international forums, partner institutions, and public advocacy campaigns.",
        "Many of these activities are implemented in cooperation with local organizations in Afghanistan and international partner institutions committed to supporting education and human rights.",
      ],
    },
  },
];

export function getProgramCategory(id: ProgramCategoryId): ProgramCategory {
  const category = PROGRAM_CATEGORIES.find((item) => item.id === id);
  if (!category) {
    throw new Error(`Unknown program category: ${id}`);
  }
  return category;
}
