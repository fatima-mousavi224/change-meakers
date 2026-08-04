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
  heroImage: string;
  heroImagePosition?: string;
  purpose: ProgramSection;
  activities: ProgramSection;
};

export const PROGRAM_CATEGORIES: ProgramCategory[] = [
  {
    id: "youth-empowerment",
    label: "Youth Empowerment",
    href: "/current-programs",
    icon: Users,
    heroImage: "/images/program-hero-image.jpg",
    heroImagePosition: "center_28%",
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
    href: "/current-programs/girls-education",
    icon: GraduationCap,
    heroImage: "/images/girls-education-hero-image.jpg",
    heroImagePosition: "center center",
    purpose: {
      title: "Purpose",
      paragraphs: [
        "Change Makers of the World believes that girls' education is essential to the future of every society. When girls have access to learning, families, communities, and future generations benefit.",
        "Afghanistan remains the only country in the world where girls face severe restrictions on access to secondary and higher education. In this context, supporting continued learning opportunities for Afghan girls remains one of CMW's core priorities.",
        "Our Girls Education Programs aim to help Afghan girls continue learning through safe in-person initiatives inside Afghanistan and accessible online opportunities available to learners in different locations.",
      ],
    },
    activities: {
      title: "Activities",
      paragraphs: [
        "CMW supports in-person learning spaces in Kabul and Herat, including the Afghan Girls Tech Academy, where students can study together, exchange knowledge, and participate in educational activities in a supportive environment. These spaces also provide English language learning, digital skills training, and practical courses designed to help participants prepare for future employment opportunities in technology and related fields.",
        "In addition, CMW offers a wide range of online educational programs for Afghan girls. These include foreign language courses such as English, German, and Italian, as well as computer and technology training, introductory coding, AI-focused sessions, academic writing, CV preparation, and personal development workshops. Programs are delivered through structured timelines with the support of volunteer teachers and mentors.",
        "CMW also supports selected students in preparing for standardized international examinations such as TOEFL, IELTS, and SAT, helping qualified participants pursue scholarship opportunities and higher education abroad.",
        "Through partnerships with international organizations, including International Orphan Care and Flowers for Future International, CMW has also supported Afghan girls through online schooling and accredited educational opportunities. In all activities, participant safety and privacy remain a priority.",
        "CMW continues to explore new ways to expand access to learning resources for Afghan girls, including recorded educational content and digital platforms that can reach students across Afghanistan.",
      ],
    },
  },
  {
    id: "advocacy",
    label: "Advocacy",
    href: "/current-programs/advocacy",
    icon: Megaphone,
    heroImage: "/images/advocacy-hero-image.jpg",
    heroImagePosition: "center center",
    purpose: {
      title: "Purpose",
      paragraphs: [
        "Change Makers of the World advocates for meaningful youth inclusion in decision-making and for Afghan girls' access to secondary school and university education.",
        "Inside Afghanistan, the focus is on supporting safe civic participation and creating spaces, mainly through digital platforms, where young people and girls can share their views, raise concerns, and speak about issues affecting their futures.",
        "Internationally, CMW works to keep Afghanistan from being forgotten, raise awareness of current challenges, and continue support for Afghan girls' right to education and broader opportunities.",
      ],
    },
    activities: {
      title: "Activities",
      paragraphs: [
        "CMW organizes online meetings, discussions, campaigns, and events that bring together youth, students, educators, and community members to discuss key issues related to Afghanistan and education.",
        "CMW was among the founding organizations that helped establish the National Youth Consensus for Peace in 2021, a network of 244 organizations from all 34 provinces of Afghanistan that supported meaningful youth participation in the peace process.",
        "The organization also contributed to the creation of the Afghan Youth Coalition (AYC), a platform focused on documenting the situation of Afghan youth and presenting their priorities through research, consultations, and targeted advocacy.",
        "International advocacy efforts are carried out through cooperation with partner organizations, public forums, and youth networks in Europe, North America, and other regions.",
      ],
    },
  },
];

export const PROGRAM_CATEGORY_IDS = PROGRAM_CATEGORIES.map(
  (category) => category.id,
);

export function getProgramCategory(id: ProgramCategoryId): ProgramCategory {
  const category = PROGRAM_CATEGORIES.find((item) => item.id === id);
  if (!category) {
    throw new Error(`Unknown program category: ${id}`);
  }
  return category;
}

export function isProgramCategoryId(
  value: string,
): value is ProgramCategoryId {
  return PROGRAM_CATEGORY_IDS.includes(value as ProgramCategoryId);
}
