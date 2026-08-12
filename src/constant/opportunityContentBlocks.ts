export type OpportunityTextBlock = {
  type: "text";
  body: string;
};

export type OpportunityImageBlock = {
  type: "image";
  src: string;
  caption?: string;
};

export type OpportunityVideoBlock = {
  type: "video";
  url: string;
  caption?: string;
};

export type OpportunityContentBlock =
  | OpportunityTextBlock
  | OpportunityImageBlock
  | OpportunityVideoBlock;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeTextBlock(value: Record<string, unknown>): OpportunityTextBlock | null {
  if (typeof value.body !== "string" || !value.body.trim()) {
    return null;
  }

  return { type: "text", body: value.body.trim() };
}

function normalizeImageBlock(
  value: Record<string, unknown>,
): OpportunityImageBlock | null {
  if (typeof value.src !== "string" || !value.src.trim()) {
    return null;
  }

  return {
    type: "image",
    src: value.src.trim(),
    caption: typeof value.caption === "string" ? value.caption.trim() : undefined,
  };
}

function normalizeVideoBlock(
  value: Record<string, unknown>,
): OpportunityVideoBlock | null {
  if (typeof value.url !== "string" || !value.url.trim()) {
    return null;
  }

  return {
    type: "video",
    url: value.url.trim(),
    caption: typeof value.caption === "string" ? value.caption.trim() : undefined,
  };
}

function ensureBlockArray(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (isRecord(value)) {
    const numericKeys = Object.keys(value)
      .filter((key) => /^\d+$/.test(key))
      .sort((a, b) => Number(a) - Number(b));

    if (numericKeys.length > 0) {
      return numericKeys.map((key) => value[key]);
    }
  }

  return [];
}

export function parseOpportunityContentBlocks(
  value: unknown,
): OpportunityContentBlock[] {
  const items = ensureBlockArray(value);

  return items
    .map((item) => {
      if (!isRecord(item) || typeof item.type !== "string") {
        return null;
      }

      switch (item.type) {
        case "text":
          return normalizeTextBlock(item);
        case "image":
          return normalizeImageBlock(item);
        case "video":
          return normalizeVideoBlock(item);
        default:
          return null;
      }
    })
    .filter((block): block is OpportunityContentBlock => block !== null);
}

export function legacyContentToBlocks(content: string): OpportunityContentBlock[] {
  return htmlContentToBlocks(content);
}

export function htmlContentToBlocks(content: string): OpportunityContentBlock[] {
  const trimmed = content.trim();
  if (!trimmed) {
    return [];
  }

  if (trimmed.includes("<")) {
    const normalized = trimmed
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/div>/gi, "\n\n")
      .replace(/<\/li>/gi, "\n\n");

    const stripped = normalized
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");

    return stripped
      .split(/\n\n+/)
      .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .map((body) => ({ type: "text" as const, body }));
  }

  return trimmed
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((body) => ({ type: "text" as const, body }));
}

export function blocksToPlainContent(blocks: OpportunityContentBlock[]): string {
  return blocks
    .filter((block): block is OpportunityTextBlock => block.type === "text")
    .map((block) => block.body.trim())
    .filter(Boolean)
    .join("\n\n");
}
