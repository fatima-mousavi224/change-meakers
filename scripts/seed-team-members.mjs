import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const EXECUTIVE_TEAM = [
  {
    slug: "jawid-amani",
    name: "Mohammad Jawid Amani",
    bio: "Mohammad Jawid Amani is the Founder and Executive Director of Change Makers of the World. He is responsible for the organization's strategic direction, program development, and external engagement related to education and youth-focused initiatives. His work has focused on education access and youth participation in Afghanistan, including coordination of community-based activities and engagement with national and international platforms.",
    image: "/images/about/jawid-amani.jpg",
    imageObjectPosition: "50% 38%",
    socials: [
      { type: "website", href: "https://www.jawidamani.com" },
      { type: "linkedin", href: "https://www.linkedin.com/in/jawidamani" },
      { type: "instagram", href: "https://www.instagram.com/jawid_amani" },
    ],
    sortOrder: 1,
  },
  {
    slug: "masuda-rahmati",
    name: "Masuda Rahmati",
    role: "President, US Chapter",
    bio: "Masuda Rahmati serves as President of Change Makers of the World in the United States. She supports organizational coordination, outreach, and engagement with U.S.-based partners, helping strengthen external relations and program support for CMW's education initiatives in Afghanistan. She has a background in business and authorship and is the author of Pain to Power: I Choose to Love Myself.",
    image: "/images/about/masuda-rahmati.png",
    imageObjectPosition: "50% 12%",
    socials: [{ type: "website", href: "https://www.masudarahmati.com" }],
    sortOrder: 2,
  },
  {
    slug: "reza-hussaini",
    name: "Mohammad Reza Hussaini",
    bio: "Mohammad Reza Hussaini supports Change Makers of the World through outreach and program related activities connected to education and youth initiatives in Afghanistan. Based in the United States, he contributes to external engagement and coordination with communities and partners. He is currently studying Political Science and has experience in media and entrepreneurship.",
    image: "/images/about/mohmad-reza-hosainii.png",
    imageObjectPosition: "50% 15%",
    socials: [
      { type: "x", href: "https://x.com/m_rezahussaini" },
      { type: "facebook", href: "https://www.facebook.com/RealRezaHussainii" },
    ],
    sortOrder: 3,
  },
  {
    slug: "jamshid-nazari",
    name: "Jamshid Nazari",
    role: "Programs Director",
    bio: "Jamshid Nazari supports Change Makers of the World by coordinating and managing program activities inside Afghanistan, especially in Kabul. He has experience in youth focused initiatives and public health related community work, with involvement in programs and events both inside Afghanistan and abroad.",
    image: "/images/about/jamshed-nazari.png",
    socials: [],
    sortOrder: 4,
  },
  {
    slug: "sayeed-mahdi-mousavi",
    name: "Sayeed Mahdi Mousavi",
    role: "Digital Operations Coordinator",
    bio: "Sayeed Mahdi Mousavi supports Change Makers of the World through website development, digital operations, and technical support. He also assists with the coordination of selected in-person activities inside Afghanistan. He holds a bachelor's degree in Computer Science and runs a technology company in Afghanistan.",
    image: "/images/about/mahdi-mousavi.png",
    socials: [
      {
        type: "linkedin",
        href: "https://www.linkedin.com/in/sayeed-mahdi-mousavi-7b4184200",
      },
    ],
    sortOrder: 5,
  },
  {
    slug: "masooma-hossaini",
    name: "Masooma Hossaini",
    role: "Girls Academy Manager",
    bio: "Masooma Hossaini directs the Afghan Girls Tech Academy in Herat, an in-person learning space for girls run by Change Makers of the World. She supports female students in learning computer skills and introductory coding in a safe educational environment. She has experience in computer related learning and helps manage the academy's daily activities and student support.",
    image: "/images/about/masoma-hosanii.png",
    socials: [
      {
        type: "linkedin",
        href: "https://www.linkedin.com/in/masooma-hossaini-28324b274",
      },
    ],
    sortOrder: 6,
  },
  {
    slug: "sima-gul-hassani",
    name: "Sima Gul Hassani",
    role: "Education & Scholarships Manager",
    bio: "Sima Gul Hassani supports Change Makers of the World by coordinating scholarship information and education opportunities for Afghan girls. She helps share national and international opportunities through CMW's networks, supporting students in accessing scholarships, learning programs, and other educational pathways. She also contributes to consultation meetings with Afghan girls and empowerment activities for Afghan female diaspora communities in Europe.",
    image: "/images/about/simagul-hsainii.png",
    socials: [
      {
        type: "linkedin",
        href: "https://www.linkedin.com/in/sima-gul-hassani-75397b28a",
      },
    ],
    sortOrder: 7,
  },
  {
    slug: "sajjad-mousavi",
    name: "Sajjad Mousavi",
    role: "UX/UI Designer",
    bio: "Sajjad Mousavi supports Change Makers of the World by designing and improving the organization's website and digital platforms. He creates clear, user-friendly interfaces, develops page layouts and prototypes, and helps ensure a consistent visual experience across the organization's online work. He also collaborates with the team on the continued development of CMW's digital projects.",
    image: "/images/about/sajjad-mousavi.png",
    socials: [
      {
        type: "linkedin",
        href: "https://www.linkedin.com/in/sajjad-mousavi-00b987292",
      },
    ],
    sortOrder: 8,
  },
];

async function main() {
  for (const member of EXECUTIVE_TEAM) {
    await prisma.member.upsert({
      where: { slug: member.slug },
      update: {
        name: member.name,
        role: member.role ?? null,
        bio: member.bio,
        image: member.image,
        imageObjectPosition: member.imageObjectPosition ?? null,
        socials: member.socials,
        sortOrder: member.sortOrder,
        published: true,
        position: member.role ?? "",
        description: member.bio,
      },
      create: {
        slug: member.slug,
        name: member.name,
        role: member.role ?? null,
        bio: member.bio,
        image: member.image,
        imageObjectPosition: member.imageObjectPosition ?? null,
        socials: member.socials,
        sortOrder: member.sortOrder,
        published: true,
        position: member.role ?? "",
        description: member.bio,
        avatar: [],
      },
    });
  }

  console.log(`Seeded ${EXECUTIVE_TEAM.length} executive team members.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
