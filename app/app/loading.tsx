"use client"

import { motion } from "framer-motion"
import { LoadingSpinner } from "@/components/ui"
import { pageVariants } from "@/theme"

export default function AppLoading() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="fixed inset-0 z-[var(--z-floating)] flex items-center justify-center bg-slate-900/20"
      aria-live="polite"
      aria-label="Loading workspace"
    >
      <div className="rounded-lg border border-border bg-surface-canvas px-4 py-3 shadow-lg">
        <LoadingSpinner label="Loading workspace" />
      </div>
    </motion.div>
  )
}
