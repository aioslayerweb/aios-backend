"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, CheckCircle2, ClipboardList } from "lucide-react"
import { useRoleInsights } from "@/hooks/use-role-insights"

export function RoleInsightsPanel() {
  const shouldReduceMotion = useReducedMotion()
  const { insights, summaryPoints } = useRoleInsights()

  return (
    <motion.section
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-3xl border border-border bg-white p-5 shadow-sm"
      aria-label="Role insights"
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
        <ClipboardList className="h-3.5 w-3.5" />
        Role insights
      </div>

      <h2 className="mt-2 text-lg font-semibold text-slate-950">Current priorities and pending decisions</h2>

      <div className="mt-4 grid gap-3">
        {summaryPoints.slice(0, 3).map((point) => (
          <div key={point} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 ring-1 ring-slate-200">
            {point}
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3">
        {insights.map((item, index) => (
          <motion.article
            key={item.id}
            initial={shouldReduceMotion ? false : { opacity: 0, x: -8 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
            className="rounded-2xl border border-slate-200 p-4"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{item.detail}</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">{item.evidence}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-700">
        <ArrowRight className="h-4 w-4" />
        The role lens keeps the home screen focused on what matters now.
      </div>
    </motion.section>
  )
}