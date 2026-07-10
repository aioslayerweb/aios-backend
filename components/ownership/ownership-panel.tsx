"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ShieldCheck } from "lucide-react"
import { useDecisionOwnership } from "@/hooks"

export function OwnershipPanel() {
  const reduceMotion = useReducedMotion()
  const { decisionPaths } = useDecisionOwnership()

  return (
    <motion.section initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded-3xl border border-border bg-white p-5 shadow-sm" aria-label="Decision ownership">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700"><ShieldCheck className="h-3.5 w-3.5" />Decision ownership</div>
      <h2 className="mt-1 text-lg font-semibold text-slate-950">Approval chains and escalation paths</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {decisionPaths.map((path) => (
          <article key={path.id} className={`rounded-2xl border p-4 ${path.blocked ? "border-[var(--color-semantic-warning)] bg-[var(--color-semantic-warning-soft)]/70" : "border-slate-200 bg-slate-50/70"}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-950">{path.title}</p>
                <p className="mt-1 text-xs text-slate-500">Owner: {path.owner}</p>
              </div>
              <span className="rounded-full bg-white px-2 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200">{path.blocked ? "Blocked" : "Clear"}</span>
            </div>
            <div className="mt-3 text-xs text-slate-600">
              <p><span className="font-semibold text-slate-700">Approvers:</span> {path.approvers.join(", ")}</p>
              <p className="mt-1"><span className="font-semibold text-slate-700">Escalation:</span> {path.escalationPath.join(" → ")}</p>
            </div>
          </article>
        ))}
      </div>
    </motion.section>
  )
}