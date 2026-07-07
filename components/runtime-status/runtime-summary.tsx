import type { RuntimeModuleStatus } from "@/types"

type RuntimeSummaryProps = {
  modules: RuntimeModuleStatus[]
}

export function RuntimeSummary({ modules }: RuntimeSummaryProps) {
  const activeCount = modules.filter((item) => item.status === "active").length
  const warningCount = modules.filter(
    (item) => item.status === "warning" || item.status === "degraded"
  ).length
  const syncCount = modules.filter((item) => item.status === "synchronizing").length

  return (
    <section className="rounded-lg border border-border bg-surface-canvas p-3 shadow-sm">
      <p className="text-sm font-semibold text-brand-navy">Runtime Summary</p>
      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
        <div className="rounded border border-border bg-surface-muted p-2">
          <p className="text-lg font-semibold text-brand-navy">{activeCount}</p>
          <p className="text-[11px] uppercase tracking-wide text-text-muted">Active</p>
        </div>
        <div className="rounded border border-border bg-surface-muted p-2">
          <p className="text-lg font-semibold text-brand-navy">{syncCount}</p>
          <p className="text-[11px] uppercase tracking-wide text-text-muted">Syncing</p>
        </div>
        <div className="rounded border border-border bg-surface-muted p-2">
          <p className="text-lg font-semibold text-brand-navy">{warningCount}</p>
          <p className="text-[11px] uppercase tracking-wide text-text-muted">Warning</p>
        </div>
      </div>
    </section>
  )
}
