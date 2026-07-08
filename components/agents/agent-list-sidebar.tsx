"use client"

import { useMemo } from "react"
import { Input } from "@/components/ui"
import { AgentListCard } from "./agent-list-card"
import { departmentLabel } from "@/utils"
import type { AgentCardItem, AgentDepartment, AgentWorkspaceStatus } from "@/types"

type AgentListSidebarProps = {
  agents: AgentCardItem[]
  selectedAgentId: string
  onSelectAgent: (id: string) => void
  query: string
  onQueryChange: (value: string) => void
  statuses: AgentWorkspaceStatus[]
  onStatusesChange: (statuses: AgentWorkspaceStatus[]) => void
  departments: AgentDepartment[]
  onDepartmentsChange: (departments: AgentDepartment[]) => void
}

const statusFilters: AgentWorkspaceStatus[] = ["running", "waiting", "failed", "completed"]
const departmentFilters: AgentDepartment[] = [
  "sales",
  "executive",
  "operations",
  "knowledge",
  "support",
  "marketing",
  "finance",
  "hr",
  "custom",
]

function toggleItem<T extends string>(values: T[], value: T): T[] {
  if (values.includes(value)) {
    return values.filter((item) => item !== value)
  }

  return [...values, value]
}

export function AgentListSidebar({
  agents,
  selectedAgentId,
  onSelectAgent,
  query,
  onQueryChange,
  statuses,
  onStatusesChange,
  departments,
  onDepartmentsChange,
}: AgentListSidebarProps) {
  const summary = useMemo(() => {
    const running = agents.filter((item) => item.status === "running").length
    return `${running}/${agents.length} running`
  }, [agents])

  return (
    <aside className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Agent list sidebar">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-navy">Agent List</p>
        <span className="text-xs text-text-muted">{summary}</span>
      </div>

      <div className="mt-3 space-y-2">
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search agents, tasks, memory, decisions"
          aria-label="Search agent workspace"
        />

        <div className="flex flex-wrap gap-1">
          {statusFilters.map((item) => {
            const active = statuses.includes(item)
            return (
              <button
                key={item}
                type="button"
                className={active ? "rounded border border-brand-primary bg-brand-subtle px-2 py-1 text-xs text-brand-navy" : "rounded border border-border px-2 py-1 text-xs text-text-secondary"}
                onClick={() => onStatusesChange(toggleItem(statuses, item))}
                aria-pressed={active}
              >
                {item}
              </button>
            )
          })}
        </div>

        <div className="flex flex-wrap gap-1">
          {departmentFilters.map((item) => {
            const active = departments.includes(item)
            return (
              <button
                key={item}
                type="button"
                className={active ? "rounded border border-brand-primary bg-brand-subtle px-2 py-1 text-xs capitalize text-brand-navy" : "rounded border border-border px-2 py-1 text-xs capitalize text-text-secondary"}
                onClick={() => onDepartmentsChange(toggleItem(departments, item))}
                aria-pressed={active}
              >
                {departmentLabel(item)}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-3 space-y-2" role="list" aria-label="Agents">
        {agents.map((agent) => (
          <div key={agent.id} role="listitem">
            <AgentListCard
              agent={agent}
              selected={selectedAgentId === agent.id}
              onSelect={() => onSelectAgent(agent.id)}
            />
          </div>
        ))}
      </div>
    </aside>
  )
}
