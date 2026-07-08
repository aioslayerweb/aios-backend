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
import { useRuntimeLiveContext } from "@/contexts/runtime-live-context"
import type {
  AgentWorkspaceFilters,
  AgentWorkspaceState,
  AgentWorkspaceStatus,
} from "@/types"
import {
  appendDecision,
  appendEvent,
  createInitialAgents,
  createInitialCollaboration,
  createInitialDecisions,
  createInitialEvents,
  createInitialMemories,
  createInitialReasoningTimeline,
  createInitialTasks,
  createInitialTools,
  cycleQueueTasks,
  defaultAgentWorkspaceFilters,
  deriveMetrics,
  filterAgents,
  filterTasks,
  mutateAgents,
  mutateTools,
  rotateReasoningStages,
} from "@/utils/agent-workspace"

function toWorkspaceStatus(status: "idle" | "running" | "complete" | "failed"): AgentWorkspaceStatus {
  if (status === "complete") {
    return "completed"
  }

  return status
}

type AgentWorkspaceContextValue = AgentWorkspaceState & {
  selectedAgent: AgentWorkspaceState["agents"][number] | null
  filteredAgents: AgentWorkspaceState["agents"]
  filteredTasks: AgentWorkspaceState["tasks"]
  setSelectedAgentId: (id: string) => void
  updateFilters: (patch: Partial<AgentWorkspaceFilters>) => void
  resetFilters: () => void
  setSplitView: (enabled: boolean) => void
  setSelectedSplitAgentIds: (ids: string[]) => void
  toggleSplitAgent: (id: string) => void
  setStatusFilter: (statuses: AgentWorkspaceStatus[]) => void
}

const AgentWorkspaceContext = createContext<AgentWorkspaceContextValue | null>(null)

export function AgentWorkspaceProvider({ children }: { children: ReactNode }) {
  const { health: runtimeHealth, agents: runtimeAgents, queueDepth } = useRuntimeLiveContext()

  const initialAgents = useMemo(() => createInitialAgents(), [])
  const [agents, setAgents] = useState(initialAgents)
  const [selectedAgentId, setSelectedAgentId] = useState(initialAgents[0]?.id ?? "sales-agent")
  const [reasoningTimeline, setReasoningTimeline] = useState(createInitialReasoningTimeline)
  const [tasks, setTasks] = useState(() => createInitialTasks(initialAgents[0]?.id ?? "sales-agent"))
  const [memories, setMemories] = useState(() => createInitialMemories(initialAgents[0]?.id ?? "sales-agent"))
  const [tools, setTools] = useState(createInitialTools)
  const [decisions, setDecisions] = useState(() => createInitialDecisions(initialAgents[0]?.id ?? "sales-agent"))
  const [events, setEvents] = useState(() => createInitialEvents(initialAgents[0]?.id ?? "sales-agent"))
  const [collaboration, setCollaboration] = useState(createInitialCollaboration)
  const [filters, setFilters] = useState<AgentWorkspaceFilters>(defaultAgentWorkspaceFilters)
  const [splitView, setSplitView] = useState(false)
  const [selectedSplitAgentIds, setSelectedSplitAgentIds] = useState<string[]>([
    "sales-agent",
    "executive-agent",
  ])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setAgents((previous) => {
        const liveMerged = previous.map((agent) => {
          const runtimeMatch = runtimeAgents.find((item) => item.id === agent.id)
          if (!runtimeMatch) {
            return agent
          }

          return {
            ...agent,
            status: toWorkspaceStatus(runtimeMatch.status),
            currentTask: runtimeMatch.currentTask,
            confidence: runtimeMatch.confidence,
            etaMinutes: Math.max(1, Math.round(runtimeMatch.etaSeconds / 60)),
          }
        })

        return mutateAgents(liveMerged)
      })

      setReasoningTimeline((previous) => rotateReasoningStages(previous))
      setTasks((previous) => cycleQueueTasks(previous))
      setTools((previous) => mutateTools(previous))
      setEvents((previous) => appendEvent(previous, selectedAgentId))
      setCollaboration((previous) => {
        const index = previous.findIndex((item) => item.status === "active")
        if (index === -1) {
          return previous.map((item, itemIndex) => ({ ...item, status: itemIndex === 0 ? "active" : "pending" }))
        }

        const nextIndex = (index + 1) % previous.length
        return previous.map((item, itemIndex) => ({
          ...item,
          status: itemIndex < nextIndex ? "completed" : itemIndex === nextIndex ? "active" : "pending",
        }))
      })
    }, 2200)

    return () => window.clearInterval(timer)
  }, [runtimeAgents, selectedAgentId])

  useEffect(() => {
    setTasks(createInitialTasks(selectedAgentId))
    setMemories(createInitialMemories(selectedAgentId))
    setDecisions(createInitialDecisions(selectedAgentId))
    setEvents(createInitialEvents(selectedAgentId))
    setReasoningTimeline(createInitialReasoningTimeline())
  }, [selectedAgentId])

  useEffect(() => {
    const timer = window.setInterval(() => {
      const active = agents.find((item) => item.id === selectedAgentId)
      if (!active) {
        return
      }

      setDecisions((previous) => appendDecision(previous, active.name))
    }, 6400)

    return () => window.clearInterval(timer)
  }, [agents, selectedAgentId])

  const selectedAgent = useMemo(
    () => agents.find((item) => item.id === selectedAgentId) ?? null,
    [agents, selectedAgentId]
  )

  const filteredAgents = useMemo(() => filterAgents(agents, filters), [agents, filters])
  const filteredTasks = useMemo(() => filterTasks(tasks, filters.priority), [tasks, filters.priority])

  const metrics = useMemo(
    () =>
      deriveMetrics(
        agents,
        filteredTasks,
        events,
        runtimeHealth.connection,
        runtimeHealth.latencyMs
      ),
    [agents, events, filteredTasks, runtimeHealth.connection, runtimeHealth.latencyMs]
  )

  const updateFilters = useCallback((patch: Partial<AgentWorkspaceFilters>) => {
    setFilters((previous) => ({ ...previous, ...patch }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(defaultAgentWorkspaceFilters)
  }, [])

  const toggleSplitAgent = useCallback((id: string) => {
    setSelectedSplitAgentIds((previous) => {
      const exists = previous.includes(id)
      if (exists) {
        return previous.filter((item) => item !== id)
      }

      if (previous.length >= 3) {
        return [...previous.slice(1), id]
      }

      return [...previous, id]
    })
  }, [])

  const setStatusFilter = useCallback((statuses: AgentWorkspaceStatus[]) => {
    setFilters((previous) => ({ ...previous, statuses }))
  }, [])

  const value = useMemo<AgentWorkspaceContextValue>(
    () => ({
      agents,
      selectedAgentId,
      reasoningTimeline,
      tasks,
      memories,
      tools,
      decisions,
      events,
      collaboration,
      filters,
      splitView,
      selectedSplitAgentIds,
      metrics: {
        ...metrics,
        queuedTasks: Math.max(metrics.queuedTasks, queueDepth),
      },
      selectedAgent,
      filteredAgents,
      filteredTasks,
      setSelectedAgentId,
      updateFilters,
      resetFilters,
      setSplitView,
      setSelectedSplitAgentIds,
      toggleSplitAgent,
      setStatusFilter,
    }),
    [
      agents,
      collaboration,
      decisions,
      events,
      filteredAgents,
      filteredTasks,
      filters,
      memories,
      metrics,
      queueDepth,
      reasoningTimeline,
      selectedAgent,
      selectedAgentId,
      selectedSplitAgentIds,
      setStatusFilter,
      splitView,
      tasks,
      toggleSplitAgent,
      tools,
      updateFilters,
      resetFilters,
    ]
  )

  return <AgentWorkspaceContext.Provider value={value}>{children}</AgentWorkspaceContext.Provider>
}

export function useAgentWorkspaceContext(): AgentWorkspaceContextValue {
  const context = useContext(AgentWorkspaceContext)
  if (!context) {
    throw new Error("useAgentWorkspaceContext must be used within AgentWorkspaceProvider")
  }

  return context
}
