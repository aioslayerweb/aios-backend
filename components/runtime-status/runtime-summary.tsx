import type { RuntimeModuleStatus } from "@/types"
import { useRuntime } from "@/hooks"

type RuntimeSummaryProps = {
  modules: RuntimeModuleStatus[]
}

export function RuntimeSummary({ modules }: RuntimeSummaryProps) {
  const { runningAgents, pendingTasks } = useRuntime()
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
      <div className="mt-2 flex items-center gap-2 text-[11px] text-text-secondary">
        <span className="rounded border border-border px-2 py-0.5">{runningAgents} agents running</span>
        <span className="rounded border border-border px-2 py-0.5">{pendingTasks} queued tasks</span>
      </div>
    </section>
  )
}
