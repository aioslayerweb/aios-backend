"use client"

import type { PromptReasoningItem } from "@/types"

type ReasoningPanelProps = {
  reasoning: PromptReasoningItem[]
}

export function ReasoningPanel({ reasoning }: ReasoningPanelProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Reasoning panel">
      <p className="text-sm font-semibold text-brand-navy">Reasoning</p>
      <div className="mt-2 space-y-1.5">
        {reasoning.map((item) => (
          <article key={item.id} className="rounded-lg border border-border bg-surface-muted p-2">
            <p className="text-xs font-semibold text-text-primary">{item.title}</p>
            <p className="mt-1 text-[11px] text-text-secondary">{item.summary}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
