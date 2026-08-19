import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function patchNullField(field, fallback = "") {
  const result = await prisma.$runCommandRaw({
    update: "Member",
    updates: [
      {
        q: {
          $or: [{ [field]: null }, { [field]: { $exists: false } }],
        },
        u: { $set: { [field]: fallback } },
        multi: true,
      },
    ],
  });

  return result;
}

async function backfillPositionFromRole() {
  const raw = await prisma.member.findRaw({
    filter: {
      $or: [{ position: null }, { position: "" }, { position: { $exists: false } }],
    },
  });

  if (!Array.isArray(raw)) {
    return 0;
  }

  let updated = 0;

  for (const doc of raw) {
    const id = doc._id?.$oid;
    const role = typeof doc.role === "string" ? doc.role.trim() : "";

    if (!id || !role) {
      continue;
    }

    await prisma.$runCommandRaw({
      update: "Member",
      updates: [
        {
          q: { _id: { $oid: id } },
          u: { $set: { position: role } },
        },
      ],
    });

    updated += 1;
  }

  return updated;
}

async function backfillMissingSlugs() {
  const raw = await prisma.member.findRaw({
    filter: {
      $or: [{ slug: null }, { slug: "" }, { slug: { $exists: false } }],
    },
  });

  if (!Array.isArray(raw)) {
    return 0;
  }

  let updated = 0;

  for (const doc of raw) {
    const id = doc._id?.$oid;
    const name = typeof doc.name === "string" ? doc.name.trim() : "";

    if (!id) {
      continue;
    }

    const slug =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || id;

    await prisma.$runCommandRaw({
      update: "Member",
      updates: [
        {
          q: { _id: { $oid: id } },
          u: { $set: { slug } },
        },
      ],
    });

    updated += 1;
  }

  return updated;
}

async function main() {
  await patchNullField("position", "");
  await patchNullField("description", "");
  const roleBackfills = await backfillPositionFromRole();
  const slugBackfills = await backfillMissingSlugs();

  console.log("Patched legacy member fields.");
  console.log(`Backfilled position from role for ${roleBackfills} member(s).`);
  console.log(`Backfilled slug for ${slugBackfills} member(s).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
