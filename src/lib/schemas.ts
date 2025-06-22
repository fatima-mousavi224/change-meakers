import { z } from "zod";

const TeamCardSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  biography: z.string().min(1, "Biography is required"),
  link: z.string().optional(),
  showLinkInput: z.boolean().default(false),
  image: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
});

const StudentItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  biography: z.string().min(1, "Biography is required"),
  link: z.string().optional(),
  showLinkInput: z.boolean().default(false),
  image: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
});

const VoiceSchema = z.object({
  quote: z.string().min(1, "Quote is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().nullable().optional(),
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
  url: z.string(),
  iconTitle: z.string().optional(),
  shortDescription: z.string().optional(),
});

const UploadedFilesSchema = z.object({
  cardImage: z.string().optional(),
  heroImage: z.string().optional(),
  visionGoalImage1: z.string().optional(),
  visionGoalImage2: z.string().optional(),
  visionGoalImage3: z.string().optional(),
  visionGoalImage4: z.string().optional(),
  mediaHeroImage: z.string().optional(),
  photoAlbumImage1: z.string().optional(),
  photoAlbumImage2: z.string().optional(),
  photoAlbumImage3: z.string().optional(),
  photoAlbumImage4: z.string().optional(),
  newsletterImage1: z.string().optional(),
  newsletterImage2: z.string().optional(),
  sdgsImage1: z.string().optional(),
  sdgsImage2: z.string().optional(),
  sdgsImage3: z.string().optional(),
  sdgsImage4: z.string().optional(),
});

export const ProjectSchema = z.object({
  projectTitle: z.string().min(1, "Project title is required"),
  cardDescription: z.string().min(1, "Card description is required"),
  heroTitle: z.string().min(1, "Hero title is required"),
  // Hero Section Fields
  subheading: z.string().optional(),
  slogan: z.string().optional(),
  buttonName: z.string().optional(),
  buttonLink: z.string().optional(),
  // Status & Icons Fields
  iconTitleStatus1: z.string().optional(),
  shortDescriptionStatus1: z.string().optional(),
  iconTitleStatus2: z.string().optional(),
  shortDescriptionStatus2: z.string().optional(),
  // Vision & Goal Section
  visionTitle: z.string().optional(),
  visionText: z.string().optional(),
  goalTitle: z.string().optional(),
  goalText: z.string().optional(),
  // About Program Section
  sectionTitleAbout: z.string().optional(),
  bodyText: z.string().optional(),
  buttonName2: z.string().optional(),
  buttonLink2: z.string().optional(),
  // Voices Section
  sectionTitleVoices: z.string().optional(),
  sectionDescriptionVoices: z.string().optional(),
  // Media Block Section
  heroTitleMedia: z.string().optional(),
  shortDescriptionMedia: z.string().optional(),
  videoLink: z.string().optional(),
  fullVideoDescription: z.string().optional(),
  // Team Section
  sectionTitleTeam: z.string().optional(),
  sectionDescriptionTeam: z.string().optional(),
  // Students Section
  sectionTitleStudents: z.string().optional(),
  sectionDescriptionStudents: z.string().optional(),
  // Quotation Section
  addQuote: z.string().optional(),
  nameRole: z.string().optional(),
  // Photo Album Section
  sectionTitlePhoto: z.string().optional(),
  sectionDescriptionPhoto: z.string().optional(),
  // Newsletter Section
  sectionTitleNewsletter: z.string().optional(),
  sectionDescriptionNewsletter: z.string().optional(),
  // Global Goals (SDGs) Section
  sectionTitleSDGs: z.string().optional(),
  sectionTextSDGs: z.string().optional(),
  // Final Call to Action
  finalStatement: z.string().optional(),
  // Navigation
  navigationLabel: z.string().optional(),
  showInMainNavigation: z.boolean().default(true),
  // Uploaded files and related data
  uploadedFiles: UploadedFilesSchema.optional(),
  teamCards: z.array(TeamCardSchema).optional(),
  studentItems: z.array(StudentItemSchema).optional(),
  voices: z.array(VoiceSchema).optional(),
  liveMoments: z.array(LiveMomentSchema).optional(),
  relatedLinks: z.array(RelatedLinkSchema).optional(),
  newsletterItems: z.array(NewsletterItemSchema).optional(),
  offerIcons: z.array(OfferIconSchema).optional(),
  iconPreview1: z.union([z.string(), z.null(), z.undefined()]).optional(),
  iconPreview2: z.union([z.string(), z.null(), z.undefined()]).optional(),
});

export const ImpactSchema = z.object({
  // Standard Impact fields
  title: z
    .string()
    .min(1, "Title is required")
    .max(50, "Title must be 50 characters or less"),
  impactTags: z
    .string()
    .min(1, "Impact tags are required")
    .max(50, "Impact tags must be 50 characters or less"),
  writersName: z
    .string()
    .min(1, "Writer's name is required")
    .max(50, "Writer's name must be 50 characters or less"),
  date: z.string().min(1, "Date is required"),
  contentDescription: z
    .string()
    .min(1, "Content description is required")
    .max(1000, "Content description must be 1000 characters or less"),
  writerPhoto: z.string().nullable().optional(),
  galleryPhoto: z.string().nullable().optional(),

  // Highlighted Impact fields - make them optional
  message1: z
    .string()
    .max(1000, "Message must be 1000 characters or less")
    .optional(),
  message2: z
    .string()
    .max(1000, "Message must be 1000 characters or less")
    .optional(),
  title2: z.string().max(50, "Title must be 50 characters or less").optional(),
  date2: z.string().optional(),
  impactTags2: z
    .string()
    .max(50, "Impact tags must be 50 characters or less")
    .optional(),
  writersName2: z
    .string()
    .max(50, "Writer's name must be 50 characters or less")
    .optional(),
  writerPhoto2: z.string().nullable().optional(),
  coverPhoto: z.string().nullable().optional(),
  galleryPhoto2: z.string().nullable().optional(),
  contentDescription2: z
    .string()
    .max(1000, "Content description must be 1000 characters or less")
    .optional(),

  // Project association
  addImpact: z
    .string()
    .min(1, "Project name is required")
    .max(50, "Project name must be 50 characters or less"),
});

export type ImpactInput = z.infer<typeof ImpactSchema>;
