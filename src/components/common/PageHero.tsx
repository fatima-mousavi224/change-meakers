import Image from "next/image";

import { SITE_CONTAINER_CLASS } from "@/constant/siteContainer";
import { cn } from "@/utilities/cn";

export const PAGE_HERO_GRADIENT =
  "linear-gradient(188.75deg, rgba(4, 17, 29, 0) 20%, rgba(19, 76, 131, 0.75) 100%)";

type PageHeroProps = {
  title: string;
  description?: string;
  image: string;
  imageAlt?: string;
  imagePosition?: string;
  className?: string;
};

export default function PageHero({
  title,
  description,
  image,
  imageAlt,
  imagePosition = "center",
  className,
}: PageHeroProps) {
  return (
    <section className={cn(`mt-8 ${SITE_CONTAINER_CLASS}`, className)}>
      <div className="relative mt-4 overflow-hidden rounded-[24px] shadow-md">
        <div className="relative h-[50vh] min-h-[360px] w-full overflow-hidden sm:min-h-[420px] lg:min-h-[480px]">
          <Image
            src={image}
            alt={imageAlt ?? title}
            fill
            priority
            quality={100}
            className="object-cover"
            style={{
              objectPosition: imagePosition.replace(/_/g, " "),
            }}
            sizes="(max-width: 1440px) 100vw, 1440px"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-[24px]"
          style={{ background: PAGE_HERO_GRADIENT }}
        />

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 py-8 text-center sm:px-10 lg:px-16">
          <h1 className="font-plusJakartaSans text-[28px] font-bold leading-tight text-white sm:text-[36px] lg:text-[44px]">
            {title}
          </h1>

          {description ? (
            <p className="mt-3 max-w-[920px] font-plusJakartaSans text-[13px] font-normal leading-[22px] text-white sm:mt-4 sm:text-[15px] sm:leading-[24px] lg:text-[16px] lg:leading-[26px]">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
