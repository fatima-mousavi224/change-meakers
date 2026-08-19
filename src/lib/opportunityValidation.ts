import { z } from "zod";

import {
  blocksToPlainContent,
  legacyContentToBlocks,
  type OpportunityContentBlock,
} from "@/constant/opportunityContentBlocks";

export const opportunityContentBlockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("text"),
    body: z.string().min(1),
  }),
  z.object({
    type: z.literal("image"),
    src: z.string().min(1),
    caption: z.string().optional(),
  }),
  z.object({
    type: z.literal("video"),
    url: z.string().min(1),
    caption: z.string().optional(),
  }),
]);

export function resolveOpportunityContent(input: {
  content?: string;
  contentBlocks?: OpportunityContentBlock[];
}) {
  const contentBlocks =
    input.contentBlocks && input.contentBlocks.length > 0
      ? input.contentBlocks
      : legacyContentToBlocks(input.content ?? "");

  const content =
    input.content?.trim() || blocksToPlainContent(contentBlocks) || " ";

  return { content, contentBlocks };
}

export const opportunityWriteSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    excerpt: z.string().min(1, "Excerpt is required"),
    content: z.string().optional(),
    contentBlocks: z.array(opportunityContentBlockSchema).optional(),
    category: z.string().min(1, "Category is required"),
    location: z.string().min(1, "Location is required"),
    image: z.string().min(1, "Image is required"),
    detailImage: z.string().optional().nullable(),
    videoUrl: z.string().optional().nullable(),
    deadline: z.string().min(1, "Deadline is required"),
    applicationUrl: z.string().optional().nullable(),
    resourceProvider: z.string().optional().nullable(),
    mainSource: z.string().optional().nullable(),
    postedDate: z.string().optional().nullable(),
    published: z.boolean().optional(),
  })
  .refine(
    (data) => {
      const { contentBlocks } = resolveOpportunityContent(data);
      return contentBlocks.length > 0;
    },
    {
      message: "Add at least one content block",
      path: ["contentBlocks"],
    }
  );

export const opportunityUpdateSchema = opportunityWriteSchema
  .innerType()
  .partial()
  .refine(
    (data) => {
      if (!data.content && !data.contentBlocks) {
        return true;
      }

      const { contentBlocks } = resolveOpportunityContent({
        content: data.content,
        contentBlocks: data.contentBlocks,
      });
      return contentBlocks.length > 0;
    },
    {
      message: "Add at least one content block",
      path: ["contentBlocks"],
    }
  );
