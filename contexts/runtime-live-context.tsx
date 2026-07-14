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
import { loadRuntimeLiveSnapshot } from "@/lib/runtime"
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

export function RuntimeLiveProvider({ children }: { children: ReactNode }) {
  const runtime = useRuntimeContext()
  const runtimeStatus = useRuntimeStatusContext()
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
  useEffect(() => {
    let active = true
    const syncSnapshot = async () => {
      try {
        const snapshot = await loadRuntimeLiveSnapshot()
        if (!active) {
          return
        }

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

        runtime.setAiStatus(snapshot.runningAgents > 0 ? "running" : "idle")
        runtime.setMemoryStatus(snapshot.memoryUpdates.length > 0 ? "syncing" : "synced")
        runtime.setConnectionStatus(snapshot.source === "fallback" ? "disconnected" : "connected")

        runtimeStatus.setWebsocketState({
          mode: snapshot.source === "fallback" ? "connecting" : "connected",
          enabled: snapshot.source !== "fallback",
        })
        runtimeStatus.setConnectionState(snapshot.source === "fallback" ? "reconnecting" : "connected")
        runtimeStatus.updateModuleStatus("ai-runtime", {
          status: snapshot.runningAgents > 0 ? "active" : "healthy",
          label: `${snapshot.runningAgents} running`,
          description: snapshot.events[0]?.summary ?? "Live runtime snapshot synced from backend.",
        })
        runtimeStatus.updateModuleStatus("agents", {
          status: snapshot.runningAgents > 0 ? "active" : "healthy",
          label: `${snapshot.runningAgents} Active`,
          description: "Agent runtime state is synced from backend data.",
        })
        runtimeStatus.updateModuleStatus("memory", {
          status: snapshot.memoryUpdates.length > 0 ? "synchronizing" : "healthy",
          label: `${snapshot.memoryUpdates.length} updates`,
          description: "Live memory stream and replay data are synchronized.",
        })
        runtimeStatus.updateModuleStatus("automation", {
          status: snapshot.queueDepth > 0 ? "active" : "healthy",
          label: `${snapshot.businessMetrics.workflowCount} workflows`,
          description: "Workflow state now reflects backend runtime signals.",
        })
        runtimeStatus.updateModuleStatus("supabase", {
          status: snapshot.source === "fallback" ? "degraded" : "healthy",
          label: snapshot.source === "fallback" ? "Fallback" : "Connected",
          description: snapshot.source === "fallback" ? "Backend data is unavailable; using fallback state." : "Backend runtime data is connected.",
        })

      } catch {
        if (!active) {
          return
        }
      }
    }

    void syncSnapshot()
    const timer = window.setInterval(() => {
      void syncSnapshot()
    }, 3500)

    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [runtime, runtimeStatus, setAgentStatuses, setExecutionTimeline, setMemoryEntries])

  const runningAgents = agents.filter((agent) => agent.status === "running").length
  const pendingTasks = executions.filter((item) => item.status === "queued" || item.status === "waiting" || item.status === "retrying").length
  const queueDepth = executions.length

  const value = useMemo<RuntimeLiveContextValue>(
    () => ({
      events,
      agents,
      executions,
      memoryUpdates,
      health,
      runningAgents,
      pendingTasks,
      queueDepth,
    }),
    [agents, events, executions, health, memoryUpdates, pendingTasks, queueDepth, runningAgents]
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
