import { PhoneIcon } from "@heroicons/react/24/outline";
import { BiHomeAlt } from "react-icons/bi";
import { CiSettings } from "react-icons/ci";
import { FaCheck } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { LuPen } from "react-icons/lu";
import { MdComment, MdEmail } from "react-icons/md";
import human from "../public/images/mission/human.png";
import RSF from "../public/images/mission/RSF.jpg";
import girl1 from "../public/images/mission/girl1.png";
import girl2 from "../public/images/mission/girl2.png";
import girl3 from "../public/images/mission/girl3.png";
import iom from "../public/images/mission/iom.png";
import unesco from "../public/images/mission/unesco.png";
import img from "../public/images/photo/1.png";
import img2 from "../public/images/photo/2.png";
import img04 from "../public/images/photo/slidephoto/Army.png";
import img02 from "../public/images/photo/slidephoto/Conference.png";
import img03 from "../public/images/photo/slidephoto/Force.png";
import img01 from "../public/images/photo/slidephoto/UN.png";

import jawid from "../public/images/jawid.jpg";
import messi from "../public/images/messi.jpg";
import mohammad from "../public/images/mohammad.jpg";

import { HandCoins, UserPen, UserRoundCog } from "lucide-react";
import barakObama from "../public/images/barak-obama.jpg";
import billGates from "../public/images/bill-gates.jpg";
import bonnie from "../public/images/bonnie.jpg";
import dolores from "../public/images/dolores.jpg";
import einston from "../public/images/einston.jpg";
import eleanor from "../public/images/eleanor.jpg";
import gandi from "../public/images/gandi.jpg";
import johnKennedy from "../public/images/john.keneddy.jpg";
import Malala from "../public/images/Malala.jpg";
import margaret from "../public/images/margaret.jpg";
import marian from "../public/images/Marian.jpg";
import martin from "../public/images/martin.jpg";
import motherTeresa from "../public/images/mother-teresa.jpg";
import nel from "../public/images/nel.jpg";
import robin from "../public/images/robin.jpg";
import rowling from "../public/images/rowling.jpg";
import steve from "../public/images/steve.jpg";
import timeCook from "../public/images/TimeCook.jpg";

import customer1 from "../public/images/current-program/customer1.jpg";
import customer2 from "../public/images/current-program/customer2.jpg";
import customer3 from "../public/images/current-program/customer3.jpg";

// import DeleteAccount from '@/app/(site)/(user-dashboard)/dashboard/_components/account/DeleteAccount';
// import ProfileForm from '@/app/(site)/(user-dashboard)/dashboard/_components/account/ProfileForm';
// import ResetPasswordForm from '@/app/(site)/(user-dashboard)/dashboard/_components/account/ResetPasswordForm';

export const boardData = [
  {
    id: 1,
    avatar: "/images/jawid-new.jpg",
    name: "Mohammad Jawid Amani",
    position: "Founder",
    details: {
      image: "/images/jawid-amani-details.png",
      name: "Mohammad Jawid Amani",
      birthDate: "01.02 .2005",
      officialWebsite: "https://www.changemakers.org",
      description: [
        "Mohammad Jawid Amani is a 19-year-old Afghan leader deeply involved in both national and international initiatives. Born six years after the Afghan Civil War, he grew up facing significant social challenges and security threats. Despite these obstacles, he founded Change Makers of the World, a community that creates opportunities for young men and women to discuss and address pressing national and global issues.",
        "Mr. Amani has worked with various national and international NGOs, focusing on education and local development. He was a key advocate for positive, inclusive peace in Afghanistan, striving for a brighter future for the next generation.",
        "As a co-founder and member of the leadership committee of Afghanistan’s National Youth Consensus, Mr. Amani has provided a platform for Afghan youth to engage in meaningful discussions on national issues and participate in the Afghan Peace Process. This initiative also empowers women and youth by introducing them to global platforms through hands-on learning.",
        "In 2023, Jawid Amani has been recognized with the highest accolade a young person can achieve for social action or humanitarian efforts – The Diana Award from the UK. Later, on behalf of Change Makers of the World and the National Youth Consensus for Peace, he was also selected as a top finalist for the Carnegie Peace Prize 2023, held at the Great Hall of Justice, the courtroom for the United Nations International Court of Justice. His work has been widely covered by international media.",
        "Mr. Amani has also written several articles on human rights, peacebuilding, and youth empowerment for various publications and organizations. Follow Amani on X (formerly Twitter): @jawid_amani",
        "“My homeland! Your pains will end, and that day we will proudly live in your lap.” – Jawid Amani",
      ],
      relatedArticles: [
        { label: "BBC", url: "https://www.bbc.com" },
        { label: "AF International", url: "https://www.afinternational.org" },
        { label: "Tolo TV", url: "https://www.tolotv.com" },
      ],
    },
  },
  {
    id: 2,
    avatar: "/images/mohammad-reza.jpg",
    name: "Mohammad Reza Hussaini",
    position: "Founder",
    details: {
      image: "/images/mohammad-reza-details.png",
      name: "Mohammad Reza Hussaini",
      birthDate: "01.02 .2005",
      officialWebsite: "https://www.changemakers.org",
      description: [
        "Mohammad Reza Hussaini, currently based in the USA, is a leading advocate for peace, education, and human rights. He is the founder of the National Youth Consensus for Peace and Change Makers of the World. Additionally, he leads Peshtaaz LLC, an organization working on the Jobs4Peace initiative.",
        "Hussaini has partnered with local organizations, the Afghan government, and the international community to support and implement projects that promote human rights and peace. ",
        "“As Afghan society lags behind, I decided to step up my efforts. Alongside my school education, I began my social activities. I’ve had to make decisions beyond my years and work hard, but I’m grateful to have succeeded in helping my fellow Afghans,” said Hussaini.",
        "His deep involvement in Afghanistan's diplomatic peace process as a youth representative led to advocacy for meaningful youth inclusion in those discussions. In recognition of his efforts, Mohammad Reza Hussaini was honored with the Change Makers Award in 2021 for his contributions to human rights and peace in Afghanistan. Follow Hussaini on X (formerly Twitter): @M_RezaHussaini",
      ],
      relatedArticles: [
        { label: "BBC", url: "https://www.bbc.com" },
        { label: "AF International", url: "https://www.afinternational.org" },
        { label: "Tolo TV", url: "https://www.tolotv.com" },
      ],
    },
  },
  {
    id: 3,
    avatar: "/images/messie-new.jpg",
    name: "Massie Rahmati",
    position: "President - USA",
    details: {
      image: "/images/massie-details.png",
      name: "Massie Rahmati",
      birthDate: "01.02 .1969",
      officialWebsite: "https://www.changemakers.org",
      description: [
        "Massie Rahmati is a passionate women’s rights activist and advocate for Afghan women and girls. Born in Kabul, Afghanistan, in 1969, she fled the country with her family in 1980 due to the Russian invasion. After immigrating to the United States in 1982, she pursued her education and graduated with a bachelor's degree in Sociology with an emphasis in Social Psychology from the University of Santa Cruz, California.",
        "In 2005, Ms. Rahmati made headlines as the first Mrs. Afghanistan to compete in the Mrs. World Beauty Pageant, despite facing severe threats from the Taliban. Her activism focuses on raising awareness about the brutal conditions Afghan women and girls face under Taliban rule.",
        "Ms. Rahmati is the President of Change Makers of the World in the USA. She has been recognized by the United States Congress for her efforts to inspire women to embrace self-love, independence, education, and confidence. Today, she continues to advocate for human rights and stands in solidarity with the people of Afghanistan during these challenging times.",
      ],
      relatedArticles: [
        { label: "BBC", url: "https://www.bbc.com" },
        { label: "AF International", url: "https://www.afinternational.org" },
        { label: "Tolo TV", url: "https://www.tolotv.com" },
      ],
    },
  },
];

export const aboutData = [
  {
    id: 1,
    avatar: "/images/about/image1.jpg",
    name: "Our Mission & Impact",
    url: "/mission&impact",
  },
  {
    id: 2,
    avatar: "/images/logo.png",
    name: "Updates On Our Works",
    url: "/updates",
  },
  {
    id: 3,
    avatar: "/images/about/image2.jpg",
    name: "Current Programs",
    url: "/current-programs",
  },
];

export const teamData = [
  {
    id: 1,
    avatar: "/images/about/image3.jpg",
    name: "Mohammad Jawad Amini",
    position: "Founder of Change Makers",
    details: {
      image: "/images/about/details/person.png",
      name: "Mohammad Jawad Amini",
      description:
        "Jawid Amani is a 19 y/o Afghan young man that has been involved in country and international initiatives. He was born 6 years after the Civil War in Afghanistan. He is the founder of Change Makers of the World Organization who has created many opportunities for young men and women to discuss and help find solutions to ongoing ",
    },
  },
  {
    id: 2,
    avatar: "/images/about/image3.jpg",
    name: "Mahdi Mohammadi",
    position: "Developer of Change Makers",
    details: {
      image: "/images/about/details/person.png",
      name: "Mahdi Mohammadi",
      description:
        "Mahdi Mohammadi is a 23 y/o Afghan young man that has been involved in country and international initiatives. He was born 6 years after the Civil War in Afghanistan. He is the founder of Change Makers of the World Organization who has created many opportunities for young men and women to discuss and help find solutions to ongoing ",
    },
  },
  {
    id: 3,
    avatar: "/images/about/image3.jpg",
    name: "Mahdi Mohammadi",
    position: "Developer of Change Makers",
    details: {
      image: "/images/about/details/person.png",
      name: "Mahdi Mohammadi",
      description:
        "Mahdi Mohammadi is a 23 y/o Afghan young man that has been involved in country and international initiatives. He was born 6 years after the Civil War in Afghanistan. He is the founder of Change Makers of the World Organization who has created many opportunities for young men and women to discuss and help find solutions to ongoing ",
    },
  },
  {
    id: 4,
    avatar: "/images/about/image3.jpg",
    name: "Mahdi Mohammadi",
    position: "Developer of Change Makers",
    details: {
      image: "/images/about/details/person.png",
      name: "Mahdi Mohammadi",
      description:
        "Mahdi Mohammadi is a 23 y/o Afghan young man that has been involved in country and international initiatives. He was born 6 years after the Civil War in Afghanistan. He is the founder of Change Makers of the World Organization who has created many opportunities for young men and women to discuss and help find solutions to ongoing ",
    },
  },
  {
    id: 5,
    avatar: "/images/about/image3.jpg",
    name: "Mahdi Mohammadi",
    position: "Developer of Change Makers",
    details: {
      image: "/images/about/details/person.png",
      name: "Mahdi Mohammadi",
      description:
        "Mahdi Mohammadi is a 23 y/o Afghan young man that has been involved in country and international initiatives. He was born 6 years after the Civil War in Afghanistan. He is the founder of Change Makers of the World Organization who has created many opportunities for young men and women to discuss and help find solutions to ongoing ",
    },
  },
  {
    id: 6,
    avatar: "/images/about/image3.jpg",
    name: "Mahdi Mohammadi",
    position: "Developer of Change Makers",
    details: {
      image: "/images/about/details/person.png",
      name: "Mahdi Mohammadi",
      description:
        "Mahdi Mohammadi is a 23 y/o Afghan young man that has been involved in country and international initiatives. He was born 6 years after the Civil War in Afghanistan. He is the founder of Change Makers of the World Organization who has created many opportunities for young men and women to discuss and help find solutions to ongoing ",
    },
  },
  {
    id: 7,
    avatar: "/images/about/image3.jpg",
    name: "Mahdi Mohammadi",
    position: "Developer of Change Makers",
    details: {
      image: "/images/about/details/person.png",
      name: "Mahdi Mohammadi",
      description:
        "Mahdi Mohammadi is a 23 y/o Afghan young man that has been involved in country and international initiatives. He was born 6 years after the Civil War in Afghanistan. He is the founder of Change Makers of the World Organization who has created many opportunities for young men and women to discuss and help find solutions to ongoing ",
    },
  },
  {
    id: 8,
    avatar: "/images/about/image3.jpg",
    name: "Mahdi Mohammadi",
    position: "Developer of Change Makers",
    details: {
      image: "/images/about/details/person.png",
      name: "Mahdi Mohammadi",
      description:
        "Mahdi Mohammadi is a 23 y/o Afghan young man that has been involved in country and international initiatives. He was born 6 years after the Civil War in Afghanistan. He is the founder of Change Makers of the World Organization who has created many opportunities for young men and women to discuss and help find solutions to ongoing ",
    },
  },
];

export const updateData = [
  {
    id: 1,
    image: "/images/update/girl.png",
    date: "May 1 2023",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna.",
    details: {
      images: ["/images/update/girls.png", "/images/update/school-girls.png"],
      date: "May 1 2023",
      title: "charity,expectation vs.reality",
      description:
        "In this daily article, we have included a beautiful collection of meaningful English texts with Persian translation, we hope that these meaningful sentences will be of interest to you dear ones.",
      lists: [
        "Texts with English meanings are written with informative.",
        "and if you wish, you can put these texts",
        "and sentences in the caption and story section",
        "choose these beautiful English sentences",
      ],
    },
  },
  {
    id: 2,
    image: "/images/update/girl.png",
    date: "May 10 2023",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna.",
    details: {
      images: ["/images/update/girls.png", "/images/update/school-girls.png"],
      date: "May 10 2023",
      title: "charity,expectation vs.reality",
      description:
        "In this daily article, we have included a beautiful collection of meaningful English texts with Persian translation, we hope that these meaningful sentences will be of interest to you dear ones.",
      lists: [
        "Texts with English meanings are written with informative.",
        "and if you wish, you can put these texts",
        "and sentences in the caption and story section",
        "choose these beautiful English sentences",
      ],
    },
  },
  {
    id: 3,
    image: "/images/update/girl.png",
    date: "Jun 1 2023",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna.",
    details: {
      images: ["/images/update/girls.png", "/images/update/school-girls.png"],
      date: "Jun 1 2023",
      title: "charity,expectation vs.reality",
      description:
        "In this daily article, we have included a beautiful collection of meaningful English texts with Persian translation, we hope that these meaningful sentences will be of interest to you dear ones.",
      lists: [
        "Texts with English meanings are written with informative.",
        "and if you wish, you can put these texts",
        "and sentences in the caption and story section",
        "choose these beautiful English sentences",
      ],
    },
  },
  {
    id: 4,
    image: "/images/update/girl.png",
    date: "June 2 2020",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna.",
    details: {
      images: ["/images/update/girls.png", "/images/update/school-girls.png"],
      date: "June 2 2020",
      title: "charity,expectation vs.reality",
      description:
        "In this daily article, we have included a beautiful collection of meaningful English texts with Persian translation, we hope that these meaningful sentences will be of interest to you dear ones.",
      lists: [
        "Texts with English meanings are written with informative.",
        "and if you wish, you can put these texts",
        "and sentences in the caption and story section",
        "choose these beautiful English sentences",
      ],
    },
  },
  {
    id: 5,
    image: "/images/update/girl.png",
    date: "July 1 2023",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna.",
    details: {
      images: ["/images/update/girls.png", "/images/update/school-girls.png"],
      date: "July 1 2023",
      title: "charity,expectation vs.reality",
      description:
        "In this daily article, we have included a beautiful collection of meaningful English texts with Persian translation, we hope that these meaningful sentences will be of interest to you dear ones.",
      lists: [
        "Texts with English meanings are written with informative.",
        "and if you wish, you can put these texts",
        "and sentences in the caption and story section",
        "choose these beautiful English sentences",
      ],
    },
  },
  {
    id: 6,
    image: "/images/update/girl.png",
    date: "Feb 1 2023",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna.",
    details: {
      images: ["/images/update/girls.png", "/images/update/school-girls.png"],
      date: "Feb 1 2023",
      title: "charity,expectation vs.reality",
      description:
        "In this daily article, we have included a beautiful collection of meaningful English texts with Persian translation, we hope that these meaningful sentences will be of interest to you dear ones.",
      lists: [
        "Texts with English meanings are written with informative.",
        "and if you wish, you can put these texts",
        "and sentences in the caption and story section",
        "choose these beautiful English sentences",
      ],
    },
  },
];

export const instagramPosts = [
  {
    id: 1,
    avatar: img,
    author: "sajjad mousavi",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting ",
    image: "/images/update/Rectangle 14.png",
  },
  {
    id: 2,
    avatar: img2,
    author: "Aman Rezai",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting ",
    image: "/images/update/Rectangle 14 (1).png",
  },
  {
    id: 3,
    avatar: img,
    author: "Mahdi Mohammadi",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting ",
    image: "/images/update/Rectangle 14 (1).png",
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
    name: "Mission & Impact",
    href: "/mission&impact",
    icon: "/images/navbar/3.svg",
  },
  {
    name: "Programs",
    href: "/current-programs",
    icon: "/images/navbar/2.svg",
  },
  {
    name: "Updates",
    href: "/updates",
    icon: "/images/navbar/4.svg",
  },
  {
    name: "Contact Us",
    href: "/contact",
    icon: "/images/navbar/5.svg",
  },
];
export const importantButtons = [
  { name: " Donate ", href: "/donate", icon: PhoneIcon },
];
export const sliderData = [
  {
    image: jawid,
    desc: "Education is a fundamental human right, and quality education is the key to solving the world’s crises. No matter who you are or where you come from, seek knowledge, and inspire others to do the same. Through learning, you have the power to change the world.",
    name: "Mohammad Jawid Amani",
    labelTwo: "Human Rights and Quality Education Activist",
    label: "Founder of Change Makers of the World",
  },
  {
    image: mohammad,
    desc: "Investing in the education and development of young minds is important. Today’s children are tomorrow’s leaders, and by helping them grow, we build the foundation for a stronger, more hopeful future. When we support their growth, we are planting the seeds that will shape a better world for generations to come.",
    name: "Mohammad Reza Hussaini",
    labelTwo: "Entrepreneur and Human Rights Activist",
    label: " Founder of Change Makers of the World",
  },
  {
    image: messi,
    desc: "I have I chosen to Alchemize my pain into power by serving Humanity.",
    name: "Massie Rahmati",
    labelTwo: "Writer and Human Rights Activist",
    label: " President of CMW in USA",
  },
];

export const office = [
  {
    id: 1,
    title: "Our team",
    desc: "As the leader of our team, Jawed Amani guides and inspires the group with a vision for transforming the lives of girls through education.",
  },
  {
    id: 2,
    title: "Communications Specialist",
    desc: "the donation collection process, ensuring a seamless experience for our generous contributors. With a keen eye for detail and strong organizational.",
  },
  {
    id: 3,
    title: "Finance and Accountability Officer",
    desc: "the financial aspects of our operations, ensuring transparency and accountability in fund utilization.",
  },
  {
    id: 4,
    title: "Communications Specialist",
    desc: "the donation collection process, ensuring a seamless experience for our generous contributors. With a keen eye for detail and strong organizational.",
  },
];

export const newsSliderData = [
  {
    id: 1,
    title: "UN Conference",
    subtitle: "Our Young Leader In The Way Of Success",
    date: "05:06:2024",
    img: img01,
  },
  {
    id: 2,
    title: "United Nation Conference",
    subtitle: "Our Young Leader In The Way Of Success",
    date: "05:06:2024",
    img: img02,
  },
  {
    id: 3,
    title: "Afgan Forces",
    subtitle: "Our Young Leader In The Way Of Success",
    date: "05:06:2024",
    img: img03,
  },
  {
    id: 4,
    title: "Afgan Army",
    subtitle: "Our Young Leader In The Way Of Success",
    date: "05:06:2024",
    img: img04,
  },
];

export const timelineData = [
  {
    id: 1,
    title: "Education",
    subtitle: "Student support program for education in Kabul",
    desc: "Lorem ipsum dolor sit amet, consete sadipscing elitr, sed diam nonumy Lorem",
    impact: "impacted over:100 Students",
    img: girl1,
  },
  {
    id: 2,
    title: "Education",
    subtitle: "Textbook distribution program to affected students",
    desc: "Lorem ipsum dolor sit amet, consete sadipscing elitr, sed diam nonumy Lorem",
    impact: "impacted over:100 Students",
    img: girl2,
  },
  {
    id: 3,
    title: "Education",
    subtitle: "Distribution of lesson videos for students",
    desc: "Lorem ipsum dolor sit amet, consete sadipscing elitr, sed diam nonumy Lorem",
    impact: "impacted over:100 Students",
    img: girl3,
  },
];

export const counterdata = [
  {
    id: 1,
    number: 10000,
    desc: "People Benefited from Our Programs",
  },
  {
    id: 2,
    number: 186,
    desc: "Initiatives Launched",
  },
  {
    id: 3,
    number: 2000,
    desc: "School Materials Distributed",
  },
  {
    id: 4,
    number: 60000,
    desc: "Benefited from The Change eLibrary",
  },
];

// admin dashboard data
export const data = [
  { label: "Users", value: 300 },
  { label: "Active users", value: 100 },
  { label: "Posts", value: 10 },
  { label: "Team members", value: 12 },
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

export const categories = [
  { name: "All" },
  { name: "Programs" },
  { name: "Human Rights" },
  { name: "Education" },
  { name: "News" },
  { name: "Highlights" },
  { name: "Other" },
];

export const profileNotifications = [
  {
    id: 1,
    Icon: IoCall,
    count: 3,
    title: "Missed Call",
    subTitle: "+93-786-810-272",
  },
  {
    id: 2,
    Icon: MdEmail,
    count: 12,
    title: "E-Mail",
    subTitle: "sajjadmousavi345@gmail.com",
  },
  {
    id: 3,
    Icon: MdComment,
    count: 28,
    title: "Comments",
  },
];

export const BtnProfileNotifications = [
  {
    icon: FaCheck,
    name: "Review E-mail",
  },
  {
    name: "Review All Comments",
  },
];

export const DataComments = [
  {
    name: "Hamid Moradi",
    date: "2 mar,2024 at 09:12 am",
    text: "the donation collection process, ensuring a seamless experience for our generous contributors. With a keen eye for detail and strong organizational.",
  },
];

export const CardsData = [
  {
    quote:
      "Let us remember: One book, one pen, one child, and one teacher can change the world.",
    name: "Malala Yousafzai",
    position: "Girls'education activist, Nobel Peace Prize winner",
    image: Malala,
  },
  {
    quote:
      "Education is the most powerful weapon which you can use to change the world.",
    name: "Nelson Mandela",
    position: "Nobel Peace Prize winner",
    image: nel,
  },
  {
    quote: "Be the change you want to see in the world.",
    name: "Mahatma Gandhi",
    position: "Leader of the Indian independence movement",
    image: gandi,
  },
  {
    quote:
      "I have a dream that one day this nation will rise up and live out the true meaning of its creed: 'We hold these truths to be self-evident, that all men are created equal.",
    name: "Martin Luther King Jr.",
    position: "Nobel Peace Prize winner",
    image: martin,
  },
  {
    quote:
      "Change will not come if we wait for some other person or some other time. We are the ones we've been waiting for. We are the change that we seek.",
    name: "Barack Obama",
    position: "44th President of the United States",
    image: barakObama,
  },
  {
    quote:
      "Quality education can change Afghanistan and the world. We can make this dream come true.",
    name: "Mohammad Jawid Amani",
    position: "Human Rights and Quality Education Activist",
    image: jawid,
  },
  {
    quote:
      "Change is the law of life. And those who look only to the past or present are certain to miss the future.",
    name: "John F. Kennedy",
    position: "35th President of the United States",
    image: johnKennedy,
  },
  {
    quote:
      "Invest in the education and development of our youth. Today’s children are tomorrow’s leaders. By nurturing their growth, we plant the seeds for a brighter future.",
    name: "Mohammad Reza Hussaini",
    position: "Entrepreneur, Human Rights Activist",
    image: mohammad,
  },
  {
    quote:
      "If you embrace that the things that you can do are limitless, you can put your ding in the universe. You can change the world.",
    name: "Tim Cook",
    position: "CEO of Apple Inc.",
    image: timeCook,
  },
  {
    quote: "You really can change the world if you care enough.",
    name: "Marian Wright Edelman",
    position: "Founder of the Children's Defense Fund",
    image: marian,
  },
  {
    quote:
      "No matter what people tell you, words and ideas can change the world.",
    name: "Robin Williams",
    position: "Iconic actor and comedian",
    image: robin,
  },
  {
    quote:
      "Every moment is an organizing opportunity, every person a potential activist, every minute a chance to change the world.",
    name: "Dolores Huerta",
    position: "Labor leader and civil rights activist",
    image: dolores,
  },
  {
    quote:
      "In 1967 I entered Harvard as a freshman, confident - in the way that only 17-year-olds are - that I could change the world. My major was African Studies, and my plan was to travel to Tanzania, where President Julius Nyerere was creating a government based on democracy and socialism.",
    name: "Bonnie Raitt",
    position: "Singer-songwriter and guitarist",
    image: bonnie,
  },
  {
    quote:
      "We do not need magic to change the world, we carry all the power we need inside ourselves already: we have the power to imagine better.",
    name: "J.K. Rowling",
    position: "Author and advocate for social issues",
    image: rowling,
  },
  {
    quote:
      "Never doubt that a small group of thoughtful, committed citizens can change the world; indeed, it's the only thing that ever has.",
    name: "Margaret Mead",
    position: "Cultural anthropologist",
    image: margaret,
  },
  {
    quote:
      "The people who are crazy enough to think they can change the world are the ones who do.",
    name: "Steve Jobs",
    position: "Co-founder of Apple Inc.",
    image: steve,
  },
  {
    quote:
      "The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking.",
    name: "Albert Einston",
    position: "Theoretical physicist",
    image: einston,
  },
  {
    quote:
      "I alone cannot change the world, but I can cast a stone across the waters to create many ripples.",
    name: "Mother Teresa",
    position:
      "Catholic nun and missionary, founder of the Missionaries of Charity, Nobel Peace Prize winner",
    image: motherTeresa,
  },
  {
    quote: "It is better to light a candle than curse the darkness.",
    name: "Eleanor Roosevel",
    position: "Former First Lady of the United States and Diplomat",
    image: eleanor,
  },
  {
    quote:
      "We always overestimate the change that will occur in the next two years and underestimate the change that will occur in the next ten. Don't let yourself be lulled into inaction.",
    name: "Bill Gates",
    position: "Co-founder of Microsoft",
    image: billGates,
  },
];

export const changeMakersCardData = [
  {
    title: "Our Mission",
    desc: [
      "At Change Makers of the World, our mission is to provide Afghan girls with free access to education and essential resources, empowering them to achieve their full potential and break the cycle of oppression. We believe that education is a fundamental right and a powerful tool for social change. By offering scholarships, school supplies, and online learning resources, we aim to remove the barriers that prevent these young girls from attending school and pursuing their dreams.",
      "In addition to educational support, we provide mentorship, counseling, and healthcare assistance to ensure that each girl has the holistic support she needs to thrive. Our community outreach programs engage local leaders and families, fostering a supportive environment that values and promotes girl’s education. Together, we are working to create a brighter, more equitable future for Afghan girls, empowering them to become change makers in their communities and beyond.",
    ],
    image: "/images/about/WhatsApp-Image-2023-11-17-at-3.04 1.png",
  },
  {
    title: "Our Vision",
    desc: [
      "We are committed to breaking down the barriers that prevent Afghan girls from accessing quality education. By providing scholarships, educational resources, and comprehensive support, we aim to empower these young girls to overcome the challenges they face. Through our efforts, we strive to create a ripple effect that not only transforms individual lives but also uplifts entire communities, fostering a generation of educated, confident, and empowered women who can drive positive change in Afghanistan and beyond.",
    ],
    image: "/images/about/Frame.png",
  },
  {
    title: "Our Story",
    desc: [
      "Change Makers of the World was founded in response to the urgent need for educational opportunities for Afghan girls. Witnessing the profound impact of systemic oppression and conflict on the lives of these young girls, our founders were inspired to create an organization dedicated to breaking down the barriers to education. They recognized that access to education is not just a fundamental right but a critical pathway to empowerment, economic stability, and social change. By addressing these urgent needs, Change Makers of the World aims to provide hope and opportunity to Afghan girls, enabling them to build brighter futures for themselves and their communities.",
      "Our organization was built on the belief that every girl deserves the chance to learn and grow in a safe and supportive environment. We began by providing scholarships and school supplies, but soon expanded our efforts to include mentorship programs, psychological support, and healthcare services. Through partnerships with local schools, communities, and international organizations, we have been able to reach thousands of girls, offering them the resources and encouragement they need to succeed. Our commitment to these girls is unwavering, and we continue to innovate and expand our programs to meet the evolving challenges they face.",
    ],
    image:
      "/images/about/422259100_354890457320610_4502267349131949738_n 2.png",
  },
];

export const ourCoreValues = [
  {
    title: "Empowerment",
    desc: "We Believe in Powering Girls Through Education",
    image: "/images/about/images 2.png",
  },
  {
    title: "Equality",
    desc: "We Service For Gender Equality And Fight Against Discrimination",
    image: "/images/about/images 2.png",
  },
  {
    title: "Compassion",
    desc: "We Operate With Compassion And Understanding",
    image: "/images/about/images 2.png",
  },
  {
    title: "Integrity",
    desc: "We Upload The Highest Standards Of Integrity In All Our Actions",
    image: "/images/about/images 2.png",
  },
  {
    title: "community",
    desc: "We Work Hand-In-Hand With Local Communities To Create Sustainable Change",
    image: "/images/about/images 2.png",
  },
];

export const ourMissionAndImpact = [
  {
    title: "Our Mission and Impact",
    description: [
      "Our Impact: Our educational initiatives in Afghanistan have had a significant impact, benefiting around 10,000 individuals, primarily children, youths, and girls. The focus of our efforts has been on providing educational resources and support in a challenging environment. Despite facing social barriers, security threats, and restrictions from the Taliban, we achieved notable outcomes. We distributed thousands of books and educational materials, especially targeting girl students and those affected by war. Our support extended to funding small educational initiatives such as the Dynamic Girls for Change program and other similar projects. We facilitated online access to educational materials for 60,000 Afghans through an online library and established collaborations with schools to enhance learning. Our comprehensive programs, delivered both in person and online, covered school subjects and included teachings on rights, public speaking, empowerment, and self-awareness. In total, we conducted over 186 initiatives and assisted students in securing scholarships and preparing for them. The primary focus of our educational programs has been on girls and war-affected students, demonstrating our commitment to advancing education in Afghanistan despite numerous challenges.",
      "Change Makers of the World is dedicated to advancing human rights in Afghanistan, with a particular focus on women's and girls' rights and quality education. The current Taliban government’s oppressive rules severely restrict women’s access to education, employment, and public spaces. In response, we have strongly supported advocacy efforts against these repressive measures. We have actively collaborated with human rights organizations in Europe and America and engaged with international bodies such as Amnesty International and the United Nations. We sent open letters to the UN and its Secretary-General, António Guterres, and participated in international conferences to promote the rights of women and address broader human rights issues.",
      "Our advocacy also extends to protecting minority ethnic and religious groups in Afghanistan, such as the Hazara and Sikh communities, who face severe persecution and genocide. We have campaigned vigorously against these atrocities and the discriminatory laws targeting these communities. Additionally, we have worked to combat gender apartheid in Afghanistan by organizing and presenting numerous projects, including conferences, seminars, and educational classes, aimed at raising awareness about human rights, self-empowerment, and gender equality for Afghan girls and the broader population. Our collaboration with human rights organizations across Europe and America underscores our commitment to the freedom and rights of the Afghan people.",
    ],
    image: "/images/about/Frame.jpg",
  },
];

export const ourGoals = [
  {
    icon: human,
    description:
      'The United Nations reported that Taliban restrictions on the rights of women and girls have "effectively trapped" most of them in their homes, making Afghanistan the "most repressive" country in the world for women.',
    href: "https://www.voanews.com/a/un-taliban-run-afghanistan-becomes-world-s-most-repressive-nation-for-women-/6995453.html",
  },
  {
    icon: iom,
    description:
      "The International Organization for Migration (IOM) reports that nearly eight million Afghan citizens have migrated since 2020, with 85% of them moving to neighboring countries.",
    href: "https://missingmigrants.iom.int/sites/g/files/tmzbdl601/files/publication/file/A%20decade%20of%20documenting%20migrant%20deaths.pdf",
  },
  {
    icon: unesco,
    description:
      "A recent survey conducted in April this year by UNICEF found that there are 7.8 million children out of school in Afghanistan, with 80% of Afghan school-age girls—about 2.5 million—being denied their right to education. Approximately half of children of primary school age are enrolled, and only one-fifth of those of secondary school age are in school.",
    href: "https://www.unesco.org/en/articles/250-million-children-out-school-what-you-need-know-about-unescos-latest-education-data",
  },
  {
    icon: RSF,
    description:
      "Reporters Without Borders stated that Afghanistan is the third worst country in the world for press freedom under the Taliban. Afghanistan is described as the “most repressive country” in South Asia, according to Célia Mercier, who covers the region for RSF.",
    href: "https://www.voanews.com/a/afghanistan-third-worst-in-world-for-press-freedom/7596697.html",
  },
];

export const ourPrograms = [
  {
    label: "ELibrary",
    title: "eLibrary",
    description:
      "Our online platform, The Change eLibrary, operates on Telegram with two channels: one for general updates and another for group discussions. With around 60,000 users and over 4,000 active members daily, we offer a vast archive of books and educational materials. Afghan users, including girls, frequently request resources, and our volunteers work to fulfill these requests. Additionally, we host programs to raise awareness, reaching thousands in the community. This support is crucial for students and girls in Afghanistan, where many resources are otherwise unavailable.",
  },
  {
    label: "Scholarship Support",
    title: "Scholarship Support",
    description:
      "Given the situation in Afghanistan, several institutions in Europe and America are offering scholarships specifically for Afghan students, particularly girls. However, many lack the information needed to apply for these opportunities. To address this, we provide voluntary guidance to help them find and secure scholarships. We collaborate with organizations inside Afghanistan, as well as with institutions and student organizations in Europe, to support Afghan girls in the scholarship application process. This includes assistance with application preparation, interviews, and necessary documentation. We support selected students who meet the criteria for academic excellence, language proficiency, and proper documentation throughout the entire process.",
  },
  {
    label: "Educational Resources",
    title: "Educational Resources",
    description:
      "We regularly purchase or receive donations of hundreds of books and school materials for our programs in Afghanistan. These resources are distributed to schools and students affected by the conflict or restricted by current regulations. We focus on identifying students in need, including those who are street workers, orphans, or girls banned from attending school. In addition to school textbooks, we provide general reference books and science materials. For example, before the Taliban takeover, we supported Sayyid al-Shahada High School, which had been bombed by terrorist groups, resulting in the deaths of several students and girls.",
  },
  {
    label: "Continuing Education",
    title: "Continuing Education",
    description:
      "Unfortunately, girls from 7th grade and above are banned from attending school in Afghanistan. However, we have partnered with a council of schools in Western Kabul, which recorded lessons and created an archive of educational materials. Through this collaboration, we accessed these resources and distributed them to students via a robust platform. We also have teachers who assist these students by addressing their questions, checking homework, and providing additional support. In addition, we offer numerous online and in-person classes in Afghanistan, including language, empowerment, science subjects, and preparation for university and scholarships.",
  },
];

export const sucessStories = [
  {
    name: "Amina Rahimi",
    text: "Through these classes, I've found a new strength within me. The support and knowledge have given me the courage to pursue my dreams and help my community.",
  },
  {
    name: "Laila",
    text: "Before joining these programs, I felt isolated in my struggles. Now, I know I am part of a larger movement, and that gives me hope and determination.",
  },
  {
    name: "Zahra",
    text: "The empowerment classes have taught me to believe in myself and my abilities. I now see a future where I can contribute meaningfully to society",
  },
  {
    name: "Mina",
    text: "Learning new skills and connecting with other girls has been life-changing. I feel more confident and ready to take on the challenges in my path.",
  },
  {
    name: "Fatima",
    text: "These programs have opened doors for me that I never thought possible. The education and support have ignited a passion in me to excel and make a difference.",
  },
  {
    name: "Sarina",
    text: "Participating in these seminars has shown me the power of community. Together, we can overcome obstacles and achieve our goals.",
  },
  {
    name: "Nadia",
    text: "The online classes were a lifeline for me. They provided not only knowledge but also a sense of belonging and hope during difficult times.",
  },
  {
    name: "Roya Faridi",
    text: "Being part of this initiative has been incredibly inspiring. It has taught me that with perseverance and support, we can transform our dreams into reality.",
  },
  {
    name: "Samira Mohammadi",
    text: "The self-awareness sessions helped me understand my worth and potential. I now feel more equipped to advocate for myself and others.",
  },
  {
    name: " Hawa R",
    text: "This program has been a beacon of hope in my life. The education and encouragement have empowered me to envision a brighter future for myself and my peers.",
  },
];
export const defaultImages = [
  "https://images.unsplash.com/photo-1710505904400-fd061f3c9ff5?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1713458101343-ae063854e754?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

export const InPersonEducationData = [
  {
    title: "In-Person Education",
    description:
      "In-Person Education At Change Makers of the World, our mission is to provide Afghan girls with free access to education and essential resources, empowering them to achieve their full potential and break the cycle of oppression. We believe that education is a fundamental right and a powerful tool for social change. By offering scholarships, school supplies, and online learning resources, we aim to remove the barriers that prevent these young girls from attending school and pursuing their dreams.In addition to educational support, we provide mentorship, counseling, and healthcare assistance to ensure that each girl has the holistic support she needs to thrive. Our community outreach programs engage local leaders and families, fostering a supportive environment that values and promotes girl’s education. Together, we are working to create a brighter, more equitable future for Afghan girls, empowering them to become change makers in their communities and beyond.",
    imageSrc: img01,
  },
  {
    title: "In-Person Education",
    description:
      "In-Person Education At Change Makers of the World, our mission is to provide Afghan girls with free access to education and essential resources, empowering them to achieve their full potential and break the cycle of oppression. We believe that education is a fundamental right and a powerful tool for social change. By offering scholarships, school supplies, and online learning resources, we aim to remove the barriers that prevent these young girls from attending school and pursuing their dreams.In addition to educational support, we provide mentorship, counseling, and healthcare assistance to ensure that each girl has the holistic support she needs to thrive. Our community outreach programs engage local leaders and families, fostering a supportive environment that values and promotes girl’s education. Together, we are working to create a brighter, more equitable future for Afghan girls, empowering them to become change makers in their communities and beyond.",
    imageSrc: img01,
  },
];
export const OnlineEducationData = [
  {
    title: "In-Person Education",
    description:
      "In-Person Education At Change Makers of the World, our mission is to provide Afghan girls with free access to education and essential resources, empowering them to achieve their full potential and break the cycle of oppression. We believe that education is a fundamental right and a powerful tool for social change. By offering scholarships, school supplies, and online learning resources, we aim to remove the barriers that prevent these young girls from attending school and pursuing their dreams.In addition to educational support, we provide mentorship, counseling, and healthcare assistance to ensure that each girl has the holistic support she needs to thrive. Our community outreach programs engage local leaders and families, fostering a supportive environment that values and promotes girl’s education. Together, we are working to create a brighter, more equitable future for Afghan girls, empowering them to become change makers in their communities and beyond.",
    imageSrc: img01,
  },
  {
    title: "In-Person Education",
    description:
      "In-Person Education At Change Makers of the World, our mission is to provide Afghan girls with free access to education and essential resources, empowering them to achieve their full potential and break the cycle of oppression. We believe that education is a fundamental right and a powerful tool for social change. By offering scholarships, school supplies, and online learning resources, we aim to remove the barriers that prevent these young girls from attending school and pursuing their dreams.In addition to educational support, we provide mentorship, counseling, and healthcare assistance to ensure that each girl has the holistic support she needs to thrive. Our community outreach programs engage local leaders and families, fostering a supportive environment that values and promotes girl’s education. Together, we are working to create a brighter, more equitable future for Afghan girls, empowering them to become change makers in their communities and beyond.",
    imageSrc: img01,
  },
];

export const infiniteBannerData = [
  "Be a part of the change—your action matters",
  "Together, we can change the world ",
  "Change Makers of the World fights for human rights and educational equality in Afghanistan and beyond",
];

export const currentPrograms = [
  {
    // title: 'what our Customers say',
    // subtitle: 'What we have done  &',
    description: [
      "1. We are currently running in-person schools and educational classes across Afghanistan. Even with strict rules and bans from the Taliban, we are carefully organizing our classes in various provinces, including Kabul, Herat, and Ghazni. We cannot share exact locations or details for safety reasons. Our efforts are made possible through partnerships with schools in cities like Kabul, where we offer classes for girls, even with many limitations. In addition to these partnerships, we also operate independent classes, such as those in Herat, where we educate children and girls.",
      "2. Given the current situation in Afghanistan, our primary focus is on online education for women who are banned from attending school. We offer online classes led by teachers from Europe and America. These classes are available in various formats, including independent and partnership collaborations.",
    ],
    image: "/images/current-program/Frame 1000006032.png",
  },
  {
    // title: 'what our Customers say',
    // subtitle: 'What we have done  &',
    description: [
      "3. Through collaboration with a schools union in western Kabul, we have gained access to more than 70% of recorded school subject lessons. Using these videos, we deliver organized lessons to our students via our platform.",
      "4. We also provide funding for books and school supplies to students and schools, prioritizing war-affected children and girls. We organize book drives and distribute the collected books to students in need.",
      "5. We operate an online library—The Change eLibrary—serving Afghan students across the country. With a network of over 60,000 students, we provide books and educational materials daily through an organized online platform managed by volunteers.",
    ],
    image: "/images/current-program/women.png",
  },
  {
    // title: 'what our Customers say',
    // subtitle: 'What we have done  &',
    description: [
      "6. Change Makers of the World is proud to offer both online and in-person programs aimed at securing scholarships for Afghan students, particularly girls, to study abroad. So far, nine students have secured scholarships outside Afghanistan. This initiative is ongoing, preparing students for opportunities to pursue their dreams abroad. We carefully select scholarship candidates based on their performance in science subjects (Math, Physics, Chemistry, Biology) and English language proficiency. Applications are not publicly accepted; instead, we review and select participants from our existing educational programs. This is a rigorous process but one of our most impactful initiatives.",
      "7. Our lessons cover school subjects, arts, language classes, and empowerment programs. Unfortunately, due to Taliban restrictions, we cannot provide official graduation certificates. However, our documents can support our students in their future academic pursuits, such as applying for scholarships abroad. While our programs help many Afghan girls, online education can never fully replace the experience of learning in a traditional school setting.",
    ],
    image: "/images/current-program/labtop.jpg",
  },
  {
    // title: 'what our Customers say',
    // subtitle: 'What we have done  &',
    description: [
      "8. We support injured and war-affected girl students from Afghanistan who are now in Turkey for education and medical treatment. Change Makers of the World plays a key role in helping them survive and continue their education.",
      "9. We collaborate with German and American organizations to advocate for the human rights of Afghan women. Our goal is to raise their voices on the international stage. We participate in human rights programs, issue statements, and write open letters to international communities, seeking help for the humanitarian crisis in Afghanistan. We also run a secure, restricted program to gather and report on the current situation of women and girls in Afghanistan, with input from activists across 16 provinces. The final statements, written by Afghan women and girls deprived of their rights, will be shared globally. We also advocate for refugee rights in Europe and America.",
    ],
    image:
      "/images/current-program/compressed_1f565f66dd1e269b7f5673c9b6396474 1.png",
  },
  {
    // title: 'what our Customers say',
    // subtitle: 'What we have done  &',
    description: [
      "10. As a non-political and non-religious volunteer community, we support advocacy against gender apartheid in Afghanistan and the genocide against the Hazara people. We are among the primary groups in our kind recognizing the #EndGenderApartheidinAfghanistan, #LetAfghanGirlsLearn, and #StopHazaraGenocide movements. We encourage other international organizations to join these human rights efforts. For inquiries, please contact us.",
      "11. We provide financial support to families affected by the humanitarian crisis in Afghanistan. Although our focus is on defending human rights and educating girls, we offer this financial aid on a small scale.",
      "12. Afghan women and girls face severe depression and negative thinking under Taliban rule. We offer seminars on self-empowerment, helping them find ways to live better in these dark times. Some of these programs are conducted privately, providing counseling and support through our volunteers.",
    ],
    image: "/images/current-program/pepar.jpg",
  },
];

export const dashboardActions = [
  {
    title: "Add Donation",
    description:
      "Make a meaningful impact by contributing to our cause. Your generous donation, no matter the size, helps us create positive change in the world. Join our community of changemakers and be part of something bigger than yourself.",
    icon: UserPen,
    link: "/donate",
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

// export const accountTabs = [
//   { name: 'Profile', component: ProfileForm },
//   { name: 'Password', component: ResetPasswordForm },
//   { name: 'Delete Account', component: DeleteAccount }
// ];

export const customersSliderCardData = [
  {
    image: customer1,
    name: "International Day of Peace",
    desc: "In Kabul, we celebrated the International Day of Peace with a group of Afghan children, most of whom are orphans or child laborers. Through an organized program, we aimed to support these children by providing educational materials, financial assistance, and promoting their access to education.",
  },
  {
    image: customer3,
    name: "Hundreds of Book Donations",
    desc: "As part of a large national campaign, we successfully collected and purchased hundreds of books, which were donated to the students of Sayed Al-Shuhada High School in Kabul. This initiative followed the tragic terrorist attack that claimed the lives of over 60 girls and young students.",
  },
  {
    image: customer2,
    name: "Meeting with Diplomats and Activists",
    desc: "We met with Afghan youth activists at Sapidar Palace in Kabul, in coordination with the U.S. Embassy and the National Peace and Reconciliation Council. This meeting focused on collaborative efforts to support peace and youth engagement in the region.",
  },
];
