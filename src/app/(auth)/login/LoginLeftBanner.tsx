"use client";

import { cn } from "@/utilities/cn";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface LoginLeftBannerProps {
  className?: string;
}

export default function LoginLeftBanner({ className }: LoginLeftBannerProps) {
  const router = useRouter();
  return (
    <div
      className={cn(
        "flex justify-center items-center flex-col relative",
        className
      )}
    >
      {/* Login Left Banner Image */}
      <Image
        src="/images/login/login.png"
        alt="Login Left Banner"
        width={1000}
        height={1000}
        className="lg:min-h-screen 2xl:h-screen  w-full object-cover absolute"
      />
      <Image
        src="/images/login/overlay.png"
        alt="Overlay"
        width={1000}
        height={1000}
        className="lg:min-h-screen 2xl:h-screen w-full object-fill absolute  "
      />

      {/* Login Left Banner Logo */}
      <div className="absolute z-10  left-1/2 -translate-x-1/2 bottom-[20%] w-[80%]">
        <Image
          src="/images/logo.jpg"
          alt="Logo"
          width={60}
          height={60}
          className="size-14 rounded-full mb-4 cursor-pointer"
          onClick={() => router.push("/")}
        />
        <h1 className="text-white xl:text-[56px] lg:text-5xl text-4xl font-bold leading-[64px] mb-4">
          Change Makers <br />
          <span className="">of the World</span>
        </h1>
        <p className="text-white text-xl mb-4">
          Join us to support human rights and education for girls in
          Afghanistan.
        </p>
        <p className="text-white text-xl">
          With your account, you can easily manage donations, see the impact of
          your support, and be part of real change. Together, we’re opening
          doors to learning and a brighter future. Sign up to make a difference
          today.
        </p>
      </div>
    </div>
  );
}
