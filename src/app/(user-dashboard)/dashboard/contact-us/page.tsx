import ContactForm from "@/components/contact-us/ContactForm";
import Help from "@/components/contact-us/Help";
import React from "react";

export default function ContactUsPage() {
  return (
    <div className="w-full bg-white rounded-[20px] px-4">
      <div className="flex lg:flex-row flex-col gap-4 w-full mx-auto justify-between py-20">
        <div className="lg:w-1/2 w-full">
          <Help />
        </div>

        <div className="lg:w-1/2 w-full">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
