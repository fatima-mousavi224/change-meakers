export type Initiative = {
  id: string;
  title: string;
  description: string;
  image: string;
  logo?: string;
  buttonText: "Learn More" | "Donate Now";
  /** Optional external donate/action URL for the detail page CTA */
  donateUrl?: string;
};

export const INITIATIVE_DETAIL_BASE = "/updates";

export const INITIATIVES: Initiative[] = [
  {
    id: "afghan-girls-tech-academy",
    title: "Afghan Girls Tech Academy",
    description:
      "In-person tech school for Afghan girls in Kabul and Herat, Afghanistan",
    image: "/images/Initiatives/afghan-grils-teachacadmy.png",
    logo: "/images/Initiatives/afghan-grils-teachacdamy-logo.png",
    buttonText: "Learn More",
  },
  {
    id: "afghan-youth-coalition",
    title: "Afghan Youth Coalition (AYC)",
    description:
      "A structured platform documenting the situation of Afghan youth",
    image: "/images/Initiatives/afghn-youth-ayc.png",
    logo: "/images/Initiatives/afghn-youth-ayc-logo.png",
    buttonText: "Learn More",
  },
  {
    id: "change-digital-library",
    title: "The Change Digital Library",
    description:
      "An online platform for Afghan youth to receive free educational materials",
    image: "/images/Initiatives/digtal-libray.png",
    logo: "/images/Initiatives/digtal-libray-logo.png",
    buttonText: "Donate Now",
    donateUrl:
      "https://www.gofundme.com/f/HelpAfghanGirlsLearn/donate?attribution_id=undefined&utm_campaign=unknown&utm_medium=customer&utm_source=website_widget",
  },
  {
    id: "maktab-dar-khana",
    title: "Maktab Dar Khana",
    description:
      "A platform for Afghan girls to follow recorded formal lessons from home",
    image: "/images/Initiatives/maktab-dar-kana.jpg",
    logo: "/images/Initiatives/maktab-dar-kana-logo.png",
    buttonText: "Learn More",
  },
  {
    id: "additional-learning-programs",
    title: "Additional Learning Programs",
    description:
      "Other smaller online and in-person classes and workshops to support Afghan girls in continuing their education.",
    image: "/images/Initiatives/addctional-learning.jpg",
    buttonText: "Learn More",
  },
  {
    id: "nycp",
    title: "National Youth Consensus for Peace (NYCP), 2020–2021",
    description:
      "A movement of 244 organizations from all 34 provinces of Afghanistan advocating for meaningful youth participation in the peace process.",
    image: "/images/Initiatives/nactional-youth-nycp.jpg",
    logo: "/images/Initiatives/nactional-youth-nycp-logo.png",
    buttonText: "Learn More",
  },
];

export const INITIATIVE_GRADIENT =
  "linear-gradient(180deg, rgba(0, 0, 0, 0.35) 0%, #000000 100%)";

export const INITIATIVES_PER_PAGE = 4;

export function getInitiativeDetailPath(id: string) {
  return `${INITIATIVE_DETAIL_BASE}/${id}`;
}

export function getInitiativeById(id: string) {
  return INITIATIVES.find((initiative) => initiative.id === id) ?? null;
}
