import DetailCardHeroBackground from "@/components/common/DetailCardHeroBackground";
import SiteContainer from "@/components/common/SiteContainer";
import UpdateDetailBackButton from "@/components/updates/UpdateDetailBackButton";
import type { UpdateDetailItem } from "@/constant/updatesDetail";
import { OPPORTUNITY_DETAIL_SECTION_CLASS } from "@/constant/opportunityDetailLayout";

type UpdateDetailHeroProps = {  update: UpdateDetailItem;
  returnTo?: string | null;
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
    <p className="font-plusJakartaSans text-[15px] leading-relaxed text-white sm:text-[16px]">
      <span className="font-bold">{label}: </span>
      {children}
    </p>
  );
}

export default function UpdateDetailHero({
  update,
  returnTo,
}: UpdateDetailHeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[480px] sm:min-h-[520px] lg:min-h-[590px]">
        <DetailCardHeroBackground />
        <SiteContainer
          className={`relative py-10 sm:py-12 lg:py-16 ${OPPORTUNITY_DETAIL_SECTION_CLASS}`}
        >
          <UpdateDetailBackButton returnTo={returnTo} />

          <p className="mt-8 font-plusJakartaSans text-[15px] font-medium text-white sm:text-[16px]">
            {update.category}
          </p>

          <div className="mt-5 border-t border-white" />

          <time
            dateTime={update.postDate}
            className="mt-6 block font-plusJakartaSans text-[15px] font-normal text-white sm:text-[20px]"
          >
            {formatPostedDate(update.postDate)}
          </time>

          <h1 className="mt-5 max-w-5xl font-plusJakartaSans text-[30px] font-bold leading-[1.2] text-white sm:text-[36px] lg:text-[48px]">
            {update.title}
          </h1>

          <p className="mt-5 max-w-4xl font-plusJakartaSans text-[16px] leading-relaxed text-white/90 sm:text-[20px]">
            {update.excerpt}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:gap-4 lg:flex-row lg:flex-wrap lg:gap-x-10">
            <DetailField label="Author">{update.author}</DetailField>
          </div>
        </SiteContainer>
      </div>
    </section>
  );
}
