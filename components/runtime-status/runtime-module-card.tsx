import type { RuntimeModuleStatus } from "@/types"
import { formatRuntimeElapsed } from "@/utils/runtime-status"
import { RuntimeStatusIndicator } from "./runtime-status-indicator"

type RuntimeModuleCardProps = {
  module: RuntimeModuleStatus
}

export function RuntimeModuleCard({ module }: RuntimeModuleCardProps) {
  return (
    <article className="rounded-lg border border-border bg-surface-canvas p-3 shadow-sm transition-shadow hover:shadow-md">
      <RuntimeStatusIndicator module={module} />
      <p className="mt-2 text-xs text-text-secondary">{module.description}</p>
      <p className="mt-2 text-[11px] text-text-muted">Updated {formatRuntimeElapsed(module.timestamp)}</p>
    </article>
  )
}
