"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { DecisionQueueItem } from "@/types"
import { cn } from "@/utils"

type DecisionQueuePanelProps = {
  decisions: DecisionQueueItem[]
  selectedDecisionId: string
  onSelectDecision: (id: string) => void
}

function bandClass(band: DecisionQueueItem["priorityBand"]) {
  switch (band) {
    case "critical":
      return "bg-rose-50 text-rose-700 ring-1 ring-rose-100"
    case "high":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
    case "medium":
      return "bg-sky-50 text-sky-700 ring-1 ring-sky-100"
    case "low":
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
  }
}

export function DecisionQueuePanel({ decisions, selectedDecisionId, onSelectDecision }: DecisionQueuePanelProps) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Decision queue">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted">Decision Queue</p>
          <h2 className="mt-1 text-lg font-semibold text-brand-navy">Pending business decisions</h2>
        </div>
        <span className="rounded-full border border-border px-2.5 py-1 text-xs text-text-muted">{decisions.length} items</span>
      </div>

      <div className="mt-4 space-y-3">
        {decisions.map((item, index) => {
          const active = item.id === selectedDecisionId

          return (
            <motion.button
              key={item.id}
              type="button"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: reduceMotion ? 0 : index * 0.03 }}
              onClick={() => onSelectDecision(item.id)}
              className={cn(
                "w-full rounded-2xl border p-3 text-left transition-colors",
                active ? "border-brand-primary bg-brand-subtle/40 shadow-[0_12px_30px_rgba(28,130,242,0.12)]" : "border-slate-100 bg-slate-50/70 hover:bg-slate-50"
              )}
              aria-pressed={active}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-brand-navy">{item.title}</p>
                  <p className="mt-1 text-xs text-text-muted">{item.category} · {item.department}</p>
                </div>
                <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-medium capitalize", bandClass(item.priorityBand))}>
                  {item.priorityBand}
                </span>
              </div>
              <p className="mt-3 text-xs leading-5 text-text-secondary">{item.summary}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl bg-white px-2.5 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-text-muted">Priority</p>
                  <p className="mt-1 text-sm font-semibold text-brand-navy">{item.priorityScore}</p>
                </div>
                <div className="rounded-xl bg-white px-2.5 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-text-muted">Confidence</p>
                  <p className="mt-1 text-sm font-semibold text-brand-navy">{item.confidence}%</p>
                </div>
                <div className="rounded-xl bg-white px-2.5 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-text-muted">Impact</p>
                  <p className="mt-1 text-xs text-brand-navy">{item.businessImpact}</p>
                </div>
                <div className="rounded-xl bg-white px-2.5 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-text-muted">Owner</p>
                  <p className="mt-1 text-xs text-brand-navy">{item.owner}</p>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}