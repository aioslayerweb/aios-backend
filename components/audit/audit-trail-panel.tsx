"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { GovernanceAuditTrailEntry } from "@/types"

type AuditTrailPanelProps = {
  auditTrail: GovernanceAuditTrailEntry[]
}

export function AuditTrailPanel({ auditTrail }: AuditTrailPanelProps) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Audit trail">
      <p className="text-xs uppercase tracking-wide text-text-muted">Audit Trail</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Immutable who, what, when, why</h2>
      <div className="mt-4 max-h-[540px] space-y-3 overflow-y-auto pr-1">
        {auditTrail.map((entry, index) => (
          <motion.article
            key={entry.id}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: reduceMotion ? 0 : index * 0.02 }}
            className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-brand-navy">{entry.action}</p>
                <p className="mt-1 text-[11px] text-text-muted">{entry.actor} · {entry.source}</p>
              </div>
              <span className="rounded-full border border-border bg-white px-2 py-1 text-[11px] capitalize text-text-muted">{entry.result}</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-text-secondary">{entry.reason}</p>
            <p className="mt-2 text-[11px] text-text-muted">{new Date(entry.timestamp).toLocaleString()}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}