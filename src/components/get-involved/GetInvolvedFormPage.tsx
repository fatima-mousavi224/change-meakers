import SiteContainer from "@/components/common/SiteContainer";
import ScrollReveal from "@/components/common/ScrollReveal";
import GetInvolvedForm from "@/components/get-involved/GetInvolvedForm";
import type { GetInvolvedFormConfig } from "@/constant/getInvolvedForms";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/logo.jpg";

type GetInvolvedFormPageProps = {
  config: GetInvolvedFormConfig;
};

export default function GetInvolvedFormPage({
  config,
}: GetInvolvedFormPageProps) {
  return (
    <SiteContainer as="main" className="py-6 sm:py-12 lg:py-16">
      <ScrollReveal>
        <div className="mx-auto w-full max-w-[1062px] rounded-[16px] bg-white px-5 pb-10 pt-6 shadow-[0_3px_8px_rgba(0,0,0,0.12)] max-md:w-[92%] sm:rounded-[24px] sm:px-10 sm:pb-14 sm:pt-8 lg:px-[60px] lg:pb-16 lg:pt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-plusJakartaSans text-[14px] font-medium text-[#252525] transition-colors hover:text-primary-50 sm:text-[15px]"
        >
          <ArrowLeftIcon className="size-4 stroke-[2]" aria-hidden />
          Back
        </Link>

        <div className="mx-auto mt-8 flex size-20 items-center justify-center overflow-hidden rounded-full sm:mt-10 sm:size-24">
          <Image
            src={logo}
            alt="Change Makers of the World logo"
            width={96}
            height={96}
            className="size-full object-cover"
            priority
          />
        </div>

        <h1 className="mt-6 text-center font-plusJakartaSans text-[28px] font-bold leading-tight text-[#252525] sm:mt-8 sm:text-[36px]">
          {config.title}
        </h1>

        <p className="mx-auto mt-4 max-w-[820px] text-center font-plusJakartaSans text-[15px] leading-relaxed text-[#667085] sm:mt-5 sm:text-[16px] sm:leading-[26px]">
          {config.description}
        </p>

        <GetInvolvedForm config={config} />
        </div>
      </ScrollReveal>
    </SiteContainer>
  );
}
