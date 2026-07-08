"use client"

import { motion, useReducedMotion } from "framer-motion"
import { formatRuntimeElapsed } from "@/utils/runtime-status"
import type { GovernanceDecisionHistoryItem } from "@/types"
import { cn } from "@/utils"

type DecisionExplorerPanelProps = {
  decisions: GovernanceDecisionHistoryItem[]
  selectedDecisionId: string
  onSelectDecision: (id: string) => void
}

function statusTone(status: GovernanceDecisionHistoryItem["status"]) {
  switch (status) {
    case "approved":
    case "executed":
      return "bg-emerald-50 text-emerald-700"
    case "rejected":
      return "bg-rose-50 text-rose-700"
    case "under_review":
      return "bg-amber-50 text-amber-700"
    case "proposed":
    default:
      return "bg-sky-50 text-sky-700"
  }
}

export function DecisionExplorerPanel({ decisions, selectedDecisionId, onSelectDecision }: DecisionExplorerPanelProps) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Decision explorer">
      <p className="text-xs uppercase tracking-wide text-text-muted">Decision Explorer</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Every AI decision in one place</h2>
      <div className="mt-4 space-y-3">
        {decisions.map((decision, index) => {
          const active = decision.id === selectedDecisionId
          return (
            <motion.button
              key={decision.id}
              type="button"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: reduceMotion ? 0 : index * 0.03 }}
              onClick={() => onSelectDecision(decision.id)}
              className={cn(
                "w-full rounded-2xl border p-3 text-left transition-colors",
                active ? "border-brand-primary bg-brand-subtle/40" : "border-slate-100 bg-slate-50/70 hover:bg-slate-50"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-brand-navy">{decision.title}</p>
                  <p className="mt-1 text-[11px] text-text-muted">{decision.id}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-[11px] font-medium capitalize ${statusTone(decision.status)}`}>{decision.status.replace("_", " ")}</span>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl bg-white p-2"><p className="text-[11px] uppercase tracking-wide text-text-muted">Priority</p><p className="mt-1 text-xs text-brand-navy">{decision.priority}</p></div>
                <div className="rounded-xl bg-white p-2"><p className="text-[11px] uppercase tracking-wide text-text-muted">Confidence</p><p className="mt-1 text-xs text-brand-navy">{decision.confidence}%</p></div>
                <div className="rounded-xl bg-white p-2"><p className="text-[11px] uppercase tracking-wide text-text-muted">Workflow</p><p className="mt-1 text-xs text-brand-navy">{decision.relatedWorkflow}</p></div>
                <div className="rounded-xl bg-white p-2"><p className="text-[11px] uppercase tracking-wide text-text-muted">Responsible agent</p><p className="mt-1 text-xs text-brand-navy">{decision.responsibleAgent}</p></div>
              </div>
              <p className="mt-2 text-[11px] text-text-muted">{formatRuntimeElapsed(decision.timestamp)}</p>
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}