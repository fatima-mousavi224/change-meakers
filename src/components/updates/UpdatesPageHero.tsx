import SiteContainer from "@/components/common/SiteContainer";

const UPDATES_PAGE_DESCRIPTION =
  "Explore the latest news, stories, and program updates from Change Makers of the World.";

export default function UpdatesPageHero() {
  return (
    <section className="bg-[#FAFAFA]">
      <SiteContainer className="py-16 text-center sm:py-20 lg:py-24">
        <h1 className="font-plusJakartaSans text-[36px] font-bold leading-tight text-[#252525] sm:text-[44px] lg:text-[48px]">
          Updates
        </h1>
        <p className="mx-auto mt-4 max-w-[720px] font-plusJakartaSans text-[15px] leading-relaxed text-[#667085] sm:text-[16px]">
          {UPDATES_PAGE_DESCRIPTION}
        </p>
      </SiteContainer>
    </section>
  );
}
