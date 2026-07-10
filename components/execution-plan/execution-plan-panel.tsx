"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { PromptPlanStep } from "@/types"

type ExecutionPlanPanelProps = {
  plan: PromptPlanStep[]
}

function tone(status: PromptPlanStep["status"]): string {
  if (status === "current") {
    return "border-brand-primary bg-brand-subtle"
  }

  if (status === "completed") {
    return "border-[var(--color-semantic-success)] bg-[var(--color-semantic-success-soft)]"
  }

  return "border-border bg-white"
}

export function ExecutionPlanPanel({ plan }: ExecutionPlanPanelProps) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Execution plan">
      <p className="text-sm font-semibold text-brand-navy">Execution Plan</p>
      <ol className="mt-2 space-y-1.5">
        {plan.map((step) => (
          <motion.li
            key={step.id}
            layout
            initial={reduceMotion ? false : { opacity: 0.7, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg border px-2 py-1.5 ${tone(step.status)}`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-text-primary">{step.label}</p>
              <span className="text-[11px] capitalize text-text-muted">{step.status}</span>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}
