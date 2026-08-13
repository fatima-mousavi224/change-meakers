import { ABOUT_IMPACT, ABOUT_MISSION } from "@/constant/aboutMissionImpact";
import Image from "next/image";

type MissionImpactCardProps = {
  title: string;
  paragraphs: readonly string[];
  icon: string;
  iconAlt: string;
  iconWidth: number;
  iconHeight: number;
};

function MissionImpactCard({
  title,
  paragraphs,
  icon,
  iconAlt,
  iconWidth,
  iconHeight,
}: MissionImpactCardProps) {
  return (
    <article className="rounded-[24px] bg-gradient-to-b from-[#F3F8FF] to-[#CEE5FF] p-px">
      <div className="flex flex-col gap-[10px] rounded-[23px] bg-gradient-to-b from-[#FAFCFF] to-[#F6FAFF] px-6 py-8 sm:px-8 sm:py-9 lg:p-[42px]">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-[#E8F3FC] lg:size-12">
          <Image
            src={icon}
            alt={iconAlt}
            width={iconWidth}
            height={iconHeight}
            className="object-contain"
          />
        </div>

        <h2 className="font-plusJakartaSans text-[20px] font-bold leading-tight text-[#252525] sm:text-[20px] lg:text-[22px] pt-2">
          {title}
        </h2>

        <div className="space-y-[10px] font-plusJakartaSans text-[15px] leading-[26px] text-[#252525] sm:text-[16px] sm:leading-[27px] lg:text-[17px] lg:leading-[30px]">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function MissionImpact() {
  return (
    <section>
      <div className="flex flex-col gap-5 lg:gap-6">
        <MissionImpactCard
          title={ABOUT_MISSION.title}
          paragraphs={ABOUT_MISSION.paragraphs}
          icon={ABOUT_MISSION.icon}
          iconAlt={ABOUT_MISSION.iconAlt}
          iconWidth={ABOUT_MISSION.iconWidth}
          iconHeight={ABOUT_MISSION.iconHeight}
        />
        <MissionImpactCard
          title={ABOUT_IMPACT.title}
          paragraphs={ABOUT_IMPACT.paragraphs}
          icon={ABOUT_IMPACT.icon}
          iconAlt={ABOUT_IMPACT.iconAlt}
          iconWidth={ABOUT_IMPACT.iconWidth}
          iconHeight={ABOUT_IMPACT.iconHeight}
        />
      </div>
    </section>
  );
}
