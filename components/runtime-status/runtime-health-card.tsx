import { useSystemHealth } from "@/hooks"
import { formatRuntimeElapsed } from "@/utils/runtime-status"
import { SystemHealthBadge } from "./system-health-badge"

type RuntimeHealthCardProps = {
  lastUpdated: number
}

export function RuntimeHealthCard({ lastUpdated }: RuntimeHealthCardProps) {
  const { overallHealth, summary } = useSystemHealth()

  return (
    <section className="rounded-lg border border-border bg-surface-canvas p-3 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-navy">Overall System Health</p>
        <SystemHealthBadge health={overallHealth} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-text-secondary">
        {Object.entries(summary).map(([level, count]) => (
          <span key={level} className="rounded border border-border px-2 py-0.5">
            {count} {level}
          </span>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-text-muted">Last updated {formatRuntimeElapsed(lastUpdated)}</p>
    </section>
  )
}
