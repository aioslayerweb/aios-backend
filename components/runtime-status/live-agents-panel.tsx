import { useAgents } from "@/hooks"

export function LiveAgentsPanel() {
  const { agents, runningAgents } = useAgents()

  return (
    <section className="rounded-lg border border-border bg-surface-canvas p-3 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-navy">Live Agents</p>
        <span className="rounded border border-border px-2 py-0.5 text-[11px] text-text-secondary">
          {runningAgents} running
        </span>
      </div>
      <ul className="mt-2 space-y-2">
        {agents.slice(0, 4).map((agent) => (
          <li key={agent.id} className="rounded border border-border bg-surface-muted px-2 py-1.5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-text-primary">{agent.name}</p>
              <p className="text-[11px] uppercase tracking-wide text-text-muted">{agent.status}</p>
            </div>
            <p className="mt-1 text-[11px] text-text-secondary">{agent.reasoningStage}</p>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-brand-primary" style={{ width: `${agent.progress}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
