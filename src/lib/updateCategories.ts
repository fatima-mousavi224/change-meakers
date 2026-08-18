import {
  CATEGORY_TITLE_ALIASES,
  UPDATE_ASSIGNABLE_CATEGORIES,
} from "@/constant/updatesListing";
import prisma from "@/lib/prismaDB";

export type UpdateFormCategory = {
  id: string;
  title: string;
};

function findDbCategoryForLabel(
  label: (typeof UPDATE_ASSIGNABLE_CATEGORIES)[number],
  dbCategories: { id: string; title: string }[],
) {
  const aliases = CATEGORY_TITLE_ALIASES[label] ?? [label];
  return dbCategories.find((category) => aliases.includes(category.title));
}

export function buildUpdateFormCategories(
  dbCategories: { id: string; title: string }[],
): UpdateFormCategory[] {
  const usedIds = new Set<string>();

  return UPDATE_ASSIGNABLE_CATEGORIES.flatMap((label) => {
    const match = findDbCategoryForLabel(label, dbCategories);
    if (!match || usedIds.has(match.id)) return [];

    usedIds.add(match.id);
    return [{ id: match.id, title: label }];
  });
}

export async function getUpdateFormCategories(): Promise<UpdateFormCategory[]> {
  if (!process.env.DATABASE_URL) {
    return UPDATE_ASSIGNABLE_CATEGORIES.map((title, index) => ({
      id: String(index),
      title,
    }));
  }

  const existing = await prisma.category.findMany();

  for (const label of UPDATE_ASSIGNABLE_CATEGORIES) {
    if (findDbCategoryForLabel(label, existing)) continue;

    const created = await prisma.category.create({
      data: { title: label },
    });
    existing.push(created);
  }

  return buildUpdateFormCategories(existing);
}
