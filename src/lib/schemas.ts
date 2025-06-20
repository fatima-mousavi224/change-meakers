import { z } from "zod";

const TeamCardSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  biography: z.string().min(1, "Biography is required"),
  link: z.string().optional(),
  showLinkInput: z.boolean().default(false),
  image: z.string().url().nullable().optional(),
  icon: z.string().url().nullable().optional(),
});

const StudentItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  biography: z.string().min(1, "Biography is required"),
  link: z.string().optional(),
  showLinkInput: z.boolean().default(false),
  image: z.string().url().nullable().optional(),
  icon: z.string().url().nullable().optional(),
});

const VoiceSchema = z.object({
  quote: z.string().min(1, "Quote is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().url().nullable().optional(),
});

const LiveMomentSchema = z.object({
  link: z.string().min(1, "Link is required"),
});

const RelatedLinkSchema = z.object({
  buttonName: z.string().min(1, "Button name is required"),
  buttonLink: z.string().min(1, "Button link is required"),
});

const NewsletterItemSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  url: z.string().optional(),
});

const OfferIconSchema = z.object({
  url: z.string().url({ message: "Invalid URL" }),
  iconTitle: z.string().optional(),
  shortDescription: z.string().optional(),
});

const UploadedFilesSchema = z.object({
  cardImage: z.string().url().optional(),
  heroImage: z.string().url().optional(),
  newsletterImage1: z.string().url().optional(),
  newsletterImage2: z.string().url().optional(),
});

export const ProjectSchema = z.object({
  projectTitle: z.string().min(1, "Project title is required"),
  cardDescription: z.string().min(1, "Card description is required"),
  heroTitle: z.string().min(1, "Hero title is required"),
  iconTitleStatus1: z.string().optional(),
  shortDescriptionStatus1: z.string().optional(),
  iconTitleStatus2: z.string().optional(),
  shortDescriptionStatus2: z.string().optional(),
  sectionTitleVoices: z.string().optional(),
  sectionDescriptionVoices: z.string().optional(),
  sectionTitleTeam: z.string().optional(),
  sectionDescriptionTeam: z.string().optional(),
  sectionTitleStudents: z.string().optional(),
  sectionDescriptionStudents: z.string().optional(),
  sectionTitleNewsletter: z.string().optional(),
  sectionDescriptionNewsletter: z.string().optional(),
  navigationLabel: z.string().optional(),
  showInMainNavigation: z.boolean().default(true),
  uploadedFiles: UploadedFilesSchema.optional(),
  teamCards: z.array(TeamCardSchema).optional(),
  studentItems: z.array(StudentItemSchema).optional(),
  voices: z.array(VoiceSchema).optional(),
  liveMoments: z.array(LiveMomentSchema).optional(),
  relatedLinks: z.array(RelatedLinkSchema).optional(),
  newsletterItems: z.array(NewsletterItemSchema).optional(),
  offerIcons: z.array(OfferIconSchema).optional(),
  iconPreview1: z.union([z.string().url(), z.null(), z.undefined()]).optional(),
  iconPreview2: z.union([z.string().url(), z.null(), z.undefined()]).optional(),
});
