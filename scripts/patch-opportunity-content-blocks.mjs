import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SAMPLE_CONTENT_BLOCKS = [
  {
    type: "text",
    body:
      "This scholarship opportunity supports Afghan students interested in leadership, communication, and public speaking. Applicants should demonstrate a strong commitment to community engagement and educational growth.",
  },
  {
    type: "text",
    body:
      "Selected participants will receive mentorship, application guidance, and support preparing for international education pathways. The program is designed to help students build confidence and share their stories with wider audiences.",
  },
  {
    type: "image",
    src: "/images/update-component-image.jpg",
    caption:
      "Students and mentors gather for a leadership session focused on communication and educational planning.",
  },
  {
    type: "text",
    body:
      "Ahmad Zaki Safi has supported many Afghan youth through coaching, public speaking workshops, and educational guidance. His work highlights the importance of voice, confidence, and opportunity for young learners.",
  },
  {
    type: "video",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    caption:
      "From Kabul to the World: Jawid Amani's fight for his Afghan sisters.",
  },
  {
    type: "text",
    body:
      "If you are interested in this opportunity, review the details carefully and share it with others who may benefit from the program.",
  },
  {
    type: "image",
    src: "/images/update-component-image.jpg",
    caption:
      "Educational spaces and community programs continue to create new pathways for Afghan girls and youth.",
  },
];

async function main() {
  const result = await prisma.opportunity.updateMany({
    where: {
      title: {
        contains: "Ahmad Zaki Safi",
      },
    },
    data: {
      contentBlocks: SAMPLE_CONTENT_BLOCKS,
    },
  });

  console.log(
    `Updated ${result.count} opportunity record(s) with sample content blocks.`,
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
