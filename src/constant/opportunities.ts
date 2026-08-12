export const OPPORTUNITY_CATEGORIES = [
  "All Opportunities",
  "High School Scholarships",
  "Undergraduate Scholarships",
  "Master's Scholarships",
  "Fellowships and Leadership Programs",
  "Online Learning",
  "Career and Mentorship",
  "Other Opportunities",
] as const;

export const OPPORTUNITY_LOCATIONS = [
  "All Locations",
  "Afghanistan",
  "Asia",
  "Europe",
  "North America",
  "Online / Global",
] as const;

export const OPPORTUNITY_SORT_OPTIONS = [
  { value: "recent", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "deadline", label: "Deadline Soonest" },
] as const;

export type OpportunityCategory = (typeof OPPORTUNITY_CATEGORIES)[number];
export type OpportunityLocation = (typeof OPPORTUNITY_LOCATIONS)[number];
export type OpportunitySort = (typeof OPPORTUNITY_SORT_OPTIONS)[number]["value"];

import type { OpportunityContentBlock } from "@/constant/opportunityContentBlocks";

export const OPPORTUNITIES_PER_PAGE = 4;

export type { OpportunityContentBlock };

export type OpportunityItem = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  contentBlocks: OpportunityContentBlock[];
  category: string;
  location: string;
  image: string;
  detailImage: string | null;
  videoUrl: string | null;
  deadline: string;
  applicationUrl: string | null;
  resourceProvider: string | null;
  mainSource: string | null;
  postedDate: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type OpportunityListResponse = {
  items: OpportunityItem[];
  total: number;
  page: number;
  totalPages: number;
};
