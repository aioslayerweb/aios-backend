"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useObjectives } from "@/hooks"

export function ObjectivesPanel() {
  const reduceMotion = useReducedMotion()
  const { filteredObjectives } = useObjectives()

  return (
    <motion.section initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded-3xl border border-border bg-white p-5 shadow-sm" aria-label="Objectives">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Objectives</p>
      <h2 className="mt-1 text-lg font-semibold text-slate-950">Company, department, team, and personal goals</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {filteredObjectives.map((objective) => (
          <article key={objective.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-950">{objective.title}</p>
                <p className="mt-1 text-xs capitalize text-slate-500">{objective.level} · {objective.owner}</p>
              </div>
              <span className="rounded-full bg-white px-2 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200">{objective.progress}%</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white ring-1 ring-slate-200">
              <div className="h-2 rounded-full bg-blue-600" style={{ width: `${objective.progress}%` }} />
            </div>
            <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-2 ring-1 ring-slate-100">KPIs {objective.linkedKpis.length}</div>
              <div className="rounded-xl bg-white p-2 ring-1 ring-slate-100">Workflows {objective.linkedWorkflows.length}</div>
              <div className="rounded-xl bg-white p-2 ring-1 ring-slate-100">Initiatives {objective.linkedInitiatives.length}</div>
            </div>
          </article>
        ))}
      </div>
    </motion.section>
  )
}