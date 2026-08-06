export type InitiativeSocialType =
  | "website"
  | "facebook"
  | "x"
  | "linkedin"
  | "instagram"
  | "youtube"
  | "github";

export type InitiativeSocialLink = {
  type: InitiativeSocialType;
  href: string;
};

import type { ContentDetailModalContent } from "@/types/contentDetailModal";

export type InitiativeAtAGlanceCard = {
  title: string;
  /** Image cards use image + short description; text cards use body copy only; report cards use a featured layout */
  variant: "image" | "text" | "report";
  image?: string;
  imageAlt?: string;
  description: string;
  readMoreHref?: string;
  showReadMore?: boolean;
  readMoreModal?: ContentDetailModalContent;
  /** Use "large" for assets with extra padding; "small" for compact illustrations */
  imageScale?: "default" | "large" | "small";
  /** Report card background color */
  backgroundColor?: string;
};

export type InitiativeBentoSection = {
  establishedLabel: string;
  establishedYear: string;
  studentsTitle: string;
  studentsSubtitle: string;
  photoImage: string;
  photoAlt: string;
  sixMonthCycles: {
    title: string;
    icon: string;
    description: string;
    readMoreModal?: ContentDetailModalContent;
  };
  studentOutcomes: {
    title: string;
    description: string;
    readMoreModal?: ContentDetailModalContent;
  };
  globeCard: {
    readMoreHref: string;
  };
};

export type InitiativeLetGirlsLearnSection = {
  hashtag: string;
  subtitle: string;
  /** ISO date string — live countdown from this moment (Gandomin-style) */
  countdownStartDate: string;
  highlightText: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  compareBeforeImage: string;
  compareAfterImage: string;
  compareBeforeAlt: string;
  compareAfterAlt: string;
};

export type InitiativeDetailContent = {
  heroImage: string;
  heroLogo?: string;
  /** When false, hero image renders without the blue gradient overlay */
  heroGradient?: boolean;
  /** CSS object-position, e.g. "center 22%" to crop empty space above the focal area */
  heroImagePosition?: string;
  introParagraphs: string[];
  socialLinks?: InitiativeSocialLink[];
  atGlanceCards?: InitiativeAtAGlanceCard[];
  bentoSection?: InitiativeBentoSection;
  letGirlsLearnSection?: InitiativeLetGirlsLearnSection;
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
      atGlanceCards: [
        {
          title: "Kabul & Herat",
          variant: "image",
          image: "/images/initiatives-datils/kabul&herat-flag.png",
          imageAlt: "Map of Afghanistan highlighting Kabul and Herat provinces",
          description: "Two active learning spaces inside Afghanistan.",
          imageScale: "large",
          readMoreModal: {
            title: "Kabul & Herat",
            image: "/images/initiatives-datils/kabul&herat-flag.png",
            imageAlt: "Map of Afghanistan highlighting Kabul and Herat provinces",
            imageScale: "large",
            paragraphs: [
              "The Academy operates in two locations, with the Herat center managed directly by CMW and the Kabul activities supported in cooperation with a local partner organization.",
              "In Herat, the space is also used beyond regular classes for workshops, meetings, and other activities where girls can learn and work together.",
            ],
          },
        },
        {
          title: "Computer & English Training",
          variant: "image",
          image: "/images/initiatives-datils/tv-image.png",
          imageAlt: "Computer monitor showing English language training",
          description:
            "Students learn basic computer skills, English, and digital tools through in-person support and online instruction.",
        },
        {
          title: "My Herat.com",
          variant: "text",
          description:
            "Herat students are contributing to MyHerat.com, a local digital platform being developed to share city information, useful services, and opportunities for residents and visitors. The project gives students practical experience in digital work while helping them apply their skills to something connected to their own city. Students take part in developing and managing content for the platform, gaining experience beyond classroom learning. The project also gives them an opportunity to build practical skills that can support their future education and employment.",
          readMoreHref: "https://www.myherat.com",
        },
      ],
      bentoSection: {
        establishedLabel: "Established",
        establishedYear: "2025",
        studentsTitle: "25+ Students",
        studentsSubtitle: "100% Female",
        photoImage: "/images/initiatives-datils/grils-image.jpg",
        photoAlt:
          "Afghan Girls Tech Academy students working together on laptops",
        sixMonthCycles: {
          title: "Six-Month Cycles",
          icon: "/images/initiatives-datils/six-month-class.png",
          description:
            "Each group follows a structured six-month learning period. Each group follows a structured six-month learning period. Each group follows a structured six-month learning period.",
          readMoreModal: {
            title: "Six-Month Cycles",
            image: "/images/initiatives-datils/six-month-class.png",
            paragraphs: [
              "The academy provides a safe and open environment where students can gather, study, and work together. Currently, more than 25 girls are part of the program across both locations.",
              "Each group participates in a six-month cycle, after which new students are selected. This structure allows the program to support new participants regularly while giving each group focused time to learn, practice, and build skills together.",
            ],
          },
        },
        studentOutcomes: {
          title: "Student Outcomes",
          description:
            "The academy is already helping students turn learning into real next steps. Some students have passed English language tests, joined digital projects, and accessed paid work opportunities. For girls who were forced out of formal education, these outcomes show what practical learning spaces can make possible.",
          readMoreModal: {
            title: "Student Outcomes",
            image: "/images/initiatives-datils/kabul&herat-flag.png",
            imageAlt: "Map of Afghanistan highlighting Kabul and Herat provinces",
            imageScale: "large",
            paragraphs: [
              "Employment and Financial Independence: Some students have been hired by local companies for digital work, including UX/UI design and web development, supporting our goal of helping students build skills for employment and greater financial independence.",
              "English Language Achievement: Students have used the Academy's learning resources to prepare for internationally recognized English tests, including the Duolingo English Test, with some achieving strong scores.",
              "Scholarships and Continued Education: Students have secured opportunities to continue their education. Most recently, one student received a scholarship to study toward an internationally recognized high school diploma through an online program in Canada.",
              "Personal and Professional Skills: Through classes and group activities, students strengthen their English, communication, public speaking, teamwork, networking, and other practical skills.",
              "Well-being and Community: The Academy provides a space where girls can meet, learn, participate in activities, and maintain social connection at a time when many educational and public opportunities for Afghan girls remain restricted.",
            ],
          },
        },
        globeCard: {
          readMoreHref: "https://www.afghangirlstech.com/",
        },
      },
      letGirlsLearnSection: {
        hashtag: "#LetAfghanGirlsLearn",
        subtitle: "Every girl has the right to learn.",
        countdownStartDate: "2021-08-15T00:00:00+04:30",
        highlightText:
          "Since Afghan girls were barred from secondary education.",
        description:
          "The Afghan Girls Tech Academy helps girls continue learning when formal education is no longer accessible to them.",
        ctaLabel: "Support Their Education",
        ctaHref:
          "https://www.gofundme.com/f/HelpAfghanGirlsLearn/donate?attribution_id=undefined&utm_campaign=unknown&utm_medium=customer&utm_source=website_widget",
        compareBeforeImage: "/images/home-page/about-slide-one.jpg",
        compareAfterImage: "/images/home-page/about-slide-two.png",
        compareBeforeAlt: "Empty classroom before girls returned to learning",
        compareAfterAlt:
          "Classroom filled with Afghan girls raising their hands to participate",
      },
    },
    "afghan-youth-coalition": {
      heroImage: "/images/initiatives-datils/ayc-hero-image.png",
      heroLogo: "/images/initiatives-datils/ayc-hero-logo.png",
      heroGradient: false,
      heroImagePosition: "center center",
      socialLinks: [
        {
          type: "website",
          href: "https://www.afgyouth.org/",
        },
        {
          type: "facebook",
          href: "https://www.facebook.com/youthcoalition.af",
        },
        {
          type: "x",
          href: "https://x.com/YouthCoalition_",
        },
        {
          type: "linkedin",
          href: "https://www.linkedin.com/company/afghanyouth",
        },
        {
          type: "instagram",
          href: "https://www.instagram.com/youthcoalition.af",
        },
        {
          type: "youtube",
          href: "https://www.youtube.com/@youth.coalition",
        },
      ],
      introParagraphs: [
        "The Afghan Youth Coalition (AYC) is a platform established in partnership with youth groups in Afghanistan and HerDreams Society, an all-female initiative. It focuses on documenting the situation of Afghan youth and conducting research, consultations, and targeted advocacy.",
        "AYC works primarily as a documentation and engagement platform, collecting perspectives from young people and translating them into reports, discussions, and structured outputs. The initiative builds on earlier youth efforts, including involvement in the National Youth Consensus for Peace in Afghanistan in 2021.",
        "The work of AYC is organized around three main areas: youth research and data collection, advocacy and campaigns, and youth consultations.",
        "Through monthly consultation meetings, Afghan youth are invited to share their views on key issues. These discussions are documented and summarized into reports. To date, AYC has conducted several consultation sessions and produced written outputs based on these engagements.",
      ],
      atGlanceCards: [
        {
          title: "Connecting Afghan Youth",
          variant: "image",
          image: "/images/initiatives-datils/ayc-flag.png",
          imageAlt:
            "Map of Afghanistan showing connections between Afghan youth across locations",
          description:
            "AYC brings Afghan youth together across different locations to share their concerns, priorities, and ideas in a more organized way.",
          imageScale: "small",
        },
        {
          title:
            "Afghan Youth Voices 2025: Pilot Digital Engagement Report",
          variant: "report",
          image: "/images/initiatives-datils/ayc-book.png",
          imageAlt: "Afghan Youth Voices 2025 report cover",
          description: "",
          backgroundColor: "#BCCACA",
          showReadMore: true,
          readMoreHref:
            "https://drive.google.com/file/d/1aw--zxORCdRJAW51rjzEhoXvsKFc6Yds/view?usp=sharing",
        },
        {
          title: "Documenting Afghan Youth Realities",
          variant: "text",
          description:
            "AYC documents the concerns, priorities, and experiences of Afghan youth so their realities can be reflected in research, reports, consultations, and advocacy. By collecting perspectives directly from young people, AYC helps build a clearer record of the challenges, needs, and changes shaping their lives and future across Afghanistan.",
          showReadMore: true,
          readMoreModal: {
            title: "Documenting Afghan Youth Realities",
            image: "/images/initiatives-datils/kabul&herat-flag.png",
            imageAlt: "Map of Afghanistan highlighting Kabul and Herat provinces",
            imageScale: "large",
            paragraphs: [
              "Millions of young Afghans are growing up through major changes affecting their education, employment, freedoms, and future. Yet many of their experiences remain undocumented, and reliable youth-focused data is limited.",
              "AYC works to document these realities directly from young people through consultations, surveys, research, and reports. This is especially important as the situation of both young women and men continues to change across Afghanistan.",
              "Documenting these experiences creates a record of what Afghan youth are facing, what they need, and what they are asking for. It also provides evidence that can support research, advocacy, and decisions affecting their future.",
            ],
          },
        },
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
