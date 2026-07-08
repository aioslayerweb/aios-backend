import type { ExecutiveOperationalSummary } from "@/types"

type OperationalSummaryPanelProps = {
  summary: ExecutiveOperationalSummary
}

export function OperationalSummaryPanel({ summary }: OperationalSummaryPanelProps) {
  const items = [
    { label: "Runtime Engine", value: summary.runtime },
    { label: "Persistent Memory", value: summary.memory },
    { label: "Replay Engine", value: summary.replay },
    { label: "Workflow Builder", value: summary.workflows },
    { label: "Enterprise Integrations", value: summary.integrations },
  ]

  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Operational summary">
      <p className="text-xs uppercase tracking-wide text-text-muted">Operational Summary</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">What changed operationally</h2>
      <div className="mt-4 grid gap-3 xl:grid-cols-2">
        {items.map((item) => (
          <article key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <p className="text-sm font-semibold text-brand-navy">{item.label}</p>
            <p className="mt-2 text-xs leading-5 text-text-secondary">{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  )
}