'use client';
import React from 'react';
import { cn } from "../../utilities/cn"

interface BannerProps {
  className?: string;
  children: React.ReactNode;
} 

export default function Banner({ className, children }: BannerProps) {
  return (
    <section className="bg-common bg-no-repeat bg-center bg-cover py-36 rounded-xl  flex justify-center items-center relative">
      <div className="absolute inset-0 bg-gradient-to-br" />
      <h1
        className={cn(
          'text-white  relative z-10 lg:text-6xl sm:text-4xl text-3xl flex flex-col gap-2 md:gap-4 justify-center items-center',
          className
        )}
      >
        {children}
      </h1>
    </section>
  );
}
