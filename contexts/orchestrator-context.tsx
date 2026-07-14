"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useActivityFeedContext } from "@/contexts/activity-feed-context"
import { useMemoryContext } from "@/contexts/memory-context"
import { useRuntimeLiveContext } from "@/contexts/runtime-live-context"
import { useRuntimeStatusContext } from "@/contexts/runtime-status-context"
import { useAgentWorkspaceContext } from "@/contexts/agent-workspace-context"
import type {
  ExecutionQueueItem,
  LiveAgent,
  OrchestratorAgentNode,
  OrchestratorExecutionItem,
  OrchestratorFilterState,
  OrchestratorMemorySync,
  OrchestratorState,
} from "@/types"
import {
  advanceOrchestratorAgents,
  advanceOrchestratorExecutions,
  buildOrchestratorHealth,
  buildOrchestratorMemorySync,
  buildOrchestratorMetrics,
  createOrchestratorDefaultState,
  filterOrchestratorAgents,
  filterOrchestratorExecutions,
} from "@/utils/orchestrator"

function mapAgentDepartment(name: string): OrchestratorAgentNode["department"] {
  const normalized = name.toLowerCase()
  if (normalized.includes("executive")) return "executive"
  if (normalized.includes("sales")) return "sales"
  if (normalized.includes("support")) return "support"
  if (normalized.includes("operations")) return "operations"
  if (normalized.includes("finance")) return "finance"
  if (normalized.includes("knowledge")) return "knowledge"
  if (normalized.includes("research")) return "research"
  if (normalized.includes("marketing")) return "marketing"
  if (normalized.includes("memory")) return "memory"
  return "planner"
}

function mapLiveStatus(status: LiveAgent["status"]): OrchestratorAgentNode["status"] {
  if (status === "complete") return "completed"
  return status
}

function mapRuntimeAgent(agent: LiveAgent, fallback: OrchestratorAgentNode): OrchestratorAgentNode {
  return {
    ...fallback,
    name: agent.name,
    department: mapAgentDepartment(agent.name),
    status: mapLiveStatus(agent.status),
    currentTask: agent.currentTask,
    confidence: agent.confidence,
    memoryUsage: Math.min(99, Math.max(20, fallback.memoryUsage + Math.round(agent.progress / 10))),
    eventsProcessed: fallback.eventsProcessed + agent.recentActions.length,
    lastAction: agent.recentActions[0] ?? fallback.lastAction,
    cpu: Math.min(99, Math.max(12, fallback.cpu + Math.round(agent.progress / 12))),
    latencyMs: Math.max(50, Math.round(agent.etaSeconds * 1.8)),
    availability: agent.status === "failed" ? 82 : agent.status === "running" ? 97 : 95,
    heartbeat: agent.status === "running" ? "1s ago" : agent.status === "complete" ? "now" : "2s ago",
  }
}

function mapRuntimeExecution(execution: ExecutionQueueItem, fallback: OrchestratorExecutionItem): OrchestratorExecutionItem {
  return {
    ...fallback,
    title: execution.label,
    workflow: execution.label,
    status:
      execution.status === "completed"
        ? "completed"
        : execution.status === "failed"
          ? "failed"
          : execution.status === "running"
            ? "running"
            : execution.status === "waiting"
              ? "waiting"
              : "queued",
    runtimeProgress:
      execution.status === "completed"
        ? 100
        : execution.status === "failed"
          ? Math.max(10, fallback.runtimeProgress - 20)
          : execution.status === "running"
            ? Math.min(100, fallback.runtimeProgress + 18)
            : fallback.runtimeProgress,
    estimatedMinutes:
      execution.status === "completed"
        ? Math.max(5, fallback.estimatedMinutes - 3)
        : execution.status === "running"
          ? Math.max(8, fallback.estimatedMinutes)
          : fallback.estimatedMinutes,
    retryCount: execution.status === "retrying" ? fallback.retryCount + 1 : fallback.retryCount,
    updatedAt: execution.updatedAt,
  }
}

type OrchestratorContextValue = OrchestratorState & {
  selectedAgent: OrchestratorAgentNode | null
  selectedExecution: OrchestratorExecutionItem | null
  filteredAgents: OrchestratorAgentNode[]
  filteredExecutions: OrchestratorExecutionItem[]
  setSelectedAgentId: (id: string) => void
  setSelectedExecutionId: (id: string) => void
  updateFilters: (patch: Partial<OrchestratorFilterState>) => void
  resetFilters: () => void
  setLiveMode: (enabled: boolean) => void
}

const OrchestratorContext = createContext<OrchestratorContextValue | null>(null)

export function OrchestratorProvider({ children }: { children: ReactNode }) {
  const defaults = useMemo(() => createOrchestratorDefaultState(), [])
  const runtimeLive = useRuntimeLiveContext()
  const runtimeStatus = useRuntimeStatusContext()
  const { addActivity } = useActivityFeedContext()
  const { addEntry } = useMemoryContext()
  const { agents: workspaceAgents } = useAgentWorkspaceContext()

  const [agents, setAgents] = useState(defaults.agents)
  const [executions, setExecutions] = useState(defaults.executions)
  const [messages, setMessages] = useState(defaults.messages)
  const [timeline, setTimeline] = useState(defaults.timeline)
  const [health, setHealth] = useState(defaults.health)
  const [memorySync, setMemorySync] = useState(defaults.memorySync)
  const [metrics, setMetrics] = useState(defaults.metrics)
  const [filters, setFilters] = useState(defaults.filters)
  const [selectedAgentId, setSelectedAgentId] = useState(defaults.selectedAgentId)
  const [selectedExecutionId, setSelectedExecutionId] = useState(defaults.selectedExecutionId)
  const [liveMode, setLiveMode] = useState(defaults.liveMode)

  useEffect(() => {
    const nextAgents = defaults.agents.map((fallback, index) => mapRuntimeAgent(runtimeLive.agents[index] ?? runtimeLive.agents[0] ?? fallback, fallback))
    const nextExecutions = defaults.executions.map((fallback, index) => mapRuntimeExecution(runtimeLive.executions[index] ?? runtimeLive.executions[0] ?? { id: fallback.id, label: fallback.title, status: "queued", updatedAt: fallback.updatedAt }, fallback))
    const nextMemorySync = runtimeLive.memoryUpdates.slice(0, 4).map((item, index) => ({
      id: item.id,
      label: item.title,
      status: (index === 0 ? "syncing" : "complete") as OrchestratorMemorySync["status"],
      timestamp: item.timestamp,
      detail: item.summary,
    }))

    setAgents(nextAgents)
    setExecutions(nextExecutions)
    setMemorySync(nextMemorySync)
    setHealth(buildOrchestratorHealth(nextAgents))
    setMetrics(buildOrchestratorMetrics(nextAgents, nextExecutions, nextMemorySync))
    setMessages(
      runtimeLive.events.slice(0, 12).map((event, index) => ({
        id: event.id,
        from: index % 2 === 0 ? "Runtime Engine" : "Orchestrator",
        to: index % 2 === 0 ? "Orchestrator" : "Runtime Engine",
        message: event.summary,
        timestamp: event.timestamp,
        status: index === 0 ? "processing" : "sent",
      }))
    )
    setTimeline(
      runtimeLive.events.slice(0, 28).map((event, index) => ({
        id: event.id,
        label: event.title,
        description: event.summary,
        timestamp: event.timestamp,
        type:
          index % 4 === 0
            ? "workflow-started"
            : index % 4 === 1
              ? "agent-assigned"
              : index % 4 === 2
                ? "decision-made"
                : "memory-updated",
      }))
    )
    runtimeStatus.updateModuleStatus("agents", {
      status: runtimeLive.runningAgents > 0 ? "active" : "healthy",
      label: `${runtimeLive.runningAgents} Live`,
      description: "Multi-agent orchestration is synchronized with runtime live signals.",
    })
    runtimeStatus.updateModuleStatus("automation", {
      status: runtimeLive.queueDepth > 0 ? "active" : "healthy",
      label: runtimeLive.queueDepth > 0 ? `${runtimeLive.queueDepth} Queue` : "Orchestrating",
      description: "Multi-Agent Orchestrator is supervising cross-agent coordination.",
    })
    runtimeStatus.updateModuleStatus("memory", {
      status: runtimeLive.memoryUpdates.length > 0 ? "synchronizing" : "healthy",
      label: `${runtimeLive.memoryUpdates.length} Sync`,
      description: "Memory synchronization is sourced from live runtime data.",
    })
  }, [defaults.agents, defaults.executions, runtimeLive.agents, runtimeLive.executions, runtimeLive.events, runtimeLive.memoryUpdates, runtimeLive.queueDepth, runtimeLive.runningAgents, runtimeStatus])

  useEffect(() => {
    const selected = workspaceAgents.find((agent) => agent.id === selectedAgentId)
    if (!selected) {
      return
    }

    addActivity({
      id: `activity-orchestrator-${Date.now()}`,
      title: "Agent Orchestrator synced with workspace",
      summary: selected.currentTask,
      timestamp: Date.now(),
      category: "agents",
      source: { key: "agents", label: "Multi-Agent Orchestrator", workspace: "Orchestrator" },
      actor: { id: selected.id, name: selected.name, kind: "agent" },
      priority: "medium",
      pinned: false,
      unread: true,
      metadata: {
        eventType: "Agent Started",
        workspace: "Orchestrator",
        status: "running",
        relatedObjects: [{ type: "agent", id: selected.id, label: selected.name }],
        tags: [selected.department, "orchestrator"],
      },
    })
  }, [addActivity, selectedAgentId, workspaceAgents])

  useEffect(() => {
    if (!liveMode) {
      return
    }

    const timer = window.setInterval(() => {
      const selected = workspaceAgents.find((agent) => agent.id === selectedAgentId)
      if (selected) {
        addEntry({
          id: `orchestrator-memory-${Date.now()}`,
          contextId: "multi-agent-orchestrator",
          summary: `Shared orchestration context refreshed for ${selected.name}.`,
          createdAt: Date.now(),
        })
      }
    }, 5200)

    return () => window.clearInterval(timer)
  }, [addEntry, liveMode, selectedAgentId, workspaceAgents])

  const selectedAgent = useMemo(
    () => agents.find((item) => item.id === selectedAgentId) ?? null,
    [agents, selectedAgentId]
  )

  const selectedExecution = useMemo(
    () => executions.find((item) => item.id === selectedExecutionId) ?? null,
    [executions, selectedExecutionId]
  )

  const filteredAgents = useMemo(() => filterOrchestratorAgents(agents, filters), [agents, filters])
  const filteredExecutions = useMemo(() => filterOrchestratorExecutions(executions, filters), [executions, filters])

  const updateFilters = useCallback((patch: Partial<OrchestratorFilterState>) => {
    setFilters((previous) => ({ ...previous, ...patch }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(defaults.filters)
  }, [defaults.filters])

  const value = useMemo<OrchestratorContextValue>(
    () => ({
      agents,
      executions,
      messages,
      timeline,
      health,
      memorySync,
      metrics,
      filters,
      selectedAgentId,
      selectedExecutionId,
      liveMode,
      selectedAgent,
      selectedExecution,
      filteredAgents,
      filteredExecutions,
      setSelectedAgentId,
      setSelectedExecutionId,
      updateFilters,
      resetFilters,
      setLiveMode,
    }),
    [
      agents,
      executions,
      filteredAgents,
      filteredExecutions,
      filters,
      health,
      liveMode,
      memorySync,
      messages,
      metrics,
      resetFilters,
      selectedAgent,
      selectedAgentId,
      selectedExecution,
      selectedExecutionId,
      updateFilters,
      timeline,
    ]
  )

  return <OrchestratorContext.Provider value={value}>{children}</OrchestratorContext.Provider>
}

export function useOrchestratorContext(): OrchestratorContextValue {
  const context = useContext(OrchestratorContext)
  if (!context) {
    throw new Error("useOrchestratorContext must be used within OrchestratorProvider")
  }

  return context
}
