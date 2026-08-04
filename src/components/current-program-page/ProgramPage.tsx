import Image from "next/image";
import React, { Suspense } from "react";

import { SITE_CONTAINER_CLASS } from "@/constant/siteContainer";
import {
  getProgramCategory,
  type ProgramCategoryId,
} from "@/constant/programTabs";
import ProgramPageSection from "./ProgramPageSection";

const PROGRAM_HERO_GRADIENT =
  "linear-gradient(188.75deg, rgba(4, 17, 29, 0) 20%, rgba(19, 76, 131, 0.75) 100%)";

type ProgramPageProps = {
  activeCategoryId: ProgramCategoryId;
};

export default function ProgramPage({ activeCategoryId }: ProgramPageProps) {
  const category = getProgramCategory(activeCategoryId);

  return (
    <Suspense fallback={"loading..."}>
      <section className={`mt-8 ${SITE_CONTAINER_CLASS}`}>
        <div className="relative mt-4 overflow-hidden rounded-[24px] shadow-md">
          <div className="relative h-[50vh] min-h-[360px] w-full overflow-hidden sm:min-h-[420px] lg:min-h-[480px]">
            <Image
              src={category.heroImage}
              alt={category.label}
              fill
              priority
              quality={100}
              className="object-cover"
              style={{
                objectPosition:
                  category.heroImagePosition?.replace(/_/g, " ") ?? "center",
              }}
              sizes="(max-width: 1440px) 100vw, 1440px"
            />
          </div>

          <div
            className="pointer-events-none absolute inset-0 z-10 rounded-[24px]"
            style={{ background: PROGRAM_HERO_GRADIENT }}
          />

          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <h1 className="font-plusJakartaSans text-[28px] font-bold leading-tight text-white sm:text-[36px] lg:text-[44px]">
              {category.label}
            </h1>
          </div>
        </div>

        <ProgramPageSection activeCategoryId={activeCategoryId} />
      </section>
    </Suspense>
  );
}
