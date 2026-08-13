"use client";

import { cn } from "@/utilities/cn";
import { motion, useReducedMotion } from "framer-motion";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export default function ScrollReveal({
  children,
  className,
  delay = 0,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "-60px" }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1] as const,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
