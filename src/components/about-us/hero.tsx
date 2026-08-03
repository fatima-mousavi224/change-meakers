import {
  ABOUT_INTRO_IMAGES,
  ABOUT_INTRO_PARAGRAPHS,
} from "@/constant/aboutIntro";
import Image from "next/image";

type CollageImageProps = {
  src: string;
  alt: string;
  className?: string;
};

function CollageImage({ src, alt, className }: CollageImageProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-[20px] ${className ?? ""}`}
    >
      <Image src={src} alt={alt} fill className="object-cover" sizes="25vw" />
    </div>
  );
}

export default function About() {
  const { certificate, meeting, workshop, presentation } = ABOUT_INTRO_IMAGES;

  return (
    <section className="py-8 lg:px-[16px] lg:py-14 px-4">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
        <div className="order-2 lg:order-1 md:pt-10">
          <h1 className="font-plusJakartaSans text-[26px] font-bold leading-tight text-[#252525] sm:text-[30px] lg:text-[32px]">
            About Change Makers of the World
          </h1>

          <div className="mt-5 space-y-4 font-plusJakartaSans text-[15px] leading-[23px] text-[#717171] sm:text-[16px] sm:leading-[24px] lg:text-[17px] lg:leading-[28px]">
            {ABOUT_INTRO_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="order-1 grid grid-cols-2 gap-3 sm:gap-4 lg:order-2 lg:gap-5">
          <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
            <CollageImage
              src={certificate.src}
              alt={certificate.alt}
              className="h-[240px] sm:h-[285px] lg:h-[340px]"
            />
            <CollageImage
              src={meeting.src}
              alt={meeting.alt}
              className="h-[165px] sm:h-[195px] lg:h-[220px]"
            />
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
            <CollageImage
              src={workshop.src}
              alt={workshop.alt}
              className="h-[165px] sm:h-[195px] lg:h-[220px]"
            />
            <CollageImage
              src={presentation.src}
              alt={presentation.alt}
              className="h-[240px] sm:h-[285px] lg:h-[340px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
