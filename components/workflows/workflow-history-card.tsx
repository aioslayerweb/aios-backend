"use client"

import { useWorkflowHistory } from "@/hooks"

export function WorkflowHistoryCard() {
  const { history } = useWorkflowHistory()

  return (
    <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Workflow lifecycle history">
      <p className="text-sm font-semibold text-brand-navy">Lifecycle</p>
      <div className="mt-2 grid gap-1">
        {history.slice(0, 5).map((item) => (
          <article key={item.id} className="rounded border border-border bg-surface-muted p-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold capitalize text-text-primary">{item.type}</p>
              <p className="text-[11px] text-text-muted">{new Date(item.timestamp).toLocaleTimeString()}</p>
            </div>
            <p className="mt-1 text-[11px] text-text-secondary">{item.summary}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
