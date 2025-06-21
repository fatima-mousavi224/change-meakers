export interface TeamCardInput {
  name: string;
  role: string;
  biography: string;
  link?: string;
  showLinkInput: boolean;
  image?: string | null;
  icon?: string | null;
}

export interface StudentItemInput {
  name: string;
  role: string;
  biography: string;
  link?: string;
  showLinkInput: boolean;
  image?: string | null;
  icon?: string | null;
}

export interface VoiceInput {
  quote: string;
  name: string;
  description: string;
  icon?: string | null;
}

export interface LiveMomentInput {
  link: string;
}

export interface RelatedLinkInput {
  buttonName: string;
  buttonLink: string;
}

export interface NewsletterItemInput {
  date: string; // Will parse to DateTime
  title: string;
  description: string;
  url?: string;
}

export interface OfferIconInput {
  url: string;
  iconTitle?: string;
  shortDescription?: string;
}

export interface UploadedFiles {
  cardImage?: string;
  heroImage?: string;
  visionGoalImage1?: string;
  visionGoalImage2?: string;
  visionGoalImage3?: string;
  visionGoalImage4?: string;
  mediaHeroImage?: string;
  photoAlbumImage1?: string;
  photoAlbumImage2?: string;
  photoAlbumImage3?: string;
  photoAlbumImage4?: string;
  newsletterImage1?: string;
  newsletterImage2?: string;
  sdgsImage1?: string;
  sdgsImage2?: string;
  sdgsImage3?: string;
  sdgsImage4?: string;
}

export interface ProjectInput {
  projectTitle: string;
  cardDescription: string;
  heroTitle: string;
  subheading?: string;
  slogan?: string;
  buttonName?: string;
  buttonLink?: string;
  iconTitleStatus1?: string;
  shortDescriptionStatus1?: string;
  iconTitleStatus2?: string;
  shortDescriptionStatus2?: string;
  visionTitle?: string;
  visionText?: string;
  goalTitle?: string;
  goalText?: string;
  sectionTitleAbout?: string;
  bodyText?: string;
  buttonName2?: string;
  buttonLink2?: string;
  sectionTitleVoices?: string;
  sectionDescriptionVoices?: string;
  heroTitleMedia?: string;
  shortDescriptionMedia?: string;
  videoLink?: string;
  fullVideoDescription?: string;
  sectionTitleTeam?: string;
  sectionDescriptionTeam?: string;
  sectionTitleStudents?: string;
  sectionDescriptionStudents?: string;
  addQuote?: string;
  nameRole?: string;
  sectionTitlePhoto?: string;
  sectionDescriptionPhoto?: string;
  sectionTitleNewsletter?: string;
  sectionDescriptionNewsletter?: string;
  sectionTitleSDGs?: string;
  sectionTextSDGs?: string;
  finalStatement?: string;
  navigationLabel?: string;
  showInMainNavigation: boolean;
  uploadedFiles?: UploadedFiles;
  teamCards?: TeamCardInput[];
  studentItems?: StudentItemInput[];
  voices?: VoiceInput[];
  liveMoments?: LiveMomentInput[];
  relatedLinks?: RelatedLinkInput[];
  newsletterItems?: NewsletterItemInput[];
  offerIcons?: OfferIconInput[];
  iconPreview1?: string | null;
  iconPreview2?: string | null;
}
