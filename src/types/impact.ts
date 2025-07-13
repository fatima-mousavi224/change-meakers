export interface Impact {
  id: string;
  // Standard Impact fields
  title: string | null;
  impactTags: string | null;
  author: string | null;
  date: string | null;
  description: string | null;
  authorPhoto?: string | null;
  coverPhoto?: string | null;
  galleryPhoto?: string[] | null;

  // Project association
  projectName?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface ImpactFormData {
  title: string;
  impactTags: string;
  author: string;
  date: string;
  description: string;
  authorPhoto: File | null;
  coverPhoto: File | null;
  galleryPhoto: File | null;
  projectName: string;
}

export interface ImpactResponse {
  message: string;
  impact: Impact;
}

export interface ImpactListResponse {
  impacts: Impact[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
