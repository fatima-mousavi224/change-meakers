import SiteContainer from "@/components/common/SiteContainer";

type InitiativeDetailIntroProps = {
  paragraphs: string[];
};

export default function InitiativeDetailIntro({
  paragraphs,
}: InitiativeDetailIntroProps) {
  return (
    <SiteContainer as="section" className="pb-12 pt-8 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-12">
      <div className="max-w-none space-y-5 sm:space-y-6">
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="font-plusJakartaSans text-[15px] leading-[28px] text-[#575757] sm:text-[16px] sm:leading-[30px] lg:text-[17px]"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </SiteContainer>
  );
}
