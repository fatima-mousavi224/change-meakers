import { resolvePublicPathSegment } from "@/utilities/slugify";

export type UpdateLink = {
  id: string;
  shortId?: string | null;
};

export function isSafeInternalReturnPath(path: string | null | undefined) {
  if (!path) return false;
  if (!path.startsWith("/") || path.startsWith("//")) return false;
  return !path.startsWith("/updates/");
}

export function getUpdateDetailPath(update: UpdateLink | string) {
  if (typeof update === "string") {
    return `/updates/${update}`;
  }

  return `/updates/${resolvePublicPathSegment(update.shortId, update.id)}`;
}

export function buildUpdateDetailHref(
  update: UpdateLink | string,
  returnPath?: string | null,
) {
  const base = getUpdateDetailPath(update);

  if (!isSafeInternalReturnPath(returnPath)) {
    return base;
  }

  return `${base}?from=${encodeURIComponent(returnPath!)}`;
}
