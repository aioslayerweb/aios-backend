import type { ExecutiveOverviewMetric } from "@/types"

type ExecutiveOverviewPanelProps = {
  overview: ExecutiveOverviewMetric[]
}

export function ExecutiveOverviewPanel({ overview }: ExecutiveOverviewPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Executive overview">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted">Executive Overview</p>
          <h2 className="mt-1 text-lg font-semibold text-brand-navy">Company understanding in under five minutes</h2>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {overview.map((item) => (
          <article key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <p className="text-[11px] uppercase tracking-wide text-text-muted">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-brand-navy">{item.value}</p>
            <p className="mt-1 text-xs text-text-secondary">{item.delta}</p>
          </article>
        ))}
      </div>
    </section>
  )
}