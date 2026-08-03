import { PARTNERS } from "@/constant/partners";
import { cn } from "@/utilities/cn";
import Image from "next/image";

export default function OurPartners() {
  return (
    <section className="px-4 py-8 lg:px-[16px] lg:py-12">
      <div className="mb-8 flex items-center gap-6 lg:mb-10">
        <h2 className="shrink-0 font-plusJakartaSans text-[22px] font-bold text-[#000000] sm:text-[34px] lg:text-[36px]">
          Our Partners
        </h2>
        <div className="mt-2 flex min-w-0 flex-1 items-center">
          <div className="h-px flex-1 bg-[#9E9E9E]" />

          <span className="mx-5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#9E9E9E] bg-white">
            <span className="h-3 w-3 rounded-full bg-[#9E9E9E]" />
          </span>

          <div className="h-px w-6 bg-[#9E9E9E] md:w-24" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-10 gap-y-8 sm:gap-x-14 lg:gap-x-20">
        {PARTNERS.map((partner) => (
          <div key={partner.id} className="group flex items-center">
            <Image
              src={partner.logo}
              alt={partner.name}
              width={partner.width}
              height={partner.height}
              quality={100}
              unoptimized
              className={cn(
                "w-auto shrink-0 object-contain object-left grayscale transition-[filter] duration-300 group-hover:grayscale-0",
                partner.imageClassName ??
                  "h-10 max-w-[200px] sm:h-12 sm:max-w-[260px] lg:h-14"
              )}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
