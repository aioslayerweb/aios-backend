import { useMemoryLive } from "@/hooks"
import { formatRuntimeElapsed } from "@/utils/runtime-status"

export function LiveMemoryMonitor() {
  const { memoryUpdates } = useMemoryLive()

  return (
    <section className="rounded-lg border border-border bg-surface-canvas p-3 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-navy">Memory Monitor</p>
        <span className="rounded border border-border px-2 py-0.5 text-[11px] text-text-secondary">
          {memoryUpdates.length} updates
        </span>
      </div>
      <ul className="mt-2 space-y-2">
        {memoryUpdates.slice(0, 4).map((item) => (
          <li key={item.id} className="rounded border border-border bg-surface-muted px-2 py-1.5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-text-primary">{item.title}</p>
              <p className="text-[11px] uppercase tracking-wide text-text-muted">{item.lane}</p>
            </div>
            <p className="mt-1 text-[11px] text-text-secondary">{item.summary}</p>
            <p className="mt-1 text-[11px] text-text-muted">{formatRuntimeElapsed(item.timestamp)}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
