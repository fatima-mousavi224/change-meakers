
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import whatWeDoImage from "../../../../public/images/mission-impact/school.jpg";

const paragraphs = [
  "Change Makers of the World works in a context where access to education and opportunities has become increasingly limited, especially for Afghan girls and young people.",
  "In response, we support learning through a combination of in-person initiatives and online programs that allow students to continue their education, develop skills, and stay connected to opportunities.",
  "Our work includes creating spaces for girls to learn, providing access to digital and language education, supporting youth-led initiatives, and building platforms where young people can engage, share their perspectives, and remain part of the global conversation.",
  "This work is ongoing, shaped by the realities on the ground, and focused on practical ways to keep education and opportunity accessible.",
];

export default function WhatWeDo() {
  return (
    <section className="py-8 lg:py-16">
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-8">
        <div>
          <h2 className="font-plusJakartaSans text-[28px] font-bold leading-tight text-[#252525] sm:text-[32px] lg:text-[28px]">
            What We Do
          </h2>

          <div className="mt-5 space-y-4 font-plusJakartaSans text-[15px] leading-[26px] text-[#717171] sm:text-[17px] sm:leading-[27px]">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <Link
            href="/current-programs"
            className="group mt-6 inline-flex items-center gap-2 rounded-xl border border-[#D0D5DD] md:px-6 md:py-3 px-5 py-2.5 font-plusJakartaSans text-[13px] font-medium text-black_color transition-colors duration-200 hover:border-primary-50 hover:bg-primary-50 hover:text-white sm:text-[16px]"
          >
            <span>Read More</span>
            <ArrowRightIcon
              className="size-4 stroke-[2] transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </div>

        <div className="relative border border-[#E4E7EC] aspect-[4/3] w-full overflow-hidden rounded-[20px] lg:aspect-auto lg:h-[460px]">
          <Image
            src={whatWeDoImage}
            alt="Students and young people supported by Change Makers of the World"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </div>
      </div>
    </section>
  );
}