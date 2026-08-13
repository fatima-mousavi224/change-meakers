"use client";

import { cn } from "@/utilities/cn";
import { listStaggerContainer, listStaggerItem } from "@/lib/motionPresets";
import { motion, useReducedMotion } from "framer-motion";

type StaggerRevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Use for async lists so cards animate when data arrives, not while loading. */
  onMount?: boolean;
};

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={listStaggerItem} className={className}>
      {children}
    </motion.div>
  );
}

export default function StaggerReveal({
  children,
  className,
  onMount = false,
}: StaggerRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      variants={listStaggerContainer}
      initial="hidden"
      {...(onMount
        ? { animate: "visible" }
        : {
            whileInView: "visible",
            viewport: { once: true, amount: 0.08, margin: "-40px" },
          })}
    >
      {children}
    </motion.div>
  );
}
