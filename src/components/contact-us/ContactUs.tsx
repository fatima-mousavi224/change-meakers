import React from "react";
import Help from "./Help";
import ContactForm from "./ContactForm";
import Subscribe from "./Subscribe";

import { SITE_CONTAINER_CLASS } from "@/constant/siteContainer";

export default function ContactUs() {
  return (
    <div className={`${SITE_CONTAINER_CLASS} my-4`}>
      <div className="bg-bannerProgram bg-no-repeat bg-center bg-cover h-[40vh] rounded-[20px] flex justify-center items-center relative">
        <div className="absolute inset-0 flex items-center justify-center w-full text-white font-bold text-3xl md:text-5xl ">
          <h1>Contact Us</h1>
        </div>
      </div>
      <div className="flex lg:flex-row flex-col gap-4 w-full mx-auto justify-between py-20">
        <div className="lg:w-1/2 w-full">
          <Help />
        </div>

        <div className="lg:w-1/2 w-full">
          <ContactForm />
        </div>
      </div>
      <div>
        <Subscribe />
      </div>
    </div>
  );
}
