import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const email = process.argv[2];

if (!email) {
  console.error("Usage: node scripts/promote-admin.mjs <email>");
  process.exit(1);
}

try {
  const existing = await prisma.user.findUnique({ where: { email } });

  if (!existing) {
    console.log("NOT_FOUND");
    process.exit(1);
  }

  const updated = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  });

  console.log(
    JSON.stringify(
      {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
      },
      null,
      2
    )
  );
} finally {
  await prisma.$disconnect();
}
