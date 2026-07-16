"use client"

import { motion, useReducedMotion } from "framer-motion"
import { AIOSCard } from "@/components/aios/cards"
import { aiosMotion, aiosMotionViewport } from "@/components/aios/animations"

export type AIOSTimelineItem = { label: string; title: string; body: string }

export function AIOSTimelineList({ items }: { items: AIOSTimelineItem[] }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4" variants={aiosMotion.staggerChildren} initial={reduceMotion ? "show" : "hidden"} whileInView="show" viewport={aiosMotionViewport}>
      {items.map((item, index) => (
        <motion.div key={item.title} variants={aiosMotion.fadeUp} className="public-motion-reveal">
          <AIOSCard variant="standard" hover className="relative overflow-hidden h-full">
          <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--public-color-primary)] text-sm font-semibold text-white">{index + 1}</span>
          <p className="public-caption text-[color:var(--public-color-primary)]">{item.label}</p>
          <h3 className="public-h4 mt-3">{item.title}</h3>
          <p className="public-body mt-3">{item.body}</p>
          </AIOSCard>
        </motion.div>
      ))}
    </motion.div>
  )
}

export const AIOSTimelineSection = AIOSTimelineList
