import { ArrowRight } from "@/icons/Icons";
import Link from "next/link";

const WhatDoWeDo = () => {
  return (
    <div className="lg:w-[47vw] rounded-xl bg-[#F2F2F2] p-5 flex flex-col justify-between">
      <div>
        <h2 className="sm:text-2xl text-base font-semibold text-gray-800 mb-4">
          What do we do?
        </h2>
        <div className="flex flex-col gap-2">
          <p className="text-lg">Transforming lives through education</p>
          <div className="text-sm xl:text-base mb-2 text-justify text-paragraph_color xl:leading-7 leading-5">
            <p>
              In Afghanistan, decades of development progress have been undone
              since 2021. Today, 7.8 million children are out of school,
              according to UNICEF.
            </p>
            <br />
            <p>
              Despite many challenges, our dedicated volunteers both inside and
              outside Afghanistan provide in-person and online classes and
              programs for students.
            </p>
            <br />

            <p>
              We develop and support educational programs that provide quality
              learning opportunities and essential skills to Afghan children.
              Additionally, we distribute books and school materials, advocate
              for their rights globally, and are committed to championing human
              rights, especially women’s rights.
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <Link
          href="/current-programs"
          className="inline-block text-primary_color text-sm xl:text-base"
        >
          Learn More (Our programs)
        </Link>
        <Link href="/current-programs">
          <ArrowRight className="bg-black rounded-full hover:bg-opacity-80 " />
        </Link>
      </div>
    </div>
  );
};

export default WhatDoWeDo;
