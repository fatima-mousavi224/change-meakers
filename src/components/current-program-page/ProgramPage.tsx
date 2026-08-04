import { Suspense } from "react";

import { SITE_CONTAINER_CLASS } from "@/constant/siteContainer";
import {
  getProgramCategory,
  type ProgramCategoryId,
} from "@/constant/programTabs";
import PageHero from "@/components/common/PageHero";
import ProgramPageSection from "./ProgramPageSection";

type ProgramPageProps = {
  activeCategoryId: ProgramCategoryId;
};

export default function ProgramPage({ activeCategoryId }: ProgramPageProps) {
  const category = getProgramCategory(activeCategoryId);

  return (
    <Suspense fallback={"loading..."}>
      <PageHero
        title={category.label}
        image={category.heroImage}
        imageAlt={category.label}
        imagePosition={category.heroImagePosition ?? "center"}
      />

      <section className={SITE_CONTAINER_CLASS}>
        <ProgramPageSection activeCategoryId={activeCategoryId} />
      </section>
    </Suspense>
  );
}
