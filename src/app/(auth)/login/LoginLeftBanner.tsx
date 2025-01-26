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
        src="/images/login/Sign in.jpeg"
        alt="Login Left Banner"
        width={1280}
        height={853}
        className="min-h-screen h-max   w-full object-cover absolute"
      />
      <Image
        src="/images/login/overlay.png"
        alt="Overlay"
        width={720}
        height={1024}
        className="lg:min-h-screen h-full w-full  absolute  "
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
          At this time, login access is restricted to admin accounts only. The
          option for user accounts is currently unavailable.
        </p>
        <p className="text-white text-xl mb-4">
          We appreciate your patience as we work on future updates to enhance
          our platform. Stay connected with us for upcoming features and
          announcements.
        </p>
        <p className="text-white text-xl mb-4">
          📢 Stay Updated: Follow our website and official channels for the
          latest news.
        </p>
        <p className="text-white text-xl mb-4">Thank you for your support!</p>
      </div>
    </div>
  );
}
