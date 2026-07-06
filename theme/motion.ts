import { type Transition, type Variants } from "framer-motion"
import { motion } from "./tokens"

const standardTransition: Transition = {
  duration: motion.duration.normal,
  ease: motion.easing.standard,
}

export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: standardTransition },
  exit: { opacity: 0, transition: { ...standardTransition, duration: motion.duration.fast } },
}

export const slideUpVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: standardTransition },
  exit: { opacity: 0, y: 8, transition: { ...standardTransition, duration: motion.duration.fast } },
}

export const scaleVariants: Variants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: standardTransition },
  exit: { opacity: 0, scale: 0.98, transition: { ...standardTransition, duration: motion.duration.fast } },
}

export const drawerVariants: Variants = {
  initial: { x: "100%", opacity: 1 },
  animate: { x: 0, opacity: 1, transition: standardTransition },
  exit: { x: "100%", opacity: 1, transition: standardTransition },
}

export const panelVariants: Variants = {
  initial: { opacity: 0, x: 8 },
  animate: { opacity: 1, x: 0, transition: standardTransition },
  exit: { opacity: 0, x: 8, transition: standardTransition },
}

export const modalVariants: Variants = {
  initial: { opacity: 0, y: 8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: standardTransition },
  exit: { opacity: 0, y: 8, scale: 0.98, transition: standardTransition },
}

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: standardTransition },
  exit: { opacity: 0, y: -4, transition: { ...standardTransition, duration: motion.duration.fast } },
}

export const staggerContainer: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
}
