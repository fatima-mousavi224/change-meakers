export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const OBJECT_ID_REGEX = /^[a-f0-9]{24}$/i;

export function isObjectId(value: string) {
  return OBJECT_ID_REGEX.test(value);
}

export function resolvePublicPathSegment(
  shortId: string | null | undefined,
  id: string,
) {
  if (shortId) {
    return shortId;
  }

  return id;
}
