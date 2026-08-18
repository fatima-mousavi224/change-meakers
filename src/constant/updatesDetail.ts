import type { OpportunityContentBlock } from "@/constant/opportunityContentBlocks";

export type UpdateDetailItem = {
  id: string;
  shortId: string | null;
  slug: string | null;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorImage: string | null;
  postDate: string;
  createdAt: string;
  contentBlocks: OpportunityContentBlock[];
};
