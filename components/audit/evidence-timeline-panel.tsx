"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { GovernanceEvidenceEvent } from "@/types"

type EvidenceTimelinePanelProps = {
  evidence: GovernanceEvidenceEvent[]
}

export function EvidenceTimelinePanel({ evidence }: EvidenceTimelinePanelProps) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Evidence timeline">
      <p className="text-xs uppercase tracking-wide text-text-muted">Evidence Timeline</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Events, memory, knowledge, approvals, outcomes</h2>
      <div className="mt-4 space-y-3">
        {evidence.map((item, index) => (
          <motion.article
            key={item.id}
            initial={reduceMotion ? false : { opacity: 0, x: 10 }}
            animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.22, delay: reduceMotion ? 0 : index * 0.03 }}
            className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-brand-navy">{item.title}</p>
              <span className="text-[11px] capitalize text-text-muted">{item.category}</span>
            </div>
            <p className="mt-1 text-[11px] uppercase tracking-wide text-text-muted">{item.source}</p>
            <p className="mt-2 text-xs leading-5 text-text-secondary">{item.detail}</p>
            <p className="mt-2 text-[11px] text-text-muted">{new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}