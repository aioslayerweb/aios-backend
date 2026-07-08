import type { StrategicKPIItem } from "@/types"

type StrategicKPIGridProps = {
  kpis: StrategicKPIItem[]
}

export function StrategicKPIGrid({ kpis }: StrategicKPIGridProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Strategic KPIs">
      <p className="text-xs uppercase tracking-wide text-text-muted">Strategic KPIs</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Board-level performance indicators</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <article key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <p className="text-[11px] uppercase tracking-wide text-text-muted">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-brand-navy">{item.value}</p>
            <p className="mt-1 text-xs text-text-secondary">{item.delta}</p>
            {item.target ? <p className="mt-1 text-[11px] text-text-muted">Target {item.target}</p> : null}
            <p className="mt-1 text-[11px] text-text-muted">Confidence {item.confidence}%</p>
          </article>
        ))}
      </div>
    </section>
  )
}