import SectionHeading from "@/components/common/SectionHeading";
import { PARTNERS } from "@/constant/partners";
import { cn } from "@/utilities/cn";
import Image from "next/image";

export default function OurPartners() {
  return (
    <section className="py-8 lg:py-12">
      <SectionHeading title="Our Partners" />

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
