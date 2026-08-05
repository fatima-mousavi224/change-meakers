export type InitiativeSocialType =
  | "website"
  | "instagram"
  | "linkedin"
  | "github";

export type InitiativeSocialLink = {
  type: InitiativeSocialType;
  href: string;
};

export type InitiativeDetailContent = {
  heroImage: string;
  heroLogo?: string;
  /** CSS object-position, e.g. "center 22%" to crop empty space above the focal area */
  heroImagePosition?: string;
  introParagraphs: string[];
  socialLinks?: InitiativeSocialLink[];
};

export const INITIATIVE_DETAIL_CONTENT: Record<string, InitiativeDetailContent> =
  {
    "afghan-girls-tech-academy": {
      heroImage: "/images/initiatives-datils/afghnGrilsAcdmy-hero-image.jpg",
      heroLogo: "/images/initiatives-datils/afghnGrilsAcdmy-logo-hero.png",
      heroImagePosition: "center 32%",
      socialLinks: [
        {
          type: "website",
          href: "https://www.afghangirlstech.com/",
        },
        {
          type: "instagram",
          href: "https://www.instagram.com/afghangirlstech",
        },
        {
          type: "linkedin",
          href: "https://www.linkedin.com/company/afghangirlstech/",
        },
        {
          type: "github",
          href: "https://github.com/AfghanGirlsTech",
        },
      ],
      introParagraphs: [
        "The Afghan Girls Tech Academy is an informal learning space established in 2024 in Herat and Kabul to support Afghan girls who no longer have access to formal education.",
        "The academy provides a safe and open environment where students can gather, study, and work together. Currently, more than 25 girls are part of the program across both locations. Each group participates in a six-month cycle, after which new students are selected.",
        "Students receive training in basic computer skills and English through a combination of in-person support and online instruction provided by partner tutors and educators. Outside of scheduled learning hours, the space remains open for students to continue studying, practicing, and using available resources.",
        "The program focuses on practical learning. It aims to help students build skills they can use for further education, remote work, or entry-level opportunities in digital and technology-related fields. Many participants are girls who were unable to complete their formal schooling.",
        "As a result of the program, some students have passed English language tests such as Duolingo, while others have started working on small projects or secured paid opportunities. In Herat, a group of students is currently contributing to the development of a local digital platform, MyHerat.com, designed to provide information and services for residents and visitors.",
      ],
    },
    "afghan-youth-coalition": {
      heroImage: "/images/initiatives-datils/ayc-hero-image.png",
      heroLogo: "/images/initiatives-datils/ayc-hero-logo.png",
      introParagraphs: [
        "The Afghan Youth Coalition (AYC) is a structured platform documenting the situation of Afghan youth and amplifying their voices in national and international conversations.",
        "Through research, storytelling, and coordinated advocacy, AYC helps young people share lived experiences and contribute to discussions about education, rights, and participation.",
        "The coalition connects youth-led groups and partners to strengthen visibility, collaboration, and evidence-based advocacy on issues affecting Afghan young people.",
      ],
    },
    "change-digital-library": {
      heroImage: "/images/initiatives-datils/degital-hero-image.jpg",
      heroLogo: "/images/initiatives-datils/tegitalLibrary-logo.png",
      introParagraphs: [
        "The Change Digital Library is an online platform that provides Afghan youth with free access to educational materials, resources, and learning content.",
        "The library supports learners who face barriers to formal education by making books, guides, and study materials available in accessible digital formats.",
        "Through ongoing updates and community contributions, the platform helps students continue learning independently and stay connected to educational opportunities.",
      ],
    },
    "maktab-dar-khana": {
      heroImage: "/images/initiatives-datils/maktab-hero-image.jpg",
      heroLogo: "/images/initiatives-datils/maktab-logo.png",
      introParagraphs: [
        "Maktab Dar Khana is a platform that enables Afghan girls to follow recorded formal lessons from home when attending school in person is not possible.",
        "The program organizes structured lesson content so students can learn at their own pace while maintaining continuity in core subjects.",
        "By combining recorded instruction with supportive follow-up, Maktab Dar Khana helps girls stay engaged with learning in safe home environments.",
      ],
    },
    "additional-learning-programs": {
      heroImage: "/images/initiatives-datils/additional-hero-image.jpg",
      introParagraphs: [
        "Additional Learning Programs include smaller online and in-person classes and workshops designed to support Afghan girls in continuing their education.",
        "These programs address specific learning needs through focused sessions in subjects such as languages, digital skills, and academic preparation.",
        "Flexible formats allow participants to join short-term courses that complement longer-term education initiatives across Change Makers of the World.",
      ],
    },
    nycp: {
      heroImage: "/images/initiatives-datils/national-hero-image.jpg",
      heroLogo: "/images/initiatives-datils/national-hero-logo.png",
      introParagraphs: [
        "The National Youth Consensus for Peace (NYCP), 2020–2021, brought together 244 organizations from all 34 provinces of Afghanistan.",
        "The movement advocated for meaningful youth participation in the peace process and highlighted the role of young people in building a more inclusive future.",
        "Through coordinated statements, dialogues, and public engagement, NYCP demonstrated the capacity of Afghan youth to contribute constructively to national conversations on peace.",
      ],
    },
  };

export function getInitiativeDetailContent(id: string) {
  return INITIATIVE_DETAIL_CONTENT[id] ?? null;
}
