"use client"

import { useMemo } from "react"
import { useWorkflowBuilder, useWorkflowHistory } from "@/hooks"
import type { WorkflowAgentId } from "@/types"

const AGENTS: WorkflowAgentId[] = [
  "sales-agent",
  "knowledge-agent",
  "finance-agent",
  "executive-agent",
  "support-agent",
  "operations-agent",
  "marketing-agent",
]

export function WorkflowInspectorPanel() {
  const {
    selectedWorkflow,
    selectedNode,
    selectedEdgeId,
    updateNodeConfig,
    assignAgents,
    changeWorkflowStatus,
    connectNodes,
  } = useWorkflowBuilder()
  const { history, versions } = useWorkflowHistory()

  const statusPill = useMemo(() => selectedWorkflow?.status ?? "draft", [selectedWorkflow?.status])

  if (!selectedWorkflow) {
    return (
      <aside className="rounded-xl border border-border bg-white p-3 shadow-sm">
        <p className="text-sm text-text-muted">Select a workflow to inspect configuration.</p>
      </aside>
    )
  }

  return (
    <aside className="space-y-3 rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Workflow inspector">
      <section>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-brand-navy">Inspector</p>
          <span className="rounded border border-border px-2 py-1 text-[11px] capitalize text-text-muted">{statusPill}</span>
        </div>
        <p className="mt-1 text-xs text-text-secondary">{selectedWorkflow.name}</p>
      </section>

      <section className="space-y-2 rounded border border-border bg-surface-muted p-2">
        <p className="text-xs font-semibold text-text-primary">Workflow Versioning</p>
        <div className="flex flex-wrap gap-1">
          <button type="button" className="rounded border border-border px-2 py-1 text-[11px]" onClick={() => changeWorkflowStatus("draft")}>Draft</button>
          <button type="button" className="rounded border border-border px-2 py-1 text-[11px]" onClick={() => changeWorkflowStatus("published")}>Publish</button>
          <button type="button" className="rounded border border-border px-2 py-1 text-[11px]" onClick={() => changeWorkflowStatus("archived")}>Archive</button>
        </div>
        <div className="max-h-28 space-y-1 overflow-y-auto">
          {versions.slice(0, 6).map((version) => (
            <div key={version.id} className="rounded border border-border bg-white px-2 py-1 text-[11px] text-text-secondary">
              v{version.version} {version.status} · {new Date(version.timestamp).toLocaleDateString()}
            </div>
          ))}
        </div>
      </section>

      {selectedNode ? (
        <section className="space-y-2 rounded border border-border bg-surface-muted p-2">
          <p className="text-xs font-semibold text-text-primary">Node Configuration</p>

          <label className="block text-[11px] text-text-muted">
            Name
            <input
              value={selectedNode.data.title}
              onChange={(event) => updateNodeConfig(selectedNode.id, { title: event.target.value })}
              className="mt-1 w-full rounded border border-border bg-white px-2 py-1 text-xs text-text-primary"
            />
          </label>

          <label className="block text-[11px] text-text-muted">
            Description
            <textarea
              value={selectedNode.data.description}
              onChange={(event) => updateNodeConfig(selectedNode.id, { description: event.target.value })}
              className="mt-1 min-h-20 w-full rounded border border-border bg-white px-2 py-1 text-xs text-text-primary"
            />
          </label>

          <label className="block text-[11px] text-text-muted">
            Runtime Status
            <input
              value={selectedNode.data.runtimeStatus}
              onChange={(event) => updateNodeConfig(selectedNode.id, { runtimeStatus: event.target.value })}
              className="mt-1 w-full rounded border border-border bg-white px-2 py-1 text-xs text-text-primary"
            />
          </label>

          <div>
            <p className="text-[11px] text-text-muted">Connected Agents</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {AGENTS.map((agent) => {
                const active = selectedNode.data.assignedAgents.includes(agent)
                return (
                  <button
                    key={agent}
                    type="button"
                    onClick={() => {
                      const next = active
                        ? selectedNode.data.assignedAgents.filter((item) => item !== agent)
                        : [...selectedNode.data.assignedAgents, agent]
                      assignAgents(selectedNode.id, next)
                    }}
                    className={active ? "rounded border border-brand-primary bg-brand-subtle px-1.5 py-0.5 text-[11px]" : "rounded border border-border px-1.5 py-0.5 text-[11px] text-text-secondary"}
                    aria-pressed={active}
                  >
                    {agent}
                  </button>
                )
              })}
            </div>
          </div>

          {selectedNode.type === "loop" ? (
            <div className="rounded border border-border bg-white p-2">
              <p className="text-[11px] font-semibold text-text-primary">Loop Controls</p>
              <p className="mt-1 text-[11px] text-text-secondary">Repeat, retry, timeout, fallback, and max attempts are modeled for runtime orchestration compatibility.</p>
            </div>
          ) : null}

          {selectedNode.type === "decision" ? (
            <div className="rounded border border-border bg-white p-2">
              <p className="text-[11px] font-semibold text-text-primary">Decision Routing</p>
              <div className="mt-1 flex flex-wrap gap-1">
                <button type="button" className="rounded border border-border px-1.5 py-0.5 text-[11px]" onClick={() => connectNodes(selectedNode.id, selectedWorkflow.nodes[selectedWorkflow.nodes.length - 1]?.id ?? selectedNode.id, "YES")}>YES route</button>
                <button type="button" className="rounded border border-border px-1.5 py-0.5 text-[11px]" onClick={() => connectNodes(selectedNode.id, selectedWorkflow.nodes[0]?.id ?? selectedNode.id, "NO")}>NO route</button>
              </div>
            </div>
          ) : null}

          <div className="rounded border border-border bg-white p-2">
            <p className="text-[11px] font-semibold text-text-primary">Error Handling</p>
            <p className="mt-1 text-[11px] text-text-secondary">Strategies: retry, skip, escalate, stop workflow, failure branch.</p>
          </div>
        </section>
      ) : (
        <section className="rounded border border-border bg-surface-muted p-2 text-xs text-text-secondary">
          {selectedEdgeId ? "Edge selected. Future routing inspector will configure conditions and animation behavior." : "Select a node to edit details."}
        </section>
      )}

      <section className="rounded border border-border bg-surface-muted p-2">
        <p className="text-xs font-semibold text-text-primary">Workflow History</p>
        <div className="mt-1 max-h-32 space-y-1 overflow-y-auto">
          {history.slice(0, 10).map((event) => (
            <div key={event.id} className="rounded border border-border bg-white p-1.5 text-[11px] text-text-secondary">
              <p className="font-medium capitalize text-text-primary">{event.type}</p>
              <p>{event.summary}</p>
              <p className="text-text-muted">{new Date(event.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>
    </aside>
  )
}
