import type { AgentStatus } from "@/types"
import { cn } from "@/utils"

type AgentStatusCardProps = {
  agent: AgentStatus
}

function statusTone(status: AgentStatus["status"]): string {
  switch (status) {
    case "running":
      return "bg-semantic-warning"
    case "complete":
      return "bg-semantic-success"
    case "failed":
      return "bg-semantic-error"
    default:
      return "bg-text-muted"
  }
}

export function AgentStatusCard({ agent }: AgentStatusCardProps) {
  return (
    <article className="rounded-md border border-border bg-surface-muted p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-text-primary">{agent.name}</p>
        <span className="inline-flex items-center gap-1 text-xs text-text-secondary">
          <span className={cn("h-2 w-2 rounded-full", statusTone(agent.status))} aria-hidden />
          {agent.status}
        </span>
      </div>
      <p className="mt-1 text-xs text-text-secondary">{agent.step}</p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full bg-brand-primary" style={{ width: `${agent.progress}%` }} />
      </div>
      <p className="mt-1 text-[11px] text-text-muted">{agent.progress}%</p>
    </article>
  )
}
