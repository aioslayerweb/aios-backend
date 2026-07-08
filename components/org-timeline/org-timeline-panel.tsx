"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Clock3 } from "lucide-react"
import { useOrganizationIntelligenceContext } from "@/contexts/organization-intelligence-context"

export function OrgTimelinePanel() {
  const reduceMotion = useReducedMotion()
  const { timeline } = useOrganizationIntelligenceContext()

  return (
    <motion.section initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded-3xl border border-border bg-white p-5 shadow-sm" aria-label="Organizational timeline">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700"><Clock3 className="h-3.5 w-3.5" />Organizational timeline</div>
      <h2 className="mt-1 text-lg font-semibold text-slate-950">Reorganizations, leadership changes, and initiatives</h2>
      <div className="mt-4 space-y-3">
        {timeline.map((item) => (
          <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                <p className="mt-1 text-xs text-slate-500">{item.date}</p>
              </div>
              <span className="rounded-full bg-white px-2 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200">{item.impact}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
          </article>
        ))}
      </div>
    </motion.section>
  )
}