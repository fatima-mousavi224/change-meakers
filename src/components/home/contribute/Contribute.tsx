import GoFundMeEmbed from "@/components/home/contribute/GoFundEmbed";
import ImageCompare from "@/components/home/contribute/ImageCompare";

export default function Contribute() {
  return (
    <div className="py-10  flex flex-col lg:flex-row gap-5">
      <div className="lg:basis-[60%] basis-full ">
        <ImageCompare />
      </div>
      <div className="flex flex-col space-y-5 lg:basis-[40%] basis-full">
        <div className="p-4 border border-gray-300 rounded-lg">
          <h1 className="font-bold sm:text-4xl text-2xl mb-3 text-black_color">
            Do you want to contribute?
          </h1>
          <p className="text-lg text-paragraph_color ">
            Join our fight for human rights and girls’ education. Today, more
            than 7.8 million children are out of school in Afghanistan. Your
            support helps Afghan children, youth, and girls learn. Photo
            Credits: AP Photo/Ebrahim Noroozi, File and Arab News.
          </p>
        </div>
        <GoFundMeEmbed />
      </div>
    </div>
  );
}
