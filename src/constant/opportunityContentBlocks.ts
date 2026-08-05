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

export function parseOpportunityContentBlocks(
  value: unknown,
): OpportunityContentBlock[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
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

export function legacyContentToBlocks(content: string): OpportunityTextBlock[] {
  return content
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((body) => ({ type: "text" as const, body }));
}
