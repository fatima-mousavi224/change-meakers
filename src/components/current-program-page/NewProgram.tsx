import Image from "next/image";
import React, { Suspense } from "react";

import { SITE_CONTAINER_CLASS } from "@/constant/siteContainer";
import ProjectInitiatives from "../home/project-Initiative/ProjectInitiatives";

const PROGRAM_HERO_GRADIENT =
  "linear-gradient(188.75deg, rgba(4, 17, 29, 0) 20%, rgba(19, 76, 131, 0.75) 100%)";

export default function NewProgram() {
  return (
    <Suspense fallback={"loading..."}>
      <section className={`mt-8 ${SITE_CONTAINER_CLASS}`}>
        <div className="relative mt-4 overflow-hidden rounded-[24px] shadow-md">
          <div className="relative h-[50vh] min-h-[360px] w-full overflow-hidden sm:min-h-[420px] lg:min-h-[480px]">
            <Image
              src="/images/program-hero-image.jpg"
              alt="Programs"
              fill
              priority
              quality={100}
              className="object-cover object-[center_28%]"
              sizes="(max-width: 1440px) 100vw, 1440px"
            />
          </div>

          <div
            className="pointer-events-none absolute inset-0 z-10 rounded-[24px]"
            style={{ background: PROGRAM_HERO_GRADIENT }}
          />

          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <h1 className="font-plusJakartaSans text-[28px] font-bold leading-tight text-white sm:text-[36px] lg:text-[44px]">
            Youth Empowerment
            </h1>
          </div>
        </div>

        <ProjectInitiatives />
      </section>
    </Suspense>
  );
}
