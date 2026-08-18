import { PhoneIcon } from "lucide-react";
import { BiHomeAlt } from "react-icons/bi";
import { CiSettings } from "react-icons/ci";
import { LuPen } from "react-icons/lu";
import slide1 from "public/images/programs/education-access/slider_1.jpg";
import slide2 from "public/images/programs/education-access/slider_2.jpg";
import slide3 from "public/images/programs/education-access/slider_3.jpg";
import slide4 from "public/images/programs/education-access/slider_4.jpg";
import slide5 from "public/images/programs/education-access/slider_5.jpg";
import slide2_1 from "public/images/programs/human_rights/slider_1.jpg";
import slide2_2 from "public/images/programs/human_rights/slider_2.jpg";
import slide2_3 from "public/images/programs/human_rights/slider_3.jpg";
import slide2_4 from "public/images/programs/human_rights/slider_4.jpg";
import slide2_5 from "public/images/programs/human_rights/slider_5.jpg";
import slide2_6 from "public/images/programs/human_rights/slider_6.jpg";
import slide2_7 from "public/images/programs/human_rights/slider_7.jpg";
import slide2_8 from "public/images/programs/human_rights/slider_8.jpg";
import slide2_9 from "public/images/programs/human_rights/slider_9.jpg";
import slide2_10 from "public/images/programs/human_rights/slider_10.jpg";
import slider3_1 from "public/images/programs/humanitarian-support/slider3_1.jpg";
import slider3_2 from "public/images/programs/humanitarian-support/slider3_2.jpg";
import slider3_3 from "public/images/programs/humanitarian-support/slider3_3.jpg";
import { HandCoins, UserPen, UserRoundCog } from "lucide-react";
import { DONATE_URL } from "@/constant/donate";

export const dashboardActions = [
  {
    title: "Add Donation",
    description:
      "Make a meaningful impact by contributing to our cause. Your generous donation, no matter the size, helps us create positive change in the world. Join our community of changemakers and be part of something bigger than yourself.",
    icon: UserPen,
    link: DONATE_URL,
  },
  {
    title: "Manage Account",
    description:
      "Manage your account settings, update personal information, and customize your preferences",
    icon: UserRoundCog,
    link: "/dashboard/account",
  },
  {
    title: "Manage Payments",
    description:
      "Manage your payments, view transaction history, update billing information, and set up automatic payments for seamless financial management",
    icon: HandCoins,
    link: "/manage-payment",
  },
];
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
    href: "/current-programs",
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
  { name: "Programs", href: "/current-programs" },
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

export const sidebarEditProfile = [
  {
    icon: BiHomeAlt,
    name: "Home",
    link: "/profile/home",
  },
  {
    icon: CiSettings,
    name: "Create Profile",
    link: "/profile/create-profile",
  },
  {
    icon: LuPen,
    name: "Edit Profile",
    link: "/profile/edite-profile",
  },
];

const images = [
  "/images/image1.jpg",
  "/images/image2.jpg",
  "/images/image3.jpg",
];

export const slidesHumanitarianSupport = [
  {
    title: "Bamyan, Afghanistan",
    subtitle:
      "Women and girls in Bamyan receiving humanitarian support discussed their situation and made requests for help.",
    image: slider3_1,
  },
  {
    title: "Kabul, Afghanistan",
    subtitle:
      "An Afghan man with his children in Kabul received support from Change Makers of the World. This picture is copyrighted.",
    image: slider3_2,
  },
  {
    title: "Bamyan, Afghanistan",
    subtitle:
      "Women and girls joined an empowerment program, sharing their rights and connecting with the international community.",
    image: slider3_3,
  },
];

export const slidesRightHuman = [
  {
    title: "United States of America",
    subtitle:
      "A session discussed the importance of education within families, particularly for refugees, for their empowerment and future.",
    image: slide2_1,
  },
  {
    title: "Sapidar Palace, Kabul",
    subtitle:
      "A meeting at Sapidar Palace discussed Afghan youth’s rights, their inclusion, and the future of Afghanistan.",
    image: slide2_2,
  },
  {
    title: "Marefat High School",
    subtitle:
      "Youth from Afghanistan are learning to engage in decision-making, advocate for their rights, and shape their future.",
    image: slide2_3,
  },
  {
    title: "Afghanistan International TV, Kabul",
    subtitle:
      "Our founders appeared on Afghanistan Television discussing Change Makers of the World’s programs and opportunities.",
    image: slide2_4,
  },
  {
    title: "Europe",
    subtitle:
      "Our program in Europe raised awareness about the challenges faced by Afghans and highlighted ways to support them.",
    image: slide2_5,
  },
  {
    title: "Europe",
    subtitle:
      "Our program in Europe shared Afghan culture through music, clothing, and activities promoting integration and rights.",
    image: slide2_6,
  },
  {
    title: "United States of America",
    subtitle:
      "Mr. Reza Hussaini spoke at an American university about Change Makers of the World, emphasizing the need to support Afghans.",
    image: slide2_7,
  },
  {
    title: "United States of America",
    subtitle:
      "Mr. Reza Hussaini organized a session discussing Afghan refugees in the U.S., their rights, and their demands from the U.S.",
    image: slide2_8,
  },
  {
    title: "Kabul Serena",
    subtitle:
      "Change Makers of the World co-founded the National Consensus for Peace, gathering +240 partner organizations across Afghanistan.",
    image: slide2_9,
  },
  {
    title: "Meeting with the EU in Afghanistan",
    subtitle:
      "A meeting with the head of the EU in Afghanistan discussed youth involvement in decision-making and their future.",
    image: slide2_10,
  },
];

export const educationSlideData = [
  {
    title: "Talaash-e-Danish School, Kabul",
    subtitle:
      "Students at Talaash-e-Danish School are learning English and other subjects not available in regular school.",
    image: slide4,
  },
  {
    title: "Afghanistan Girls College, Kabul",
    subtitle:
      "Female students in a Kabul classroom participated in a recent program organized by Change Makers of the World.",
    image: slide2,
  },
  {
    title: "Sayed Al-Shuhada School, Kabul",
    subtitle:
      "After a tragic explosion, our volunteers donated books and school supplies to students at Sayed Al-Shuhada School.",
    image: slide3,
  },
  {
    title: "Marefat High School, Kabul",
    subtitle:
      "Students in Kabul are participating in an empowerment program, learning about leadership and advocacy.",
    image: slide1,
  },
  {
    title: "Kabul, Afghanistan",
    subtitle:
      "Female students in Kabul are learning writing and English, empowering themselves despite Taliban restrictions.",
    image: slide5,
  },
];

export const cardData = [
  {
    number: "01",
    title: "In-Person Schools",
    desc: "We are currently running in-person schools and educational classes across Afghanistan. Even with strict rules and bans from the Taliban, we are carefully organizing our classes in various provinces, including Kabul, Herat, and Ghazni. We cannot share exact locations or details for safety reasons.  Our efforts are made possible through partnerships with schools in cities like Kabul, where we offer classes for girls, even with many limitations. In addition to these partnerships, we also operate independent classes, such as those in Herat, where we educate children and girls.",
  },
  {
    number: "02",
    title: "Online Education Access",
    desc: "Given the current situation in Afghanistan, our primary focus is on online education for women who are banned from attending school. We offer online classes led by teachers from Europe and America. These classes are available in various formats, including independent and partnership collaborations.",
  },
  {
    number: "03",
    title: "Recorded Lessons Access",
    desc: "Through collaboration with a schools union in western Kabul, we have gained access to more than 70% of recorded school subject lessons. Using these videos, we deliver organized lessons to our students via our platform.",
  },
  {
    number: "04",
    title: "Books and Supplies",
    desc: "We also provide funding for books and school supplies to students and schools, prioritizing war-affected children and girls. We organize book drives and distribute the collected books to students in need.",
  },
  {
    number: "05",
    title: "Digital Library",
    desc: "We operate an online library—The Change eLibrary—serving Afghan students across the country. With a network of over 60,000 students, we provide books and educational materials daily through an organized online platform managed by volunteers.",
  },
  {
    number: "06",
    title: "Scholarship Programs",
    desc: "Change Makers of the World is proud to offer both online and in-person programs aimed at securing scholarships for Afghan students, particularly girls, to study abroad. So far, nine students have secured scholarships outside Afghanistan. This initiative is ongoing, preparing students for opportunities to pursue their dreams abroad. We carefully select scholarship candidates based on their performance in science subjects (Math, Physics, Chemistry, Biology) and English language proficiency. Applications are not publicly accepted; instead, we review and select participants from our existing educational programs. This is a rigorous process but one of our most impactful initiatives.",
  },
];
export const cardHumanRightData = [
  {
    number: "01",
    title: "Skill-Building Lessons",
    desc: "Our lessons cover school subjects, arts, language classes, and empowerment programs. Unfortunately, due to Taliban restrictions, we cannot provide official graduation certificates. However, our documents can support our students in their future academic pursuits, such as applying for scholarships abroad. While our programs help many Afghan girls, online education can never fully replace the experience of learning in a traditional school setting. ",
  },
  {
    number: "02",
    title: "Support for War-Affected Students",
    desc: "We support injured and war-affected girl students from Afghanistan who are now in Turkey for education and medical treatment. Change Makers of the World plays a key role in helping them survive and continue their education.",
  },
  {
    number: "03",
    title: "Global Rights Advocacy",
    desc: "We collaborate with German and American organizations to advocate for the human rights of Afghan women. Our goal is to raise their voices on the international stage. We participate in human rights programs, issue statements, and write open letters to international communities, seeking help for the humanitarian crisis in Afghanistan. We also run a secure, restricted program to gather and report on the current situation of women and girls in Afghanistan, with input from activists across 16 provinces. The final statements, written by Afghan women and girls deprived of their rights, will be shared globally. We also advocate for refugee rights in Europe and America.",
  },
  {
    number: "04",
    title: "Anti-Discrimination Efforts",
    desc: "As a non-political and non-religious volunteer community, we support advocacy against gender apartheid in Afghanistan and the genocide against the Hazara people. We are among the primary groups in our kind recognizing the #EndGenderApartheidinAfghanistan, #LetAfghanGirlsLearn, and   #StopHazaraGenocide  movements. We encourage other international organizations to join these human rights efforts. For inquiries, please contact us.",
  },
];
export const cardHumanitarianData = [
  {
    number: "01",
    title: "Crisis Family Aid",
    desc: "We provide financial support to families affected by the humanitarian crisis in Afghanistan. Although our focus is on defending human rights and educating girls, we offer this financial aid on a small scale. ",
  },
  {
    number: "02",
    title: "Mental Health Support",
    desc: "Afghan women and girls face severe depression and negative thinking under Taliban rule. We offer seminars on self-empowerment, helping them find ways to live better in these dark times. Some of these programs are conducted privately, providing counseling and support through our volunteers.",
  },
];

export const infiniteBannerData = [
  "Youth-led organization founded in Afghanistan ",
  "Focused on girls’ education and human rights ",
  "Community-based education initiatives ",
  "Youth participation and leadership development ",
  "Engagement through national and international platforms",
];
