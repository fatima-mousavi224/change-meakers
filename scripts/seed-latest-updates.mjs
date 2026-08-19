import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SAMPLE_POSTS = [
  {
    title: "The United Nations Conference is happening in NY",
    description:
      "Change Makers of the World joins global leaders at the United Nations to advocate for youth empowerment and girls' education.",
    author: "CMW Team",
    postDate: new Date("2026-04-15T00:00:00.000Z"),
    categoryTitle: "Youth Empowerment",
    postImages: [{ image: "/images/update-component-image.jpg" }],
  },
  {
    title: "Advocating for inclusive education across communities",
    description:
      "Our latest advocacy campaign highlights the importance of safe learning spaces and equal opportunity for every child.",
    author: "CMW Team",
    postDate: new Date("2026-03-28T00:00:00.000Z"),
    categoryTitle: "Advocacy",
    postImages: [{ image: "/images/update-component-image.jpg" }],
  },
  {
    title: "New scholarships open for girls pursuing STEM education",
    description:
      "Applications are now open for our girls' education scholarship program supporting the next generation of changemakers.",
    author: "CMW Team",
    postDate: new Date("2026-02-10T00:00:00.000Z"),
    categoryTitle: "Girls' Education",
    postImages: [{ image: "/images/update-component-image.jpg" }],
  },
];

async function getOrCreateCategory(title) {
  const existing = await prisma.category.findFirst({ where: { title } });
  if (existing) return existing;

  return prisma.category.create({ data: { title } });
}

async function main() {
  const existingCount = await prisma.post.count();
  console.log(`Existing posts: ${existingCount}`);

  if (existingCount >= 3) {
    console.log("Already have 3+ posts. Nothing to seed.");
    return;
  }

  const postsToCreate = SAMPLE_POSTS.slice(existingCount);

  for (const sample of postsToCreate) {
    const category = await getOrCreateCategory(sample.categoryTitle);

    await prisma.post.create({
      data: {
        title: sample.title,
        description: sample.description,
        author: sample.author,
        postDate: sample.postDate,
        postImages: sample.postImages,
        categoryId: category.id,
        showInHome: true,
      },
    });

    console.log(`Created post: ${sample.title}`);
  }

  const total = await prisma.post.count();
  console.log(`Done. Total posts: ${total}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
