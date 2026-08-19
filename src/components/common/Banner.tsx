'use client';
import React from 'react';
import { cn } from "../../utilities/cn";
import { motion, useReducedMotion } from "framer-motion";

interface BannerProps {
  className?: string;
  children: React.ReactNode;
} 

export default function Banner({ className, children }: BannerProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="bg-common bg-no-repeat bg-center bg-cover py-36 rounded-xl  flex justify-center items-center relative">
      <div className="absolute inset-0 bg-gradient-to-br" />
      <motion.h1
        initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
        animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        className={cn(
          'text-white  relative z-10 lg:text-6xl sm:text-4xl text-3xl flex flex-col gap-2 md:gap-4 justify-center items-center',
          className
        )}
      >
        {children}
      </motion.h1>
    </section>
  );
}
