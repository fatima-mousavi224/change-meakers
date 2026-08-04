import {
  getProgramCategory,
  type ProgramCategoryId,
  type ProgramSection,
} from "@/constant/programTabs";

function ProgramTextCard({ children }: { children: React.ReactNode }) {
  return (
    <article className="rounded-[24px] bg-gradient-to-b from-[#F3F8FF] to-[#CEE5FF] p-px">
      <div className="rounded-[23px] bg-gradient-to-b from-[#FAFCFF] to-[#F6FAFF] p-8">
        {children}
      </div>
    </article>
  );
}

function ProgramContentSection({ title, paragraphs }: ProgramSection) {
  return (
    <section>
      <h2 className="font-plusJakartaSans text-[20px] font-bold leading-tight text-[#252525] sm:text-[22px]">
        {title}
      </h2>
      <div className="mt-4 space-y-4 font-plusJakartaSans text-[15px] leading-[26px] text-[#252525] sm:text-[16px] sm:leading-[27px] lg:text-[17px] lg:leading-[30px]">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

type ProgramContentProps = {
  categoryId: ProgramCategoryId;
};

export default function ProgramContent({ categoryId }: ProgramContentProps) {
  const { purpose, activities } = getProgramCategory(categoryId);

  return (
    <div className="mt-4 sm:mt-5 lg:mt-0 lg:min-w-0 lg:flex-1">
      <div className="lg:hidden">
        <ProgramTextCard>
          <div className="flex flex-col gap-10">
            <ProgramContentSection {...purpose} />
            <ProgramContentSection {...activities} />
          </div>
        </ProgramTextCard>
      </div>

      <div className="hidden flex-col gap-10 lg:flex">
        <ProgramTextCard>
          <ProgramContentSection {...purpose} />
        </ProgramTextCard>
        <ProgramTextCard>
          <ProgramContentSection {...activities} />
        </ProgramTextCard>
      </div>
    </div>
  );
}
