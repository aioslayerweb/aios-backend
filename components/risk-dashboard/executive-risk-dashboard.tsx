import type { ExecutiveRiskCategory } from "@/types"

type ExecutiveRiskDashboardProps = {
  riskCategories: ExecutiveRiskCategory[]
}

export function ExecutiveRiskDashboard({ riskCategories }: ExecutiveRiskDashboardProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Risk dashboard">
      <p className="text-xs uppercase tracking-wide text-text-muted">Risk Dashboard</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Cross-company risk posture</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {riskCategories.map((item) => (
          <article key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <p className="text-sm font-semibold text-brand-navy">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-brand-navy">{item.score}</p>
            <p className="mt-1 text-xs text-text-secondary">{item.detail}</p>
            <p className="mt-1 text-[11px] text-text-muted capitalize">Trend {item.trend}</p>
          </article>
        ))}
      </div>
    </section>
  )
}