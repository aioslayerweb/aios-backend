"use client"

import { motion, useReducedMotion } from "framer-motion"
import { BellRing, ShieldAlert } from "lucide-react"
import { useRoleAlerts } from "@/hooks/use-role-alerts"

const priorityStyles = {
  critical: "border-[var(--color-semantic-error)] bg-[var(--color-semantic-error-soft)] text-[var(--color-semantic-error-text)]",
  high: "border-[var(--color-semantic-warning)] bg-[var(--color-semantic-warning-soft)] text-[var(--color-semantic-warning-text)]",
  medium: "border-[var(--color-semantic-info)] bg-[var(--color-semantic-info-soft)] text-[var(--color-semantic-info-text)]",
  low: "border-slate-200 bg-slate-50 text-slate-700",
} as const

export function RoleAlertsPanel() {
  const shouldReduceMotion = useReducedMotion()
  const { alerts } = useRoleAlerts()

  return (
    <motion.section
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-3xl border border-border bg-white p-5 shadow-sm"
      aria-label="Role alerts"
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
        <BellRing className="h-3.5 w-3.5" />
        Prioritized alerts
      </div>
      <h2 className="mt-2 text-lg font-semibold text-slate-950">Alerts filtered to the role</h2>

      <div className="mt-4 grid gap-3">
        {alerts.map((alert, index) => (
          <motion.article
            key={alert.id}
            initial={shouldReduceMotion ? false : { opacity: 0, x: 8 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
            className={`rounded-2xl border px-4 py-3 ${priorityStyles[alert.priority]}`}
          >
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-4 w-4" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-slate-950">{alert.title}</p>
                  <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 ring-1 ring-black/5">
                    {alert.priority}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-700">{alert.detail}</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">{alert.source} · {alert.recommendation}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  )
}