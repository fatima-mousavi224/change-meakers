import React, { Suspense } from "react";
import DonationForm from "./DonationForm";
import ImageCompare from "./ImageCompare";
import GoFundMeEmbed from "@/components/home/contribute/GoFundEmbed";

export default function Contribute() {
  return (
    <div className="py-10 space-y-5">
      <div>
        <h1 className="font-bold sm:text-4xl text-2xl mb-3 text-black_color">
          Do you want to contribute?
        </h1>
        <p className="text-lg text-paragraph_color text-justify">
          Join our fight for human rights and girls’ education. Today, more than
          7.8 million children are out of school in Afghanistan. Your support
          helps Afghan children, youth, and girls learn. Photo Credits: AP
          Photo/Ebrahim Noroozi, File and Arab News.
        </p>
      </div>
      <div className="w-full flex lg:flex-row flex-col-reverse gap-4">
        <GoFundMeEmbed />
      </div>
    </div>
  );
}
