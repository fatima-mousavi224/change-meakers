export type Partner = {
  id: string;
  name: string;
  logo: string;
  width: number;
  height: number;
  imageClassName?: string;
};

export const PARTNERS: Partner[] = [
  {
    id: "flowers-for-the-future",
    name: "Flowers for the Future International",
    logo: "/images/home-page/flower-for-the-future-orgnastion.png",
    width: 380,
    height: 100,
    imageClassName:
      "h-14 max-w-[260px] sm:h-16 sm:max-w-[300px] lg:h-[72px] lg:max-w-[340px]",
  },
  {
    id: "international-orphan-care",
    name: "International Orphan Care",
    logo: "/images/home-page/orbahan-cear-orgnastion.png",
    width: 300,
    height: 84,
    imageClassName:
      "h-11 max-w-[210px] sm:h-12 sm:max-w-[240px] lg:h-14 lg:max-w-[270px]",  },
];
