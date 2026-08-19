import { z } from "zod";

import {
  blocksToPlainContent,
  legacyContentToBlocks,
  type OpportunityContentBlock,
} from "@/constant/opportunityContentBlocks";
import { opportunityContentBlockSchema } from "@/lib/opportunityValidation";

export function resolvePostContent(input: {
  description?: string;
  contentBlocks?: OpportunityContentBlock[];
}) {
  const contentBlocks =
    input.contentBlocks && input.contentBlocks.length > 0
      ? input.contentBlocks
      : legacyContentToBlocks(input.description ?? "");

  const description =
    input.description?.trim() || blocksToPlainContent(contentBlocks) || " ";

  return { description, contentBlocks };
}

export const postWriteSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    excerpt: z.string().min(1, "Excerpt is required"),
    author: z.string().min(1, "Author is required"),
    categoryId: z.string().min(1, "Category is required"),
    postDate: z.string().min(1, "Post date is required"),
    showInHome: z.boolean().optional(),
    authorImage: z.object({
      image: z.string().min(1, "Card image is required"),
    }),
    description: z.string().optional(),
    contentBlocks: z.array(opportunityContentBlockSchema).optional(),
  })
  .refine(
    (data) => {
      const { contentBlocks } = resolvePostContent(data);
      return contentBlocks.length > 0;
    },
    {
      message: "Add at least one content block",
      path: ["contentBlocks"],
    }
  );

export const postUpdateSchema = postWriteSchema
  .innerType()
  .partial()
  .refine(
    (data) => {
      if (!data.description && !data.contentBlocks) {
        return true;
      }

      const { contentBlocks } = resolvePostContent({
        description: data.description,
        contentBlocks: data.contentBlocks,
      });
      return contentBlocks.length > 0;
    },
    {
      message: "Add at least one content block",
      path: ["contentBlocks"],
    }
  );
