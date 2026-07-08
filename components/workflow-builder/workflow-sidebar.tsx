"use client"

import { useMemo } from "react"
import { Filter } from "lucide-react"
import { useWorkflowBuilder } from "@/hooks"
import { WorkflowNodeLibrary } from "@/components/workflow-nodes/workflow-node-library"
import { WorkflowTemplateGallery } from "@/components/workflow-library/workflow-template-gallery"

export function WorkflowSidebar() {
  const {
    filteredWorkflows,
    selectedWorkflowId,
    setSelectedWorkflowId,
    updateFilters,
    filters,
    addNode,
  } = useWorkflowBuilder()

  const ownerOptions = useMemo(
    () => Array.from(new Set(filteredWorkflows.map((item) => item.owner))).sort(),
    [filteredWorkflows]
  )

  return (
    <aside className="space-y-3" aria-label="Workflow sidebar">
      <section className="rounded-xl border border-border bg-white p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-text-muted" />
          <p className="text-sm font-semibold text-brand-navy">Workflow Search</p>
        </div>

        <input
          value={filters.query}
          onChange={(event) => updateFilters({ query: event.target.value })}
          className="mt-2 w-full rounded border border-border bg-surface-canvas px-2 py-1 text-xs"
          placeholder="Search workflows"
          aria-label="Search workflows"
        />

        <div className="mt-2 grid grid-cols-2 gap-1">
          {["draft", "published", "archived"].map((status) => {
            const active = filters.statuses.includes(status as "draft" | "published" | "archived")
            return (
              <button
                key={status}
                type="button"
                onClick={() =>
                  updateFilters({
                    statuses: active
                      ? filters.statuses.filter((item) => item !== status)
                      : [...filters.statuses, status as "draft" | "published" | "archived"],
                  })
                }
                className={active ? "rounded border border-brand-primary bg-brand-subtle px-2 py-1 text-[11px]" : "rounded border border-border px-2 py-1 text-[11px] text-text-secondary"}
              >
                {status}
              </button>
            )
          })}
        </div>

        <select
          className="mt-2 w-full rounded border border-border bg-surface-canvas px-2 py-1 text-xs"
          value={filters.owners[0] ?? ""}
          onChange={(event) => updateFilters({ owners: event.target.value ? [event.target.value] : [] })}
          aria-label="Filter by workflow owner"
        >
          <option value="">All owners</option>
          {ownerOptions.map((owner) => (
            <option key={owner} value={owner}>
              {owner}
            </option>
          ))}
        </select>
      </section>

      <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Workflow list">
        <p className="text-sm font-semibold text-brand-navy">Workflows</p>
        <div className="mt-2 space-y-1.5">
          {filteredWorkflows.map((workflow) => (
            <button
              key={workflow.id}
              type="button"
              onClick={() => setSelectedWorkflowId(workflow.id)}
              className={workflow.id === selectedWorkflowId ? "w-full rounded border border-brand-primary bg-brand-subtle p-2 text-left" : "w-full rounded border border-border bg-surface-muted p-2 text-left hover:border-brand-primary"}
            >
              <p className="text-xs font-semibold text-text-primary">{workflow.name}</p>
              <p className="mt-1 text-[11px] text-text-secondary line-clamp-2">{workflow.description}</p>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-text-muted">
                <span className="rounded border border-border px-1 py-0.5 capitalize">{workflow.status}</span>
                <span className="rounded border border-border px-1 py-0.5 capitalize">{workflow.department}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <WorkflowNodeLibrary onAddNode={addNode} />
      <WorkflowTemplateGallery />
    </aside>
  )
}
