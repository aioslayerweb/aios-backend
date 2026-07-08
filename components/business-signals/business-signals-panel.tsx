"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { BusinessSignal } from "@/types"

type BusinessSignalsPanelProps = {
  signals: BusinessSignal[]
}

function strengthClass(strength: number) {
  if (strength >= 85) {
    return "bg-emerald-500"
  }

  if (strength >= 70) {
    return "bg-brand-primary"
  }

  return "bg-amber-400"
}

export function BusinessSignalsPanel({ signals }: BusinessSignalsPanelProps) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Business signals">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted">Business Signals</p>
          <h2 className="mt-1 text-lg font-semibold text-brand-navy">Evidence across systems</h2>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {signals.map((signal, index) => (
          <article key={signal.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold capitalize text-brand-navy">{signal.label}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-text-muted">{signal.source}</p>
              </div>
              <span className="text-xs font-medium text-text-secondary">{signal.strength}%</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-text-secondary">{signal.detail}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <motion.div
                className={`h-full rounded-full ${strengthClass(signal.strength)}`}
                initial={reduceMotion ? false : { width: 0 }}
                animate={{ width: `${signal.strength}%` }}
                transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : index * 0.04 }}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}