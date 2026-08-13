"use client";

import { cn } from "@/utilities/cn";
import { fadeUpItem, staggerContainer } from "@/lib/motionPresets";
import { motion, useReducedMotion } from "framer-motion";

type HeroTextRevealProps = {
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export default function HeroTextReveal({
  title,
  description,
  align = "center",
  className,
  titleClassName,
  descriptionClassName,
}: HeroTextRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const isCenter = align === "center";

  if (prefersReducedMotion) {
    return (
      <div
        className={cn(
          isCenter ? "text-center" : "text-left",
          className,
        )}
      >
        <h1 className={titleClassName}>{title}</h1>
        {description ? (
          <p className={descriptionClassName}>{description}</p>
        ) : null}
      </div>
    );
  }

  return (
    <motion.div
      className={cn(isCenter ? "text-center" : "text-left", className)}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={fadeUpItem} className={titleClassName}>
        {title}
      </motion.h1>
      {description ? (
        <motion.p variants={fadeUpItem} className={descriptionClassName}>
          {description}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
