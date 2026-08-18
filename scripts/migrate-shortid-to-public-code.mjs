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

async function readCollection(collectionName) {
  const raw = await prisma.$runCommandRaw({
    find: collectionName,
    filter: {},
  });

  return raw?.cursor?.firstBatch ?? [];
}

async function migrateCollection(collectionName, model, getPublishDate) {
  const docs = await readCollection(collectionName);
  const counters = new Map();
  let updated = 0;

  const sorted = docs.sort((a, b) => {
    const aDate = getPublishDate(a);
    const bDate = getPublishDate(b);
    return aDate.getTime() - bDate.getTime();
  });

  for (const doc of sorted) {
    const id = doc._id?.$oid;

    if (!id) {
      continue;
    }

    const currentShortId = doc.shortId;

    if (
      typeof currentShortId === "string" &&
      /^\d{8}$/.test(currentShortId)
    ) {
      continue;
    }

    const publishDate = getPublishDate(doc);
    const prefix = formatPublicCodePrefix(publishDate);
    const nextSequence = (counters.get(prefix) ?? 0) + 1;
    counters.set(prefix, nextSequence);

    const shortId = formatPublicCode(publishDate, nextSequence);

    await prisma.$runCommandRaw({
      update: collectionName,
      updates: [
        {
          q: { _id: { $oid: id } },
          u: { $set: { shortId } },
        },
      ],
    });

    updated += 1;
  }

  return updated;
}

async function main() {
  const postCount = await migrateCollection("Post", "post", (doc) => {
    if (doc.postDate?.$date) {
      return new Date(doc.postDate.$date);
    }

    if (doc.createdAt?.$date) {
      return new Date(doc.createdAt.$date);
    }

    return new Date();
  });

  const opportunityCount = await migrateCollection(
    "Opportunity",
    "opportunity",
    (doc) => {
      if (doc.postedDate?.$date) {
        return new Date(doc.postedDate.$date);
      }

      if (doc.createdAt?.$date) {
        return new Date(doc.createdAt.$date);
      }

      return new Date();
    },
  );

  console.log(`Migrated ${postCount} post URL code(s).`);
  console.log(`Migrated ${opportunityCount} opportunity URL code(s).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
