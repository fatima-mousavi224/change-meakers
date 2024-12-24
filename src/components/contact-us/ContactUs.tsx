import React from "react";
import Help from "./Help";
import ContactForm from "./ContactForm";
import Subscribe from "./Subscribe";

export default function ContactUs() {
  return (
    <div className="max-w-screen-2xl px-4 mx-auto my-4">
      <div className="bg-bannerProgram bg-no-repeat bg-center bg-cover h-[60vh] rounded-[20px] flex justify-center items-center relative">
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
