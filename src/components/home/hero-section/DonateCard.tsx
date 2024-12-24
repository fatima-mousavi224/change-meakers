import Link from "next/link";
import React from "react";

export default function DonateCard() {
  return (
    <>
      <div className="hidden lg:block sm:w-[50%]">
        <div className="flex flex-col gap-4 rounded-md bg-white/80 text-black mx-8 sm:mx-4 p-6 sm:my-10  ">
          <h2 className="text-primary-50 text-sm font-bold">
            Do you want to contribute?
          </h2>
          <h1 className="lg:text-2xl text-sm font-bold">
            Join our fight for human rights and girls’ education.
          </h1>
          <p className="text-sm leading-4">
            Today, more than 7.8 million children are out of school in
            Afghanistan. Your support helps Afghan children, youth,
            and girls learn.
          </p>
          <Link
            href="/donate"
            className="w-full text-center lg:text-md text-sm items-center p-2 font-bold rounded-md bg-primary-50  text-white transition duration-300 ease-in-out hover:bg-primary-200 "
          >
            Donate Now
          </Link>
        </div>
      </div>
      <div className="lg:hidden w-full">
        <DonateCardForSmallScreen />
      </div>
    </>
  );
}

function DonateCardForSmallScreen() {
  return (
    <div className="flex flex-col gap-4 rounded-md  text-white mx-8 sm:mx-4 p-6 sm:my-10 text-center md:text-start items-center md:items-start ">
      <h1 className="lg:text-2xl text-sm font-bold">
        Join our fight for human rights and girls’ education.
      </h1>
      <p className="text-sm leading-4 md:text-justify">
        Today, more than 7.8 million children are out of school in Afghanistan.
        Your support helps Afghan children, youth, and girls learn.
      </p>
      <Link
        href="/donate"
        className="w-max  text-center lg:text-md text-sm items-center p-2 font-bold rounded-md text-primary-50 bg-white  hover:text-white transition duration-300 ease-in-out hover:bg-primary-200 "
      >
        Donate Now
      </Link>
    </div>
  );
}
