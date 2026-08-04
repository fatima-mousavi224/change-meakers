import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.opportunity.updateMany({
    where: {
      title: {
        contains: "Ahmad Zaki Safi",
      },
    },
    data: {
      location: "Kabul, Afghanistan",
      resourceProvider: "Mohammad Jawid Amani",
      mainSource: "https://www.whitehouse.gov/AfghanGirls",
      applicationUrl: "https://www.whitehouse.gov/AfghanGirls",
      postedDate: new Date("2026-07-04T00:00:00.000Z"),
      deadline: new Date("2026-07-01T00:00:00.000Z"),
    },
  });

  console.log(`Updated ${result.count} opportunity record(s) with detail hero data.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
