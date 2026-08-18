import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function inspect(collectionName) {
  const raw = await prisma.$runCommandRaw({
    find: collectionName,
    filter: {},
    limit: 5,
  });

  const docs = raw?.cursor?.firstBatch ?? [];

  console.log(`\n${collectionName} (${docs.length} sample docs):`);

  for (const doc of docs) {
    console.log({
      id: doc._id?.$oid,
      shortId: doc.shortId,
      shortIdType: typeof doc.shortId,
    });
  }
}

async function main() {
  await inspect("Post");
  await inspect("Opportunity");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
