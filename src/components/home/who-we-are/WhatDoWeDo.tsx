import { ArrowRight } from "@/icons/Icons";
import Link from "next/link";

const WhatDoWeDo = () => {
  return (
    <div className="lg:w-[47vw] rounded-xl bg-[#F2F2F2] p-5 flex flex-col justify-between">
      <div>
        <h2 className="sm:text-2xl text-base font-semibold text-gray-800 mb-4">
          Who We Are
        </h2>
        <div className="flex flex-col gap-2">
          {/* <p className="text-lg">Transforming lives through education</p> */}
          <div className="text-sm xl:text-base mb-2 text-justify text-paragraph_color xl:leading-7 leading-5">
            <p>
              Change Makers of the World is a youth-led organization established in 2020 in Kabul, Afghanistan. The organization works primarily on girls’ education and human rights, with programs and advocacy activities focused on Afghanistan.
            </p>
            <br />
            <p>
              Since its establishment, Change Makers of the World has implemented education-related initiatives, supported access to learning resources, and engaged young people in discussions on rights and participation. The organization’s work has taken place both inside Afghanistan and through engagement with Afghan communities and platforms abroad.
            </p>
            <br />

            <p>
              Alongside community-based activities, Change Makers of the World engages with international audiences to raise awareness of the realities facing Afghan girls and youth, and to contribute to public and institutional dialogue on education and rights.
            </p>
          </div>
        </div>
      </div>
      {/* <div className="flex justify-between">
        <Link
          href="/current-programs"
          className="inline-block text-primary_color text-sm xl:text-base"
        >
          Learn More (Our programs)
        </Link>
        <Link href="/current-programs">
          <ArrowRight className="bg-black rounded-full hover:bg-opacity-80 " />
        </Link>
      </div> */}
    </div>
  );
};

export default WhatDoWeDo;
