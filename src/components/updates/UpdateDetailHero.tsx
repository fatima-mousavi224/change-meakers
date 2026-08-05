import Image from "next/image";
import Link from "next/link";

import SiteContainer from "@/components/common/SiteContainer";
import type { UpdateDetailItem } from "@/constant/updatesDetail";
import { OPPORTUNITY_DETAIL_SECTION_CLASS } from "@/constant/opportunityDetailLayout";

const DETAIL_HERO_BACKGROUND = "/images/detailscard-background-image.png";

type UpdateDetailHeroProps = {
  update: UpdateDetailItem;
};

function formatPostedDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function DetailField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <p className="font-plusJakartaSans text-[16px] leading-relaxed text-white sm:text-[17px]">
      <span className="font-bold">{label}: </span>
      {children}
    </p>
  );
}

export default function UpdateDetailHero({ update }: UpdateDetailHeroProps) {
  return (
    <section className="relative min-h-[480px] overflow-hidden sm:min-h-[520px] lg:min-h-[590px]">
      <Image
        src={DETAIL_HERO_BACKGROUND}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
        aria-hidden
      />

      <SiteContainer
        className={`relative py-10 sm:py-12 lg:py-16 ${OPPORTUNITY_DETAIL_SECTION_CLASS}`}
      >
        <Link
          href="/updates"
          className="inline-flex items-center gap-2 font-plusJakartaSans text-[15px] font-medium text-white transition-opacity hover:opacity-80 sm:text-[16px]"
        >
          <span aria-hidden>←</span>
          <span>Back</span>
        </Link>

        <p className="mt-8 font-plusJakartaSans text-[15px] font-medium text-white sm:text-[16px]">
          {update.category}
        </p>

        <div className="mt-5 border-t border-[#FFFFFF]" />

        <time
          dateTime={update.postDate}
          className="mt-6 block font-plusJakartaSans font-normal text-[15px] text-[#FFFFFF] sm:text-[20px]"
        >
          {formatPostedDate(update.postDate)}
        </time>

        <h1 className="mt-5 max-w-5xl font-plusJakartaSans text-[30px] font-bold leading-[1.2] text-white sm:text-[36px] lg:text-[48px]">
          {update.title}
        </h1>

        <p className="mt-5 max-w-4xl font-plusJakartaSans text-[16px] leading-relaxed text-white/90 sm:text-[20px]">
          {update.excerpt}
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:gap-4">
          <DetailField label="Author">{update.author}</DetailField>
        </div>
      </SiteContainer>
    </section>
  );
}
