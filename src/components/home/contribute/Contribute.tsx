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
          <p className="text-base text-paragraph_color ">
            Every penny makes a difference! Today, over 7.8 million children in
            Afghanistan are out of school. Your support helps Afghan children,
            youth, and girls learn. In America, we process all donations through
            our partner, the IOC, a registered 501(c)(3) and 509(a)(1) nonprofit
            (Tax ID: 33-0547951). Donations are non-political, non-sectarian,
            and tax-deductible. Your donation is safe and secure. he IOC
            securely transfers funds to us, ensuring transparency. Learn more at
            the link below. Photo Credits: AP Photo/Ebrahim Noroozi, File and
            Arab News.
          </p>
        </div>
        <GoFundMeEmbed />
      </div>
    </div>
  );
}
