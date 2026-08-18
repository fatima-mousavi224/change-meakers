import prisma from "@/lib/prismaDB";
import { isObjectId } from "@/utilities/slugify";

type ContentModel = "post" | "opportunity";

/** YYMMDD prefix from a publish date, e.g. 2026-08-18 -> "260818" */
export function formatPublicCodePrefix(date: Date) {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yy}${mm}${dd}`;
}

/** Full public code: YYMMDD + daily sequence (01, 02, ...). Example: 26081801 */
export function formatPublicCode(date: Date, dailySequence: number) {
  const prefix = formatPublicCodePrefix(date);
  const sequence = String(dailySequence).padStart(2, "0");

  return `${prefix}${sequence}`;
}

export function isPublicCode(value: string) {
  return /^\d{8}$/.test(value);
}

export function isNumericShortId(value: string) {
  return /^\d+$/.test(value);
}

async function getExistingCodesForPrefix(model: ContentModel, prefix: string) {
  if (model === "post") {
    return prisma.post.findMany({
      where: {
        shortId: {
          startsWith: prefix,
        },
      },
      select: { shortId: true },
    });
  }

  return prisma.opportunity.findMany({
    where: {
      shortId: {
        startsWith: prefix,
      },
    },
    select: { shortId: true },
  });
}

function getMaxDailySequence(
  records: Array<{ shortId: string | null }>,
  prefix: string,
) {
  let maxSequence = 0;

  for (const record of records) {
    const code = record.shortId;

    if (!code || !code.startsWith(prefix)) {
      continue;
    }

    if (code.length === 8) {
      const sequence = Number.parseInt(code.slice(6), 10);

      if (!Number.isNaN(sequence) && sequence > maxSequence) {
        maxSequence = sequence;
      }

      continue;
    }

    // Legacy numeric codes from the previous short-id rollout.
    const legacySequence = Number.parseInt(code, 10);

    if (!Number.isNaN(legacySequence) && legacySequence > maxSequence) {
      maxSequence = legacySequence;
    }
  }

  return maxSequence;
}

export async function assignPublicCode(model: ContentModel, publishDate: Date) {
  const prefix = formatPublicCodePrefix(publishDate);
  const existing = await getExistingCodesForPrefix(model, prefix);
  const nextSequence = getMaxDailySequence(existing, prefix) + 1;

  if (nextSequence > 99) {
    throw new Error("Daily publish limit reached for this date (max 99).");
  }

  return formatPublicCode(publishDate, nextSequence);
}

export async function ensurePostShortId(post: {
  id: string;
  shortId: string | null;
  postDate: Date | null;
  createdAt: Date;
}) {
  if (post.shortId) {
    return post.shortId;
  }

  const publishDate = post.postDate ?? post.createdAt;
  const shortId = await assignPublicCode("post", publishDate);

  await prisma.post.update({
    where: { id: post.id },
    data: { shortId },
  });

  return shortId;
}

export async function ensureOpportunityShortId(opportunity: {
  id: string;
  shortId: string | null;
  postedDate: Date | null;
  createdAt: Date;
}) {
  if (opportunity.shortId) {
    return opportunity.shortId;
  }

  const publishDate = opportunity.postedDate ?? opportunity.createdAt;
  const shortId = await assignPublicCode("opportunity", publishDate);

  await prisma.opportunity.update({
    where: { id: opportunity.id },
    data: { shortId },
  });

  return shortId;
}

export { isObjectId };
