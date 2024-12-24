import Image from "next/image";
import React from "react";
import DonateCard from "./DonateCard";
import hero from "../../public/images/hero.jpg";
import heroMobile from "../../public/images/hero-mobile.jpg";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-[#333] via-[rgba(1,65,129,0.63)] to-[rgba(1,65,129,0.86)] lg:h-[calc(100vh-64px)]  relative py-16 flex justify-center items-center">
      <Image
        src={hero}
        height={1440}
        width={1031}
        alt="hero image"
        className="absolute top-0 w-full h-full -z-10 hidden md:block object-cover"
      />
      <Image
        src={heroMobile}
        height={2594}
        width={1313}
        alt="hero image"
        className="absolute top-0 w-full h-full -z-10 md:hidden "
      />
      <div className="flex items-center gap-8 text-white flex-col  sm:flex-row  max-w-[80rem] mx-auto lg:py-20 md:px-5">
        <div className="flex flex-col gap-3 text-center lg:gap-5 sm:text-left sm:px-4 ">
          <div className="flex justify-center mb-4 sm:justify-start">
            <Image
              src={"/images/Ellipse3.png"}
              height={64}
              width={64}
              alt="logo"
              className="h-16 w-16"
            />
          </div>

          <p className="text-sm font-normal lg:leading-6">
            #LetAfghanGirlsLearn
          </p>
          <h1 className="text-2xl font-bold md:text-4xl lg:text-7xl lg:leading-tight">
            Change Makers of the World
          </h1>
          <p className="text-sm lg:leading-8 md:text-xl lg:text-2xl font-semibold">
            Together, we can change the world.
          </p>
        </div>
        <DonateCard />
      </div>
    </section>
  );
}
