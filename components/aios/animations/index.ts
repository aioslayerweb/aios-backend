"use client"

import type { Variants } from "framer-motion"
import { aiosTheme } from "@/components/aios/theme/tokens"

const ease = aiosTheme.motion.easing
const duration = {
  fast: 0.22,
  base: 0.38,
  calm: 0.56,
  enter: 0.66,
}

export const aiosMotionViewport = { once: true, amount: 0.2 } as const
export const aiosSpring = { stiffness: 160, damping: 18, mass: 0.55 } as const

export const aiosMotion = {
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: duration.base, ease } },
    reduced: { opacity: 1, transition: { duration: duration.fast, ease } },
  } satisfies Variants,
  fadeUp: {
    hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: duration.enter, ease } },
    reduced: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: duration.fast, ease } },
  } satisfies Variants,
  fadeDown: {
    hidden: { opacity: 0, y: -14, filter: "blur(6px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: duration.calm, ease } },
    reduced: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: duration.fast, ease } },
  } satisfies Variants,
  blurReveal: {
    hidden: { opacity: 0, scale: 0.985, filter: "blur(10px)" },
    show: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: duration.enter, ease } },
    reduced: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: duration.fast, ease } },
  } satisfies Variants,
  scale: {
    hidden: { opacity: 0, scale: 0.94 },
    show: { opacity: 1, scale: 1, transition: { duration: duration.base, ease } },
    reduced: { opacity: 1, scale: 1, transition: { duration: duration.fast, ease } },
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
    animate: { x: 0, opacity: 1, transition: { duration: duration.base, ease } },
    exit: { x: "100%", opacity: 0.7, transition: { duration: duration.fast, ease } },
  } satisfies Variants,
  staggerChildren: {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.03 } },
  } satisfies Variants,
  sectionReveal: {
    hidden: { opacity: 0, y: 18, filter: "blur(5px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: duration.calm, ease } },
    reduced: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: duration.fast, ease } },
  } satisfies Variants,
  navigationReveal: {
    hidden: { opacity: 0, y: -8 },
    show: { opacity: 1, y: 0, transition: { duration: duration.fast, ease } },
  } satisfies Variants,
  pageTransition: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: duration.base, ease } },
    exit: { opacity: 0, y: -10, transition: { duration: duration.fast, ease } },
  } satisfies Variants,
  progressReveal: {
    hidden: { scaleX: 0, opacity: 0.4 },
    show: { scaleX: 1, opacity: 1, transition: { duration: duration.calm, ease } },
  } satisfies Variants,
} as const
