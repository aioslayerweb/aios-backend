import type { ExecutiveDepartmentPerformance } from "@/types"

type DepartmentPerformancePanelProps = {
  departments: ExecutiveDepartmentPerformance[]
}

export function DepartmentPerformancePanel({ departments }: DepartmentPerformancePanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm" aria-label="Department performance">
      <p className="text-xs uppercase tracking-wide text-text-muted">Department Performance</p>
      <h2 className="mt-1 text-lg font-semibold text-brand-navy">Interactive comparison for leadership</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {departments.map((item) => (
          <article key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <p className="text-sm font-semibold text-brand-navy">{item.department}</p>
            <div className="mt-2 space-y-1 text-xs text-text-secondary">
              <p>Goals {item.goals} · KPIs {item.kpis}</p>
              <p>Velocity {item.velocity}</p>
              <p>Efficiency {item.efficiency}%</p>
              <p>Agent utilization {item.agentUtilization}%</p>
              <p>Workload {item.workload}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}