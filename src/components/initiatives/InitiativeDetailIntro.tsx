import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import SiteContainer from "@/components/common/SiteContainer";
import type {
  InitiativeIntroBlock,
  InitiativeIntroCta,
} from "@/constant/initiativeDetailsContent";

type InitiativeDetailIntroProps = {
  paragraphs: InitiativeIntroBlock[];
  cta?: InitiativeIntroCta;
};

function getParagraphText(block: InitiativeIntroBlock) {
  return typeof block === "string" ? block : block.text;
}

function isBoldParagraph(block: InitiativeIntroBlock) {
  return typeof block !== "string" && Boolean(block.bold);
}

export default function InitiativeDetailIntro({
  paragraphs,
  cta,
}: InitiativeDetailIntroProps) {
  return (
    <SiteContainer as="section" className="pb-12 pt-8 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-12">
      <div className="max-w-none space-y-5 sm:space-y-6">
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className={
              isBoldParagraph(paragraph)
                ? "font-plusJakartaSans text-[15px] font-bold leading-[28px] text-[#252525] sm:text-[16px] sm:leading-[30px] lg:text-[17px]"
                : "font-plusJakartaSans text-[15px] leading-[28px] text-[#575757] sm:text-[16px] sm:leading-[30px] lg:text-[17px]"
            }
          >
            {getParagraphText(paragraph)}
          </p>
        ))}

        {cta ? (
          <div className="pt-1 sm:pt-2">
            <Link
              href={cta.href}
              target={cta.href.startsWith("http") ? "_blank" : undefined}
              rel={
                cta.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              className="group inline-flex items-center gap-2 rounded-xl border border-[#D0D5DD] px-6 py-3 font-plusJakartaSans text-[14px] font-medium text-black_color transition-colors duration-200 hover:border-primary-50 hover:bg-primary-50 hover:text-white sm:text-[16px]"
            >
              <span>{cta.label}</span>
              <ArrowRightIcon
                className="size-4 stroke-[2] transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          </div>
        ) : null}
      </div>
    </SiteContainer>
  );
}
