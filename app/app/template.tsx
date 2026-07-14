"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const FADE_EASE: [number, number, number, number] = [0.22, 0.61, 0.36, 1];

export default function AppTemplate({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? undefined : { opacity: 0 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1 }}
      transition={shouldReduceMotion ? undefined : { duration: 0.28, ease: FADE_EASE }}
    >
      {children}
    </motion.div>
  );
}