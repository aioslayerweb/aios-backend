"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { DecisionTimelineEntry } from "@/types"

type DecisionTimelinePanelProps = {
  timeline: DecisionTimelineEntry[]
}

export function DecisionTimelinePanel({ timeline }: DecisionTimelinePanelProps) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Decision timeline">
      <p className="text-xs uppercase tracking-wide text-text-muted">Decision Timeline</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Chronological decision history</h2>

      <div className="mt-4 space-y-3">
        {timeline.map((item, index) => (
          <motion.article
            key={item.id}
            initial={reduceMotion ? false : { opacity: 0, x: 8 }}
            animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.22, delay: reduceMotion ? 0 : index * 0.03 }}
            className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-brand-navy">{item.label}</p>
              <span className="text-[11px] text-text-muted">{new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            <p className="mt-1 text-[11px] uppercase tracking-wide text-text-muted">{item.type}</p>
            <p className="mt-2 text-xs leading-5 text-text-secondary">{item.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}