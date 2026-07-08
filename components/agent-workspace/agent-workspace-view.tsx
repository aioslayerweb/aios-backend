"use client"

import { useMemo } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { Button, Input } from "@/components/ui"
import { useAgentWorkspace } from "@/hooks"
import { AgentListSidebar } from "@/components/agents"
import { AgentMainPanel } from "./agent-main-panel"
import { CollaborationView } from "./collaboration-view"
import { EventStreamPanel } from "./event-stream-panel"
import { MultiAgentView } from "./multi-agent-view"
import { ReasoningTimeline } from "./reasoning-timeline"
import { WorkspaceStatusBar } from "./workspace-status-bar"

const TaskQueueBoard = dynamic(
  () => import("@/components/task-queue").then((mod) => mod.TaskQueueBoard),
  { ssr: false }
)
const AgentMemoryPanel = dynamic(
  () => import("@/components/memory").then((mod) => mod.AgentMemoryPanel),
  { ssr: false }
)
const AgentToolsPanel = dynamic(
  () => import("@/components/tools").then((mod) => mod.AgentToolsPanel),
  { ssr: false }
)
const DecisionLogPanel = dynamic(
  () => import("@/components/decision-log").then((mod) => mod.DecisionLogPanel),
  { ssr: false }
)

export function AgentWorkspaceView() {
  const {
    selectedAgent,
    selectedAgentId,
    filteredAgents,
    filteredTasks,
    memories,
    tools,
    decisions,
    events,
    collaboration,
    reasoningTimeline,
    filters,
    splitView,
    selectedSplitAgentIds,
    metrics,
    setSelectedAgentId,
    updateFilters,
    resetFilters,
    setSplitView,
    toggleSplitAgent,
    setStatusFilter,
  } = useAgentWorkspace()

  const splitAgents = useMemo(
    () => filteredAgents.filter((item) => selectedSplitAgentIds.includes(item.id)).slice(0, 3),
    [filteredAgents, selectedSplitAgentIds]
  )

  return (
    <div className="space-y-4 px-4 py-4 md:px-6 lg:px-8">
      <section className="rounded-xl border border-border bg-white p-4 shadow-sm" aria-label="Agent workspace header">
        <div className="flex flex-wrap items-center gap-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">Mission Control</p>
            <h1 className="text-xl font-semibold text-brand-navy">AI Agent Workspace</h1>
            <p className="text-sm text-text-secondary">
              Supervise autonomous AI workers with transparent reasoning, decisions, and execution.
            </p>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Button
              variant={splitView ? "primary" : "secondary"}
              size="sm"
              onClick={() => setSplitView(!splitView)}
              aria-pressed={splitView}
            >
              {splitView ? "Exit Split View" : "Multi Agent View"}
            </Button>
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </div>

        <div className="mt-3 grid gap-2 lg:grid-cols-[minmax(0,1fr)_280px_220px]">
          <Input
            value={filters.query}
            onChange={(event) => updateFilters({ query: event.target.value })}
            placeholder="Search agents, tasks, memory, decisions, events"
            aria-label="Global agent workspace search"
          />
          <Input
            type="number"
            min={0}
            max={100}
            value={filters.confidenceMin}
            onChange={(event) => updateFilters({ confidenceMin: Number(event.target.value || 0) })}
            placeholder="Minimum confidence"
            aria-label="Minimum confidence filter"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={filters.onlyRunning ? "rounded border border-brand-primary bg-brand-subtle px-2 py-2 text-xs" : "rounded border border-border px-2 py-2 text-xs text-text-secondary"}
              onClick={() => updateFilters({ onlyRunning: !filters.onlyRunning })}
              aria-pressed={filters.onlyRunning}
            >
              Running Only
            </button>
            <button
              type="button"
              className="rounded border border-border px-2 py-2 text-xs text-text-secondary"
              onClick={() => setStatusFilter([])}
            >
              All Status
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
        <AgentListSidebar
          agents={filteredAgents}
          selectedAgentId={selectedAgentId}
          onSelectAgent={setSelectedAgentId}
          query={filters.query}
          onQueryChange={(value) => updateFilters({ query: value })}
          statuses={filters.statuses}
          onStatusesChange={(statuses) => setStatusFilter(statuses)}
          departments={filters.departments}
          onDepartmentsChange={(departments) => updateFilters({ departments })}
        />

        <main className="space-y-3" aria-label="Main agent workspace panel">
          <AgentMainPanel agent={selectedAgent} />
          <ReasoningTimeline timeline={reasoningTimeline} />
          <EventStreamPanel events={events} />
          <CollaborationView collaboration={collaboration} />

          {splitView ? (
            <section className="space-y-2 rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Split view controls">
              <p className="text-sm font-semibold text-brand-navy">Split View Selection</p>
              <div className="flex flex-wrap gap-1">
                {filteredAgents.slice(0, 6).map((agent) => {
                  const active = selectedSplitAgentIds.includes(agent.id)
                  return (
                    <button
                      key={agent.id}
                      type="button"
                      className={active ? "rounded border border-brand-primary bg-brand-subtle px-2 py-1 text-xs" : "rounded border border-border px-2 py-1 text-xs text-text-secondary"}
                      onClick={() => toggleSplitAgent(agent.id)}
                      aria-pressed={active}
                    >
                      {agent.name}
                    </button>
                  )
                })}
              </div>
              <MultiAgentView agents={splitAgents} />
            </section>
          ) : null}
        </main>

        <motion.aside layout className="space-y-3" aria-label="Agent inspector panel">
          <TaskQueueBoard tasks={filteredTasks} />
          <AgentMemoryPanel memories={memories} />
          <AgentToolsPanel tools={tools} />
          <DecisionLogPanel decisions={decisions} />
        </motion.aside>
      </div>

      <WorkspaceStatusBar metrics={metrics} />
    </div>
  )
}
