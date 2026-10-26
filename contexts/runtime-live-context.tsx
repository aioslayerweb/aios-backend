"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { useAIAssistantContext } from "@/contexts/ai-assistant-context"
import { useRuntimeContext } from "@/contexts/runtime-context"
import { useRuntimeStatusContext } from "@/contexts/runtime-status-context"
import { loadWhenEnabled } from "@/lib/runtime/live-data-boundary"
import { RuntimeRequestError } from "@/lib/runtime/runtime-client"
import type {
  ActivitySource,
  ExecutionQueueItem,
  RuntimeEvent,
  RuntimeHealth,
  RuntimeLiveState,
} from "@/types"
import {
  createInitialAgents,
  createInitialExecutions,
  createInitialHealth,
  createInitialMemoryUpdates,
} from "@/utils/runtime-live"

const MAX_EVENTS = 120
const MAX_MEMORY_UPDATES = 40

type RuntimeLiveContextValue = RuntimeLiveState

const RuntimeLiveContext = createContext<RuntimeLiveContextValue | null>(null)

function toSourceKey(category: RuntimeEvent["category"]): ActivitySource["key"] {
  if (category === "system-events") {
    return "system"
  }

  if (category === "plugins") {
    return "plugin"
  }

  return category
}

function toExecutionStatus(status: ExecutionQueueItem["status"]): "queued" | "running" | "waiting" | "retrying" | "complete" | "failed" {
  if (status === "completed") {
    return "complete"
  }

  return status
}

export function RuntimeLiveProvider({
  children,
  liveDataEnabled,
  authorizationUnavailable = false,
}: {
  children: ReactNode
  liveDataEnabled: boolean
  authorizationUnavailable?: boolean
}) {
  const { setAiStatus, setMemoryStatus, setConnectionStatus } = useRuntimeContext()
  const { setConnectionState, updateModuleStatus } = useRuntimeStatusContext()
  const {
    setAgentStatuses,
    setExecutionTimeline,
    setMemoryEntries,
  } = useAIAssistantContext()

  const [events, setEvents] = useState<RuntimeEvent[]>([])
  const [agents, setAgents] = useState(createInitialAgents)
  const [executions, setExecutions] = useState(createInitialExecutions)
  const [memoryUpdates, setMemoryUpdates] = useState(createInitialMemoryUpdates)
  const [health, setHealth] = useState<RuntimeHealth>(createInitialHealth)
  const [runtimeError, setRuntimeError] = useState<RuntimeLiveState["runtimeError"]>(null)
  useEffect(() => {
    let active = true
    let controller: AbortController | null = null

    if (!liveDataEnabled) {
      setEvents([])
      setAgents([])
      setExecutions([])
      setMemoryUpdates([])
      setHealth(createInitialHealth())
      setRuntimeError(
        authorizationUnavailable
          ? {
              message: "Organization-scoped runtime access is not configured.",
              status: 503,
            }
          : null,
      )
      setAgentStatuses([])
      setExecutionTimeline([])
      setMemoryEntries([])
      setAiStatus("idle")
      setMemoryStatus("stale")
      setConnectionStatus("disconnected")
      setConnectionState("disconnected")
      if (authorizationUnavailable) {
        updateModuleStatus("ai-runtime", {
          status: "offline",
          label: "Unavailable",
          description: "Runtime access is disabled until server-verified identity, membership, and event ownership are available.",
        })
        updateModuleStatus("memory", {
          status: "offline",
          label: "Unavailable",
          description: "Runtime memory is unavailable until organization-scoped event access is verified.",
        })
        updateModuleStatus("supabase", {
          status: "unknown",
          label: "Not used for runtime",
          description: "Browser-side database access is not used as runtime authorization.",
        })
      }
      return () => {
        active = false
      }
    }

    const syncSnapshot = async () => {
      controller?.abort()
      const requestController = new AbortController()
      controller = requestController
      try {
        const snapshot = await loadWhenEnabled(liveDataEnabled, async () => {
          const { loadRuntimeLiveSnapshot } = await import("@/lib/runtime")
          return loadRuntimeLiveSnapshot({ signal: requestController.signal })
        })
        if (!active || requestController.signal.aborted || !snapshot) {
          return
        }

        setRuntimeError(null)
        setEvents(snapshot.events)
        setAgents(snapshot.agents)
        setExecutions(snapshot.executions)
        setMemoryUpdates(snapshot.memoryUpdates)
        setHealth(snapshot.health)

        setAgentStatuses(
          snapshot.agents.map((agent) => ({
            id: agent.id,
            name: agent.name,
            status: agent.status,
            progress: agent.progress,
            step: agent.currentTask,
            confidence: agent.confidence,
            reasoningStage: agent.reasoningStage,
            etaSeconds: agent.etaSeconds,
            recentActions: agent.recentActions,
          }))
        )

        setExecutionTimeline(
          snapshot.executions.map((item) => ({
            id: item.id,
            label: item.label,
            status: toExecutionStatus(item.status),
            timestamp: item.updatedAt,
          }))
        )

        setMemoryEntries((previous) => {
          const existing = new Set(previous.map((item) => item.id))
          const next = snapshot.memoryUpdates
            .filter((item) => !existing.has(item.id))
            .map((item) => ({
              id: item.id,
              title: item.title,
              summary: item.summary,
              pinned: item.lane === "long-term" || item.lane === "knowledge",
              timestamp: item.timestamp,
            }))

          return [...next, ...previous].slice(0, 12)
        })

        setAiStatus(snapshot.runningAgents > 0 ? "running" : "idle")
        setMemoryStatus(snapshot.memoryUpdates.length > 0 ? "syncing" : "synced")
        setConnectionStatus(snapshot.source === "fallback" ? "disconnected" : "connected")

        setConnectionState(snapshot.source === "fallback" ? "reconnecting" : "connected")
        updateModuleStatus("ai-runtime", {
          status: snapshot.runningAgents > 0 ? "active" : "healthy",
          label: `${snapshot.runningAgents} running`,
          description: snapshot.events[0]?.summary ?? "Live runtime snapshot synced from backend.",
        })
        updateModuleStatus("agents", {
          status: snapshot.runningAgents > 0 ? "active" : "healthy",
          label: `${snapshot.runningAgents} Active`,
          description: "Agent runtime state is synced from backend data.",
        })
        updateModuleStatus("memory", {
          status: snapshot.memoryUpdates.length > 0 ? "synchronizing" : "healthy",
          label: `${snapshot.memoryUpdates.length} updates`,
          description: "Live memory stream and replay data are synchronized.",
        })
        updateModuleStatus("automation", {
          status: snapshot.queueDepth > 0 ? "active" : "healthy",
          label: `${snapshot.businessMetrics.workflowCount} workflows`,
          description: "Workflow state now reflects backend runtime signals.",
        })
        updateModuleStatus("supabase", {
          status: snapshot.source === "fallback" ? "degraded" : "healthy",
          label: snapshot.source === "fallback" ? "Fallback" : "Connected",
          description: snapshot.source === "fallback" ? "Backend data is unavailable; using fallback state." : "Backend runtime data is connected.",
        })

      } catch (error: unknown) {
        if (!active || requestController.signal.aborted) {
          return
        }
        setEvents([])
        setAgents([])
        setExecutions([])
        setMemoryUpdates([])
        setHealth(createInitialHealth())
        setRuntimeError({
          message:
            error instanceof RuntimeRequestError && (error.status === 401 || error.status === 403)
              ? "Runtime access was denied."
              : error instanceof RuntimeRequestError && error.status === 503
                ? "Organization-scoped runtime access is not configured."
                : error instanceof RuntimeRequestError
                  ? `Runtime request failed with status ${error.status}.`
                  : "Runtime data could not be loaded due to a network or response error.",
          status: error instanceof RuntimeRequestError ? error.status : null,
        })
        setAgentStatuses([])
        setExecutionTimeline([])
        setMemoryEntries([])
        setAiStatus("degraded")
        setMemoryStatus("stale")
        setConnectionStatus("disconnected")
        setConnectionState("disconnected")
      }
    }

    void syncSnapshot()
    const timer = window.setInterval(() => {
      void syncSnapshot()
    }, 3500)

    return () => {
      active = false
      window.clearInterval(timer)
      controller?.abort()
    }
  }, [
    setAgentStatuses,
    setExecutionTimeline,
    setMemoryEntries,
    setAiStatus,
    setMemoryStatus,
    setConnectionStatus,
    setConnectionState,
    updateModuleStatus,
    liveDataEnabled,
    authorizationUnavailable,
    updateModuleStatus,
  ])

  const runningAgents = agents.filter((agent) => agent.status === "running").length
  const pendingTasks = executions.filter((item) => item.status === "queued" || item.status === "waiting" || item.status === "retrying").length
  const queueDepth = executions.length

  const value = useMemo<RuntimeLiveContextValue>(
    () => ({
      events: liveDataEnabled ? events : [],
      agents: liveDataEnabled ? agents : [],
      executions: liveDataEnabled ? executions : [],
      memoryUpdates: liveDataEnabled ? memoryUpdates : [],
      health: liveDataEnabled ? health : createInitialHealth(),
      runtimeError: liveDataEnabled ? runtimeError : null,
      runningAgents: liveDataEnabled ? runningAgents : 0,
      pendingTasks: liveDataEnabled ? pendingTasks : 0,
      queueDepth: liveDataEnabled ? queueDepth : 0,
    }),
    [agents, events, executions, health, liveDataEnabled, memoryUpdates, pendingTasks, queueDepth, runningAgents, runtimeError]
  )

  return <RuntimeLiveContext.Provider value={value}>{children}</RuntimeLiveContext.Provider>
}

export function useRuntimeLiveContext(): RuntimeLiveContextValue {
  const context = useContext(RuntimeLiveContext)
  if (!context) {
    throw new Error("useRuntimeLiveContext must be used within RuntimeLiveProvider")
  }

  return context
}
