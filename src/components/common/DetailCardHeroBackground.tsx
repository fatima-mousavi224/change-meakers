import Image from "next/image";

const DETAIL_HERO_BACKGROUND = "/images/detailscard-background-image.png";

export default function DetailCardHeroBackground() {
  return (
    <>
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#04111D] via-[#0f3a66] to-[#134C83]"
        aria-hidden
      />
      <Image
        src={DETAIL_HERO_BACKGROUND}
        alt=""
        fill
        priority
        className="object-cover object-center opacity-[0.28]"
        sizes="100vw"
        aria-hidden
      />
    </>
  );
}
