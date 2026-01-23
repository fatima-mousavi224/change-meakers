// import GoFundMeEmbed from "@/components/home/contribute/GoFundEmbed";
import ImageCompare from "@/components/home/contribute/ImageCompare";
import Link from "next/link";

export default function Contribute() {
  return (
    <div className="py-10  flex flex-col lg:flex-row gap-5">
    
      <div className="flex flex-col space-y-5 lg:basis-[50%] basis-full">
        <div className="p-4 border border-gray-300 rounded-lg h-full flex justify-between items-stretch flex-col">
          <h1 className="font-bold sm:text-4xl text-2xl mb-3 text-black_color">
            Support Our Work
          </h1>
          <div>
          <p className="text-base text-paragraph_color">
            Contributions are used to support ongoing education activities, cover basic program costs, and provide learning materials for students. Support also helps maintain the delivery of classes and community-based education initiatives where resources are limited.
          </p>
          <p className="text-base text-paragraph_color my-3">
            All contributions are voluntary and allocated to program-related activities.
          </p>
          </div>
          <Link href="https://www.gofundme.com/f/HelpAfghanGirlsLearn/donate?attribution_id=undefined&utm_campaign=unknown&utm_medium=customer&utm_source=website_widget" target="_blank" className="font-semibold mt-8 ">Donate now</Link>
        </div>
        {/* <GoFundMeEmbed /> */}
      </div>
      <div className="lg:basis-[50%] basis-full ">
        <ImageCompare />
      </div>
    </div>
  );
}
