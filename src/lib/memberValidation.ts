import { z } from "zod";

export const leadershipSocialSchema = z.object({
  type: z.enum(["website", "linkedin", "instagram", "x", "facebook"]),
  href: z.string().min(1, "URL is required"),
});

export const memberWriteSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  name: z.string().min(1, "Name is required"),
  role: z.string().optional().nullable(),
  bio: z.string().min(1, "Bio is required"),
  image: z.string().min(1, "Photo is required"),
  imageObjectPosition: z.string().optional().nullable(),
  socials: z.array(leadershipSocialSchema).optional().default([]),
  sortOrder: z.number().int().optional().default(0),
  published: z.boolean().optional().default(true),
});

export const memberUpdateSchema = memberWriteSchema.partial();
