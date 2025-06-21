export interface Impact {
  id: string;
  // Standard Impact fields
  title: string;
  impactTags: string;
  writersName: string;
  date: Date;
  contentDescription: string;
  writerPhoto?: string | null;
  galleryPhoto?: string | null;

  // Highlighted Impact fields
  message1?: string | null;
  message2?: string | null;
  title2?: string | null;
  date2?: Date | null;
  impactTags2?: string | null;
  writersName2?: string | null;
  writerPhoto2?: string | null;
  coverPhoto?: string | null;
  galleryPhoto2?: string | null;
  contentDescription2?: string | null;

  // Project association
  projectName?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface ImpactFormData {
  title: string;
  impactTags: string;
  writersName: string;
  date: string;
  contentDescription: string;
  contentDescription2: string;
  writerPhoto: File | null;
  galleryPhoto: File | null;
  galleryPhoto2: File | null;
  writerPhoto2: File | null;
  coverPhoto: File | null;
  message1: string;
  message2: string;
  title2: string;
  date2: string;
  impactTags2: string;
  writersName2: string;
  addImpact: string;
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
