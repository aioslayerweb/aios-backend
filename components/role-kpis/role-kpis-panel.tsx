"use client"

import { motion, useReducedMotion } from "framer-motion"
import { TrendingDown, TrendingUp } from "lucide-react"
import { useRoleKPIs } from "@/hooks/use-role-kpis"

const toneStyles = {
  positive: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  neutral: "border-slate-200 bg-slate-50 text-slate-700",
} as const

export function RoleKPIsPanel() {
  const shouldReduceMotion = useReducedMotion()
  const { kpis } = useRoleKPIs()

  return (
    <motion.section
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-4"
      aria-label="Role KPIs"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Role KPIs</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">Decision metrics by role</h2>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item, index) => (
          <motion.article
            key={item.label}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: index * 0.04 }}
            className={`rounded-2xl border p-4 shadow-sm ${toneStyles[item.tone]}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-70">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{item.value}</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-black/5">
                {item.change.includes("-") ? <TrendingDown className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
                {item.change}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.detail}</p>
          </motion.article>
        ))}
      </div>
    </motion.section>
  )
}