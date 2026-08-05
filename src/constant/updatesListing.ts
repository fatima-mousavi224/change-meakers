export const UPDATE_CATEGORIES = [
  "All Updates",
  "Youth Empowerment",
  "Girls Education",
  "Advocacy",
  "Organization News",
  "Stories",
  "Other",
] as const;

export const UPDATE_SORT_OPTIONS = [
  { value: "recent", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
] as const;

export type UpdateCategory = (typeof UPDATE_CATEGORIES)[number];
export type UpdateSort = (typeof UPDATE_SORT_OPTIONS)[number]["value"];

export const UPDATES_PER_PAGE = 4;

export type UpdateListItem = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  postDate: string;
  createdAt: string;
};

export type UpdateListResponse = {
  items: UpdateListItem[];
  total: number;
  page: number;
  totalPages: number;
};

export const CATEGORY_TITLE_ALIASES: Record<string, string[]> = {
  "Girls Education": ["Girls Education", "Girls' Education"],
};
