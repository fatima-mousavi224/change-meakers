export type AdvisoryBoardMember = {
  id: string;
  name: string;
  organization: string;
  image: string;
};

export const ADVISORY_BOARD: AdvisoryBoardMember[] = [
  {
    id: "michael-whipple",
    name: "Michael Whipple",
    organization: "International Orphan Care Organization",
    image: "/images/about/mike-photo.png",
  },
  {
    id: "timothy-stiven",
    name: "Timothy J. Stiven",
    organization: "Flowers for Future International",
    image: "/images/about/tim-photo.png",
  },
];
