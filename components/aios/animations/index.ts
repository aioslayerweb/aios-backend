"use client"

import type { Variants } from "framer-motion"
import { aiosTheme } from "@/components/aios/theme/tokens"

const ease = aiosTheme.motion.easing

export const aiosMotion = {
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.45, ease } },
  } satisfies Variants,
  fadeUp: {
    hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.65, ease } },
  } satisfies Variants,
  fadeDown: {
    hidden: { opacity: 0, y: -22, filter: "blur(8px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease } },
  } satisfies Variants,
  blurReveal: {
    hidden: { opacity: 0, scale: 0.98, filter: "blur(12px)" },
    show: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.62, ease } },
  } satisfies Variants,
  scale: {
    hidden: { opacity: 0, scale: 0.94 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.42, ease } },
  } satisfies Variants,
  float: {
    animate: { y: [0, -8, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } },
  } satisfies Variants,
  cardLift: {
    rest: { y: 0, scale: 1 },
    hover: { y: -4, scale: 1.01, transition: { duration: 0.2, ease } },
  } satisfies Variants,
  hoverGlow: {
    rest: { boxShadow: "0 18px 45px rgba(7, 19, 61, 0.06)" },
    hover: { boxShadow: "0 24px 70px rgba(7, 19, 61, 0.08)", transition: { duration: 0.2, ease } },
  } satisfies Variants,
  drawer: {
    initial: { x: "100%", opacity: 0.7 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.3, ease } },
    exit: { x: "100%", opacity: 0.7, transition: { duration: 0.22, ease } },
  } satisfies Variants,
  staggerChildren: {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
  } satisfies Variants,
  sectionReveal: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.56, ease } },
  } satisfies Variants,
  navigationReveal: {
    hidden: { opacity: 0, y: -8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.28, ease } },
  } satisfies Variants,
  pageTransition: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.24, ease } },
  } satisfies Variants,
} as const
