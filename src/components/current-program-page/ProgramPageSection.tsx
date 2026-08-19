import ProgramCategoryNav from "./ProgramCategoryNav";
import ProgramContent from "./ProgramContent";
import type { ProgramCategoryId } from "@/constant/programTabs";

type ProgramPageSectionProps = {
  activeCategoryId: ProgramCategoryId;
};

export default function ProgramPageSection({
  activeCategoryId,
}: ProgramPageSectionProps) {
  return (
    <section className="mt-10 sm:mt-12 lg:mt-16 ">
      <div className="lg:flex lg:items-start lg:gap-8 xl:gap-10">
        <ProgramCategoryNav activeCategoryId={activeCategoryId} />
        <ProgramContent categoryId={activeCategoryId} />
      </div>
    </section>
  );
}
