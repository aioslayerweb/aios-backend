"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react"
import { useReducedMotion } from "framer-motion"
import { Activity, Layers3, Search, Shield, Workflow } from "lucide-react"
import { useAgentCommunication, useAgentHealth, useAgentNetwork, useExecutionQueue, useMemorySync, useRuntimeMetrics } from "@/hooks"
import { useExecutionTimeline as useOrchestratorExecutionTimeline } from "@/hooks/orchestrator/use-execution-timeline"
import { AgentHealthPanel } from "@/components/agent-health/agent-health-panel"
import { ExecutionFeedPanel } from "@/components/execution-feed/execution-feed-panel"
import { ExecutionQueuePanel } from "@/components/execution-queue/execution-queue-panel"
import { MemorySyncPanel } from "@/components/memory-sync/memory-sync-panel"
import { TaskCardsPanel } from "@/components/task-cards/task-cards-panel"
import { RuntimeThroughputGraph } from "@/components/runtime-graph/runtime-throughput-graph"

const AgentNetworkGraph = dynamic(
  () => import("@/components/agent-network/agent-network-graph").then((mod) => mod.AgentNetworkGraph),
  {
    ssr: false,
    loading: () => (
      <section className="rounded-xl border border-border bg-white p-3 shadow-sm">
        <p className="text-xs text-text-muted">Loading agent network...</p>
      </section>
    ),
  }
)

export function OrchestratorDashboard() {
  const { agents, selectedAgent, selectedAgentId, setSelectedAgentId } = useAgentNetwork()
  const { executions, selectedExecutionId, setSelectedExecutionId } = useExecutionQueue()
  const { messages } = useAgentCommunication()
  const { timeline } = useOrchestratorExecutionTimeline()
  const { health } = useAgentHealth()
  const { memorySync } = useMemorySync()
  const { metrics } = useRuntimeMetrics()
  const reduceMotion = useReducedMotion()

  const selectedAgentSummary = useMemo(() => selectedAgent ?? agents[0] ?? null, [agents, selectedAgent])

  const searchHint = ["agents", "tasks", "executions", "events", "memory"].join(" · ")

  return (
    <div className="space-y-4 px-4 py-4 md:px-6 lg:px-8">
      <section className="rounded-xl border border-border bg-white p-4 shadow-sm" aria-label="Orchestrator header">
        <div className="flex flex-wrap items-start gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">Distributed Workforce Control</p>
            <h1 className="text-xl font-semibold text-brand-navy">AIOS Multi-Agent Orchestrator</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Watch agents think, coordinate, and execute business work as a coordinated operating system.
            </p>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2 text-[11px] text-text-muted">
            <span className="rounded border border-border px-1.5 py-0.5">
              <Layers3 className="mr-1 inline h-3 w-3" />Live network
            </span>
            <span className="rounded border border-border px-1.5 py-0.5">
              <Workflow className="mr-1 inline h-3 w-3" />Execution flow
            </span>
            <span className="rounded border border-border px-1.5 py-0.5">
              <Shield className="mr-1 inline h-3 w-3" />Runtime ready
            </span>
            <span className="rounded border border-border px-1.5 py-0.5">
              <Activity className="mr-1 inline h-3 w-3" />{messages.length} messages
            </span>
            <span className="rounded border border-border px-1.5 py-0.5">Reduced motion {reduceMotion ? "on" : "off"}</span>
          </div>
        </div>

        <div className="mt-3 grid gap-2 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <label className="flex items-center gap-2 rounded-xl border border-border bg-surface-canvas px-3 py-2">
            <Search className="h-4 w-4 text-text-muted" />
            <input
              value={selectedAgentSummary?.currentTask ?? ""}
              readOnly
              aria-label="Selected agent task"
              className="w-full bg-transparent text-sm text-text-primary outline-none"
              placeholder={searchHint}
            />
          </label>
          <select
            value={selectedAgentId}
            onChange={(event) => setSelectedAgentId(event.target.value)}
            className="rounded-xl border border-border bg-surface-canvas px-3 py-2 text-sm text-text-primary"
            aria-label="Select agent"
          >
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
          <select
            value={selectedExecutionId}
            onChange={(event) => setSelectedExecutionId(event.target.value)}
            className="rounded-xl border border-border bg-surface-canvas px-3 py-2 text-sm text-text-primary"
            aria-label="Select execution"
          >
            {executions.map((execution) => (
              <option key={execution.id} value={execution.id}>
                {execution.title}
              </option>
            ))}
          </select>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)_360px]">
        <aside className="space-y-3" aria-label="Orchestrator left sidebar">
          <ExecutionQueuePanel executions={executions} selectedExecutionId={selectedExecutionId} onSelectExecution={setSelectedExecutionId} />
          <TaskCardsPanel executions={executions} />
        </aside>

        <main className="space-y-3" aria-label="Orchestrator center workspace">
          <AgentNetworkGraph agents={agents} selectedAgentId={selectedAgentId} onSelectAgent={setSelectedAgentId} />
          <ExecutionFeedPanel messages={messages} />
          <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Execution timeline">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-brand-navy">Execution Timeline</p>
              <span className="text-[11px] text-text-muted">Chronological history</span>
            </div>
            <div className="mt-2 max-h-72 space-y-2 overflow-y-auto pr-1">
              {timeline.map((event) => (
                <article key={event.id} className="rounded-xl border border-border bg-surface-muted p-3">
                  <div className="flex items-center justify-between gap-2 text-[11px] text-text-muted">
                    <span className="capitalize">{event.type.replace(/-/g, " ")}</span>
                    <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-text-primary">{event.label}</p>
                  <p className="mt-1 text-[11px] text-text-secondary">{event.description}</p>
                </article>
              ))}
            </div>
          </section>
        </main>

        <aside className="space-y-3" aria-label="Orchestrator right sidebar">
          <AgentHealthPanel health={health} />
          <MemorySyncPanel memorySync={memorySync} />
          <RuntimeThroughputGraph metrics={metrics} />
          <section className="rounded-xl border border-border bg-white p-3 shadow-sm" aria-label="Selected agent summary">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-brand-navy">Selected Agent</p>
              <span className="rounded border border-border px-1.5 py-0.5 text-[10px] text-text-muted">{selectedAgentSummary?.department ?? "unknown"}</span>
            </div>
            {selectedAgentSummary ? (
              <div className="mt-2 space-y-1 text-[11px] text-text-secondary">
                <p className="text-xs font-semibold text-text-primary">{selectedAgentSummary.name}</p>
                <p>{selectedAgentSummary.currentTask}</p>
                <p>Confidence {selectedAgentSummary.confidence}% · CPU {selectedAgentSummary.cpu}% · Latency {selectedAgentSummary.latencyMs}ms</p>
                <p>Memory {selectedAgentSummary.memoryUsage}% · Events processed {selectedAgentSummary.eventsProcessed}</p>
                <p>Last action: {selectedAgentSummary.lastAction}</p>
              </div>
            ) : null}
          </section>
        </aside>
      </div>
    </div>
  )
}
