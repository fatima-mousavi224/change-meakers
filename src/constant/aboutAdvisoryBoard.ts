export type AdvisoryBoardMember = {
  id: string;
  name: string;
  organization: string;
  image: string;
  imageObjectPosition?: string;
};

export const ADVISORY_BOARD: AdvisoryBoardMember[] = [
  {
    id: "michael-whipple",
    name: "Michael Whipple",
    organization: "International Orphan Care Organization",
    image: "/images/about/mike-photo.png",
    imageObjectPosition: "50% 62%",
  },
  {
    id: "timothy-stiven",
    name: "Timothy J. Stiven",
    organization: "Flowers for Future International",
    image: "/images/about/tim-photo.png",
    imageObjectPosition: "50% 24%",
  },
];
