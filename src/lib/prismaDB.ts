import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var prismaSchemaVersion: number | undefined;
}

const PRISMA_SCHEMA_VERSION = 2;

function createClient() {
  return new PrismaClient();
}

function getClient() {
  if (process.env.NODE_ENV === "production") {
    if (!globalThis.prisma) {
      globalThis.prisma = createClient();
    }
    return globalThis.prisma;
  }

  if (
    !globalThis.prisma ||
    globalThis.prismaSchemaVersion !== PRISMA_SCHEMA_VERSION
  ) {
    globalThis.prisma = createClient();
    globalThis.prismaSchemaVersion = PRISMA_SCHEMA_VERSION;
  }

  return globalThis.prisma;
}

export default getClient();
