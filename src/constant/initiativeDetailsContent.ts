export type InitiativeSocialType =
  | "website"
  | "facebook"
  | "x"
  | "linkedin"
  | "instagram"
  | "youtube"
  | "github"
  | "telegram";

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
  /** Text cards can use multiple body paragraphs instead of a single description */
  paragraphs?: string[];
  readMoreHref?: string;
  readMoreLabel?: string;
  showReadMore?: boolean;
  readMoreModal?: ContentDetailModalContent;
  /** Use "large" for assets with extra padding; "small" for compact illustrations */
  imageScale?: "default" | "large" | "small";
  /** Optional extra classes for the image, e.g. scale within a fixed box */
  imageClassName?: string;
  /** Report card background color */
  backgroundColor?: string;
};

export type InitiativeAtAGlanceDigitalLibrary = {
  telegramLibrary: {
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  };
  resourcesShared: {
    title: string;
    paragraphs: string[];
    dividerImage: string;
  };
  sidebar: {
    photoImage: string;
    photoAlt: string;
    telegramHref: string;
    usersLabel: string;
    usersCount: string;
  };
};

export type InitiativeBentoMaktabSection = {
  photoImage: string;
  photoAlt: string;
  partnershipsCard: {
    title: string;
    logos: Array<{
      src: string;
      alt: string;
      width?: number;
      height?: number;
      className?: string;
      imageClassName?: string;
    }>;
    description: string;
    readMoreHref?: string;
    readMoreModal?: ContentDetailModalContent;
  };
  comingSoon: {
    label: string;
    year: string;
  };
  youtubeCard: {
    image: string;
    readMoreHref: string;
  };
};

export type InitiativeBentoAdditionalSection = {
  photoImage: string;
  photoAlt: string;
  practicalSkills: {
    title: string;
    image: string;
    imageAlt: string;
    description: string;
  };
  languageLearning: {
    title: string;
    flags: Array<{ src: string; alt: string }>;
    description: string;
  };
  globeCard: {
    readMoreHref: string;
  };
};

export type InitiativeBentoSection = {
  layout?: "default" | "ayc";
  establishedLabel: string;
  establishedYear: string;
  photoImage: string;
  photoAlt: string;
  globeCard: {
    readMoreHref: string;
  };
  /** AGTA layout */
  studentsTitle?: string;
  studentsSubtitle?: string;
  sixMonthCycles?: {
    title: string;
    icon: string;
    description: string;
    readMoreModal?: ContentDetailModalContent;
  };
  studentOutcomes?: {
    title: string;
    description: string;
    readMoreModal?: ContentDetailModalContent;
  };
  /** AYC layout */
  youthStats?: {
    title: string;
    femaleLabel: string;
    maleLabel: string;
    femaleIconCount: number;
    maleIconCount: number;
  };
  previousWork?: {
    title: string;
    icon: string;
    description: string;
    readMoreModal?: ContentDetailModalContent;
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

export type InitiativeMaktabHero = {
  heroTitle?: string;
  dariText: string;
  dariCalligraphyImage?: string;
  englishQuote: {
    text: string;
    attribution: string;
  };
};

export type InitiativeIntroBlock =
  | string
  | {
      text: string;
      bold?: boolean;
    };

export type InitiativeIntroCta = {
  label: string;
  href: string;
};

export type InitiativeDetailContent = {
  heroImage: string;
  heroLogo?: string;
  /** Override the listing card title in the hero heading */
  heroTitle?: string;
  /** Hide the gray description line under the hero title */
  hideHeroDescription?: boolean;
  /** When false, no overlay. When a string, use as custom gradient CSS. */
  heroGradient?: boolean | string;
  /** CSS object-position, e.g. "center 22%" to crop empty space above the focal area */
  heroImagePosition?: string;
  introParagraphs: InitiativeIntroBlock[];
  introCta?: InitiativeIntroCta;
  socialLinks?: InitiativeSocialLink[];
  maktabHero?: InitiativeMaktabHero;
  atGlanceCards?: InitiativeAtAGlanceCard[];
  atGlanceDigitalLibrary?: InitiativeAtAGlanceDigitalLibrary;
  bentoMaktabSection?: InitiativeBentoMaktabSection;
  bentoAdditionalSection?: InitiativeBentoAdditionalSection;
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
      bentoSection: {
        layout: "ayc",
        establishedLabel: "Established",
        establishedYear: "2025",
        photoImage: "/images/initiatives-datils/computerimage-ayc.jpg",
        photoAlt:
          "AYC digital consultation session on a laptop video conference screen",
        youthStats: {
          title: "100+ Youth Connected",
          femaleLabel: "39% Female",
          maleLabel: "61% Male",
          femaleIconCount: 4,
          maleIconCount: 6,
        },
        previousWork: {
          title: "Built on Previous Youth Work",
          icon: "/images/initiatives-datils/complate-ayc-logo.png",
          description:
            "AYC builds on earlier youth coordination efforts, including the National Youth Consensus for Peace, which brought together youth organizations from across Afghanistan.",
          readMoreModal: {
            title: "National Youth Consensus for Peace",
            image: "/images/initiatives-datils/national-hero-logo.png",
            imageAlt: "National Youth Consensus for Peace logo",
            paragraphs: [
              "The National Youth Consensus for Peace (NYCP), 2020–2021, brought together 244 organizations from all 34 provinces of Afghanistan.",
              "The movement advocated for meaningful youth participation in the peace process and highlighted the role of young people in building a more inclusive future.",
              "Through coordinated statements, dialogues, and public engagement, NYCP demonstrated the capacity of Afghan youth to contribute constructively to national conversations on peace.",
            ],
          },
        },
        globeCard: {
          readMoreHref: "https://www.afgyouth.org/",
        },
      },
    },
    "change-digital-library": {
      heroImage: "/images/initiatives-datils/degital-hero-image.jpg",
      heroLogo: "/images/initiatives-datils/tegitalLibrary-logo.png",
      socialLinks: [
        {
          type: "telegram",
          href: "https://t.me/cmworld_org",
        },
      ],
      introParagraphs: [
        "The Change Digital Library is an online initiative that provides free access to educational resources for Afghan youth through a Telegram-based platform. The library currently serves more than 40,000 users and has shared over 7,000 books and learning materials.",
        "The platform focuses on making educational content accessible in a simple and practical way. Materials are shared through publicly available sources on Telegram, along with contributions from volunteers and users who submit books and documents to be distributed within the community.",
        "The library continues to grow as more resources are added and shared, helping students access learning materials that are otherwise difficult to obtain.",
        "About the cover photo: The cover photo was taken in 2023 during a book access campaign organized by Change Makers of the World in partnership with Iqra Bookstore, one of the largest bookstores in western Kabul. Through the initiative, Afghan youth received substantial discounts on books to encourage reading and learning. CMW has also supported additional book donation and distribution initiatives with Iqra Bookstore, providing books to Afghan youth and war-affected schools in Kabul.",
      ],
      atGlanceDigitalLibrary: {
        telegramLibrary: {
          title: "Telegram-Based Library",
          description:
            "Resources are distributed through Telegram, making access simple for students already using the platform.",
          image: "/images/initiatives-datils/degital-computer-image.png",
          imageAlt:
            "Illustration of a laptop, book, pencil, and lightbulb representing digital learning",
        },
        resourcesShared: {
          title: "7,000+ Resources Shared",
          paragraphs: [
            "More than 7,000 books, documents, and learning materials have been shared through the Change Digital Library. These include study materials, reference books, language resources, and educational documents that may otherwise be difficult to find or afford. By bringing these resources together in one accessible platform, the library helps Afghan youth find useful learning materials without cost. New resources continue to be added and shared with the community.",
          ],
          dividerImage:
            "/images/initiatives-datils/tgital-image-underText.png",
        },
        sidebar: {
          photoImage: "/images/initiatives-datils/second-degtial-image.jpg",
          photoAlt:
            "Afghan youth browsing books in a bookstore during a book access campaign",
          telegramHref: "https://t.me/cmworld_org",
          usersLabel: "Users",
          usersCount: "40,000+",
        },
      },
    },
    "maktab-dar-khana": {
      heroImage: "/images/initiatives-datils/maktab-hero-image.jpg",
      heroLogo: "/images/initiatives-datils/maktab-logo.png",
      heroImagePosition: "center 94%",
      socialLinks: [
        {
          type: "website",
          href: "https://www.maktab93.com/",
        },
        {
          type: "facebook",
          href: "https://www.facebook.com/cmw.world",
        },
        {
          type: "instagram",
          href: "https://www.instagram.com/cmw.world",
        },
        {
          type: "linkedin",
          href: "https://www.linkedin.com/company/cmw-world/",
        },
      ],
      maktabHero: {
        heroTitle: "Maktab Dar Khana (School At Home)",
        dariText: "توانا بود هر که دانا بود",
        englishQuote: {
          text: "The wise are the truly powerful; through knowledge, even an old heart becomes young.",
          attribution: "Ferdowsi, Shahnamah",
        },
      },
      introParagraphs: [
        "The Afghan Digital Learning Initiative is a program focused on expanding access to school education for Afghan students, especially girls, through recorded lessons and remote support.",
        "During the COVID-19 period in 2020-2021, a group of private schools in Kabul developed and recorded a set of lessons in Dari, covering grades 1 to 12. These materials were originally available only to paying students.",
        "In 2024, through a partnership with this network of schools, Change Makers of the World gained access to these recorded lessons. The initiative is now working to make this content freely available online, with plans to publish the full curriculum on YouTube so that students across Afghanistan can access it.",
        "In addition to the video lessons, the program is developing a support system where volunteer teachers and mentors assist students as they follow the materials, helping answer questions and guide their learning.",
        "Efforts are also underway to distribute the lessons offline through USB drives for students in areas with limited or no internet access. Expanding this part of the project depends on additional resources and external support.",
        "Through related partnerships with organizations including Eileen Murphy Foundation and Flowers for Future International, more than 400 Afghan girls in Kabul have been supported to continue their education through a combination of in-person and online learning. Over 40 students have received accredited California high school diplomas, and a small number have secured scholarships to continue their studies abroad.",
      ],
      atGlanceCards: [
        {
          title: "For Afghan Girls",
          variant: "image",
          image: "/images/initiatives-datils/maktab-flag.png",
          imageAlt:
            "Map of Afghanistan filled with portraits of Afghan girls and women",
          description:
            "Supporting girls who cannot access formal schooling.",
          imageScale: "large",
        },
        {
          title: "Grades 1–12 Lessons",
          variant: "image",
          image: "/images/initiatives-datils/maktab-book.png",
          imageAlt: "Open book with a lightbulb representing recorded lessons",
          description:
            "Recorded school lessons in Dari covering grades 1 to 12. The lessons were originally prepared and recorded by a network of private schools in Kabul.",
        },
        {
          title: "Teacher & Mentor Support",
          variant: "text",
          description: "",
          paragraphs: [
            "Students following the recorded lessons may sometimes need additional help understanding a topic, answering questions, or continuing their studies independently. Volunteer teachers and mentors can provide learning support and guidance when available.",
            "Students who need academic support while using Maktab Dar Khana can contact Change Makers of the World through our Contact page to request assistance.",
          ],
          readMoreHref: "https://www.cmworld.org/contact",
          readMoreLabel: "Request Learning Support",
          showReadMore: true,
        },
      ],
      bentoMaktabSection: {
        photoImage: "/images/initiatives-datils/grils-image.jpg",
        photoAlt:
          "Afghan girls studying together with laptops in a classroom setting",
        partnershipsCard: {
          title: "400+ Afghan Girls Supported Through Partnerships",
          logos: [
            {
              src: "/images/home-page/orbahan-cear-orgnastion.png",
              alt: "International Orphan Care",
              width: 200,
              height: 56,
            },
            {
              src: "/images/home-page/flower-for-the-future-orgnastion.png",
              alt: "Flowers for the Future International",
              width: 220,
              height: 56,
            },
          ],
          description:
            "Including 40+ accredited high school diplomas and scholarship pathways abroad.",
          readMoreModal: {
            title: "400+ Afghan Girls Supported Through Partnerships",
            paragraphs: [
              "Through related partnerships with organizations including Eileen Murphy Foundation and Flowers for Future International, more than 400 Afghan girls in Kabul have been supported to continue their education through a combination of in-person and online learning.",
              "Over 40 students have received accredited California high school diplomas, and a small number have secured scholarships to continue their studies abroad.",
            ],
          },
        },
        comingSoon: {
          label: "Coming Soon",
          year: "2026",
        },
        youtubeCard: {
          image: "/images/initiatives-datils/youtube-image.png",
          readMoreHref: "https://youtube.com/@cmw_world",
        },
      },
    },
    "additional-learning-programs": {
      heroImage: "/images/initiatives-datils/additional-hero-image.jpg",
      heroImagePosition: "center 82%",
      heroGradient:
        "linear-gradient(168.58deg, rgba(4, 17, 29, 0) 10.18%, #134C83 108.31%)",
      introParagraphs: [
        "In addition to our main initiatives, Change Makers of the World runs smaller online classes and workshops to support Afghan girls in continuing their education.",
        "These include language courses such as English, Italian, and German, delivered with the support of volunteer instructors and international partners.",
        "We also organize in-person sessions in Kabul and Herat, often hosted at the Afghan Girls Tech Academy or in collaboration with local organizations. These sessions cover topics such as personal development, academic writing, and other practical skills.",
        "Information about these programs is shared through our social media platforms and through applications submitted by students interested in joining.",
      ],
      atGlanceCards: [
        {
          title: "Academic Support",
          variant: "image",
          image: "/images/initiatives-datils/additional-bag-image.png",
          imageAlt:
            "Document, briefcase, and pen representing academic and career support",
          description:
            "Students receive support in academic writing, CV preparation, applications, and study skills.",
          imageClassName:
            "scale-[1.78] sm:scale-[1.82] lg:scale-[1.88]",
          readMoreModal: {
            title: "Academic Support",
            image: "/images/initiatives-datils/kabul&herat-flag.png",
            imageAlt: "Map of Afghanistan highlighting Kabul and Herat provinces",
            imageScale: "large",
            paragraphs: [
              "For many Afghan girls, finding an opportunity is only the first step. Preparing a strong application, writing a CV, understanding requirements, and completing forms can be difficult without guidance.",
              "Through targeted sessions and individual support, our team helps students prepare CVs, scholarship and program applications, and other required materials. Students are also guided in identifying suitable educational and online opportunities and understanding how to apply.",
              "Support has included guidance for opportunities such as United World College scholarships and other educational programs. Our aim is practical: to help students submit stronger applications and improve their chances of accessing opportunities that could shape their education and future.",
            ],
          },
        },
        {
          title: "Online Classes",
          variant: "image",
          image: "/images/initiatives-datils/additional-tv-image.png",
          imageAlt:
            "Computer monitor with learning icons representing online classes",
          description:
            "Small online classes help Afghan girls continue learning from different locations.",
          imageClassName:
            "scale-[1.52] sm:scale-[1.55] lg:scale-[1.58]",
        },
        {
          title: "In-Person Workshops",
          variant: "text",
          description: "",
          paragraphs: [
            "Our in-person workshops address needs that are difficult to meet through regular online classes alone. Sessions include mental well-being support, helping participants manage stress, isolation, and challenges affecting their daily lives.",
            "Other workshops focus on entry into the job market, introducing participants to workplace expectations, job searching, applications, interviews, and pathways toward employment and financial independence.",
          ],
        },
      ],
      bentoAdditionalSection: {
        photoImage: "/images/initiatives-datils/additional-second-image.jpg",
        photoAlt:
          "Afghan girls participating in an in-person workshop session",
        practicalSkills: {
          title: "Practical Skills",
          image: "/images/initiatives-datils/additional-animation-image.png",
          imageAlt:
            "Illustration of a woman flexing her arm, representing confidence and practical skills",
          description:
            "Sessions focus on useful topics such as personal development, confidence, and future planning.",
        },
        languageLearning: {
          title: "Language Learning",
          flags: [
            {
              src: "/images/initiatives-datils/amerca-flag.png",
              alt: "United States flag",
            },
            {
              src: "/images/initiatives-datils/germany-flag.png",
              alt: "Germany flag",
            },
            {
              src: "/images/initiatives-datils/itaila-flag.png",
              alt: "Italy flag",
            },
          ],
          description:
            "Programs include English, German, and Italian language classes with volunteer instructors.",
        },
        globeCard: {
          readMoreHref: "https://www.cmworld.org/contact",
        },
      },
    },
    nycp: {
      heroImage: "/images/initiatives-datils/national-hero-image.jpg",
      heroLogo: "/images/initiatives-datils/national-hero-logo.png",
      heroTitle: "National Youth Consensus For Peace",
      hideHeroDescription: false,
      heroImagePosition: "center 62%",
      heroGradient:
        "linear-gradient(168.58deg, rgba(4, 17, 29, 0) 10.18%, #134C83 108.31%)",
      socialLinks: [
        {
          type: "facebook",
          href: "https://www.facebook.com/YouthConsensus",
        },
        {
          type: "instagram",
          href: "https://www.instagram.com/consensusyouth/",
        },
        {
          type: "x",
          href: "https://x.com/YouthConsensus_",
        },
      ],
      introParagraphs: [
        "In 2020, amidst a pivotal moment in Afghanistan’s history and fragile peace process, Yahya Qanie initiated and co-founded the National Youth Consensus for Peace (NYCP), a first-of-its-kind youth-led coalition uniting over 244 organizations across all 34 provinces. Launched at a time when peace negotiations systematically excluded youth, who made up more than 70% of the Afghan population, NYCP emerged as a national mechanism to represent their voice, agency, and vision, and to advocate for inclusive and sustainable peace.",
        "NYCP transcended ethnic, sectarian, and geographic divides, pioneering a hybrid model of civic mobilization and policy advocacy. Its aim was not mere visibility, but influence: shaping the structure, substance, and legitimacy of peace efforts, and positioning youth not just as peace advocates, but as critical thinkers in post-conflict governance and reconciliation agendas.",
        "Under Mr. Qanie’s leadership, NYCP distinguished itself by its scale, independence, and data-driven approach. Merging 27 provincial resolutions, the coalition issued Afghanistan’s first unified National Youth Resolution on International Youth Day 2020 and advanced efforts to establish formal mechanisms for youth inclusion in national policy spaces. It conducted direct policy advocacy and systematic consultations with the High Council for National Reconciliation, the Ministry of Peace, and diplomatic missions from the United Nations, European Union, NATO, the United States, United Kingdom, France, Germany, Canada, and the Nordic countries: Netherlands, Norway, Finland, and Sweden.",
        "Through targeted campaigns, public statements, and mass consultations, NYCP became a civic force for accountability, inclusion, and generational ownership of peace, challenging tokenism and advocating for youth to be recognized as co-authors of Afghanistan’s future. Its message was clear: no peace is sustainable or legitimate without the participation of the generation that will inherit it.",
        "Though NYCP suspended its activities after the collapse of the Afghan government in 2021, it left behind a blueprint for youth-led civic mobilization and policy engagement. It demonstrated that when young people are strategically organized, data-informed, and purpose-driven, they can challenge exclusion and create new possibilities. Yahya Qanie’s leadership reaffirmed that peace is not only a matter of high-level diplomacy; it is a generational mandate.",
        {
          text: "Read the Full Story of the National Youth Consensus for Peace:",
          bold: true,
        },
        {
          text: "Explore the complete record of NYCP, including its formation, nationwide consultations, youth participation, advocacy efforts, key achievements, and outcomes.",
          bold: true,
        },
      ],
      introCta: {
        label: "Download the Full Report",
        href: "#",
      },
    },
  };

export function getInitiativeDetailContent(id: string) {
  return INITIATIVE_DETAIL_CONTENT[id] ?? null;
}
