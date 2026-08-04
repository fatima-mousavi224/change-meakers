import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SAMPLE_OPPORTUNITIES = [
  {
    title:
      "Read the story of Ahmad Zaki Safi: Ahmad Zaki Safi is a life coach, motivational public speaker and educator",
    excerpt:
      "Ahmad Zaki Safi is a life coach, motivational public speaker and educator supporting youth leadership development.",
    content:
      "This scholarship opportunity supports Afghan students interested in leadership, communication, and public speaking.\n\nApplicants should demonstrate a strong commitment to community engagement and educational growth. Selected participants will receive mentorship, application guidance, and support preparing for international education pathways.",
    category: "High School Scholarships",
    location: "Japan",
    image: "/images/update-component-image.jpg",
    deadline: new Date("2026-08-25T00:00:00.000Z"),
    applicationUrl: "https://example.com/apply",
  },
  {
    title:
      "Global Undergraduate Scholarship for Afghan Women in STEM Fields",
    excerpt:
      "A fully funded undergraduate scholarship for Afghan women pursuing science, technology, engineering, or mathematics.",
    content:
      "This program connects qualified Afghan women with accredited universities offering STEM degrees.\n\nSupport includes tuition guidance, language preparation resources, and mentorship from international educators.",
    category: "Undergraduate Scholarships",
    location: "Europe",
    image: "/images/update-component-image.jpg",
    deadline: new Date("2026-08-18T00:00:00.000Z"),
    applicationUrl: "https://example.com/stem-scholarship",
  },
  {
    title: "Online Learning Fellowship for Afghan Girls",
    excerpt:
      "A remote fellowship offering structured online courses, mentorship, and career guidance for Afghan girls.",
    content:
      "Participants join a cohort-based online learning program with live sessions, recorded lessons, and mentorship support.\n\nThe fellowship focuses on academic writing, digital skills, and personal development.",
    category: "Online Learning",
    location: "Online / Global",
    image: "/images/update-component-image.jpg",
    deadline: new Date("2026-09-01T00:00:00.000Z"),
    applicationUrl: "https://example.com/online-fellowship",
  },
  {
    title: "Master's Scholarship Preparation Program",
    excerpt:
      "Support for Afghan students preparing applications for master's programs abroad.",
    content:
      "This opportunity includes guidance on selecting programs, preparing statements of purpose, and navigating scholarship applications.\n\nSessions are delivered online with support from volunteer mentors and educators.",
    category: "Master's Scholarships",
    location: "North America",
    image: "/images/update-component-image.jpg",
    deadline: new Date("2026-10-10T00:00:00.000Z"),
    applicationUrl: "https://example.com/masters-prep",
  },
  {
    title: "Afghan Youth Leadership and Advocacy Fellowship",
    excerpt:
      "A leadership fellowship for Afghan youth interested in advocacy, civic engagement, and community initiatives.",
    content:
      "This fellowship brings together young leaders for workshops, discussion forums, and collaborative projects.\n\nParticipants gain skills in communication, teamwork, and public engagement while connecting with mentors and partner organizations.",
    category: "Fellowships and Leadership Programs",
    location: "Afghanistan",
    image: "/images/update-component-image.jpg",
    deadline: new Date("2026-08-30T00:00:00.000Z"),
    applicationUrl: "https://example.com/youth-fellowship",
  },
  {
    title: "Career Mentorship Program for Afghan Women",
    excerpt:
      "One-on-one mentorship connecting Afghan women with professionals in technology, education, and public service.",
    content:
      "Mentees receive personalized guidance on career planning, CV preparation, interview practice, and professional networking.\n\nThe program is delivered online and includes monthly mentorship sessions.",
    category: "Career and Mentorship",
    location: "Online / Global",
    image: "/images/update-component-image.jpg",
    deadline: new Date("2026-09-15T00:00:00.000Z"),
    applicationUrl: "https://example.com/mentorship",
  },
  {
    title: "Asia-Pacific High School Exchange Scholarship",
    excerpt:
      "A scholarship supporting Afghan high school students to participate in exchange programs across Asia.",
    content:
      "Selected students receive support with applications, travel preparation, and cultural orientation.\n\nThe program partners with schools and NGOs across the Asia region.",
    category: "High School Scholarships",
    location: "Asia",
    image: "/images/update-component-image.jpg",
    deadline: new Date("2026-07-20T00:00:00.000Z"),
    applicationUrl: "https://example.com/asia-exchange",
  },
  {
    title: "European Union Youth Education Grant",
    excerpt:
      "Funding for Afghan youth pursuing accredited educational programs at partner institutions in Europe.",
    content:
      "This grant covers application fees, language tests, and partial tuition support for eligible applicants.\n\nApplicants must demonstrate academic merit and commitment to community service.",
    category: "Undergraduate Scholarships",
    location: "Europe",
    image: "/images/update-component-image.jpg",
    deadline: new Date("2026-11-05T00:00:00.000Z"),
    applicationUrl: "https://example.com/eu-youth-grant",
  },
  {
    title: "Digital Skills Bootcamp for Afghan Girls",
    excerpt:
      "An intensive online bootcamp teaching coding, design, and digital literacy for Afghan girls.",
    content:
      "The bootcamp runs for 12 weeks with live instruction, project work, and career coaching.\n\nGraduates receive a certificate and access to internship referral networks.",
    category: "Online Learning",
    location: "Online / Global",
    image: "/images/update-component-image.jpg",
    deadline: new Date("2026-08-12T00:00:00.000Z"),
    applicationUrl: "https://example.com/digital-bootcamp",
  },
  {
    title: "Kabul Community Leadership Initiative",
    excerpt:
      "A local fellowship for young leaders in Afghanistan working on education and women's rights.",
    content:
      "Participants attend monthly workshops, mentorship sessions, and community project planning meetings.\n\nThe initiative supports grassroots advocacy and local partnership building.",
    category: "Fellowships and Leadership Programs",
    location: "Afghanistan",
    image: "/images/update-component-image.jpg",
    deadline: new Date("2026-09-22T00:00:00.000Z"),
    applicationUrl: "https://example.com/kabul-leadership",
  },
  {
    title: "North America Graduate Research Fellowship",
    excerpt:
      "Research fellowship for Afghan master's students pursuing graduate studies in North America.",
    content:
      "Fellows receive application support, research proposal guidance, and mentor matching with university faculty.\n\nPriority is given to applicants in education, public health, and social sciences.",
    category: "Master's Scholarships",
    location: "North America",
    image: "/images/update-component-image.jpg",
    deadline: new Date("2026-10-28T00:00:00.000Z"),
    applicationUrl: "https://example.com/graduate-fellowship",
  },
  {
    title: "Global Women's Empowerment Workshop Series",
    excerpt:
      "Free online workshops on leadership, public speaking, and career planning for Afghan women.",
    content:
      "Workshops are held weekly over two months with guest speakers from international organizations.\n\nParticipants can join from anywhere with internet access.",
    category: "Other Opportunities",
    location: "Online / Global",
    image: "/images/update-component-image.jpg",
    deadline: new Date("2026-08-08T00:00:00.000Z"),
    applicationUrl: "https://example.com/empowerment-workshops",
  },
];

const TARGET_OPPORTUNITY_COUNT = 12;

async function main() {
  const existingCount = await prisma.opportunity.count();

  if (existingCount >= TARGET_OPPORTUNITY_COUNT) {
    console.log(
      `Skipping seed: ${existingCount} opportunities already exist (target: ${TARGET_OPPORTUNITY_COUNT}).`,
    );
    return;
  }

  const dataToSeed = SAMPLE_OPPORTUNITIES.slice(existingCount);

  await prisma.opportunity.createMany({
    data: dataToSeed,
  });

  console.log(
    `Seeded ${dataToSeed.length} opportunities (${existingCount + dataToSeed.length} total).`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
