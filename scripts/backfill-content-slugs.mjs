import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function formatPublicCodePrefix(date) {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yy}${mm}${dd}`;
}

function formatPublicCode(date, dailySequence) {
  return `${formatPublicCodePrefix(date)}${String(dailySequence).padStart(2, "0")}`;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function nextDay(date) {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  return next;
}

async function backfillPosts() {
  const posts = await prisma.post.findMany({
    orderBy: [{ postDate: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      postDate: true,
      createdAt: true,
      shortId: true,
    },
  });

  const counters = new Map();
  let updated = 0;

  for (const post of posts) {
    if (post.shortId && /^\d{8}$/.test(post.shortId)) {
      continue;
    }

    const publishDate = post.postDate ?? post.createdAt;
    const prefix = formatPublicCodePrefix(publishDate);
    const nextSequence = (counters.get(prefix) ?? 0) + 1;
    counters.set(prefix, nextSequence);

    const shortId = formatPublicCode(publishDate, nextSequence);

    await prisma.post.update({
      where: { id: post.id },
      data: { shortId },
    });

    updated += 1;
  }

  return updated;
}

async function backfillOpportunities() {
  const opportunities = await prisma.opportunity.findMany({
    orderBy: [{ postedDate: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      postedDate: true,
      createdAt: true,
      shortId: true,
    },
  });

  const counters = new Map();
  let updated = 0;

  for (const opportunity of opportunities) {
    if (opportunity.shortId && /^\d{8}$/.test(opportunity.shortId)) {
      continue;
    }

    const publishDate = opportunity.postedDate ?? opportunity.createdAt;
    const prefix = formatPublicCodePrefix(publishDate);
    const nextSequence = (counters.get(prefix) ?? 0) + 1;
    counters.set(prefix, nextSequence);

    const shortId = formatPublicCode(publishDate, nextSequence);

    await prisma.opportunity.update({
      where: { id: opportunity.id },
      data: { shortId },
    });

    updated += 1;
  }

  return updated;
}

async function main() {
  const postCount = await backfillPosts();
  const opportunityCount = await backfillOpportunities();

  console.log(`Backfilled public URL codes for ${postCount} post(s).`);
  console.log(
    `Backfilled public URL codes for ${opportunityCount} opportunity(ies).`,
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
