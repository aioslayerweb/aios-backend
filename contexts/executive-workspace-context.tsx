"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { DecisionStatus, RuntimeStatus } from "@/src/domain"
import { useActivityFeedContext } from "@/contexts/activity-feed-context"
import { useAIAssistantContext } from "@/contexts/ai-assistant-context"
import { useNotificationContext } from "@/contexts/notification-context"
import { useRuntimeLiveContext } from "@/contexts/runtime-live-context"
import { useRuntimeStatusContext } from "@/contexts/runtime-status-context"
import { fetchRuntimeBusinessMetrics } from "@/lib/runtime"
import type {
  DecisionCenterItem,
  ExecutiveWorkspaceState,
  ExecutiveKPI,
  PriorityActionItem,
} from "@/types"
import {
  calculateBusinessScore,
  createExecutiveSummary,
  mockBusinessHealth,
  mockDecisionCenter,
  mockExecutiveBriefing,
  mockExecutiveKPIs,
  mockPriorityActions,
  mockQuickActions,
  mockTimeline,
} from "@/utils/executive-workspace"

type ExecutiveWorkspaceContextValue = ExecutiveWorkspaceState & {
  refresh: () => void
  approveDecision: (decisionId: string) => void
  deferPriorityAction: (actionId: string) => void
}

const ExecutiveWorkspaceContext = createContext<ExecutiveWorkspaceContextValue | null>(null)

export function ExecutiveWorkspaceProvider({ children }: { children: ReactNode }) {
  const { filteredActivities } = useActivityFeedContext()
  const { unreadCount } = useNotificationContext()
  const { agentStatuses } = useAIAssistantContext()
  const { overallHealth } = useRuntimeStatusContext()
  const { events: runtimeEvents, runningAgents: runtimeRunningAgents, memoryUpdates: runtimeMemoryUpdates } = useRuntimeLiveContext()

  const [loading, setLoading] = useState(false)
  const [priorities, setPriorities] = useState<PriorityActionItem[]>(mockPriorityActions)
  const [decisions, setDecisions] = useState<DecisionCenterItem[]>(mockDecisionCenter)
  const [kpis, setKpis] = useState(mockExecutiveKPIs)
  const [briefing, setBriefing] = useState(mockExecutiveBriefing)
  const [timeline, setTimeline] = useState(mockTimeline)
  const [health, setHealth] = useState(mockBusinessHealth)
  const [lastUpdated, setLastUpdated] = useState(Date.now())

  const runningAgents = runtimeRunningAgents || agentStatuses.filter((item) => item.status === "running").length

  useEffect(() => {
    let active = true

    const syncMetrics = async () => {
      try {
        const runtimeMetrics = await fetchRuntimeBusinessMetrics()
        if (!active) {
          return
        }

        if (runtimeMetrics.kpis.length > 0) {
          setKpis(
            runtimeMetrics.kpis.map((metric): ExecutiveKPI => ({
              id: metric.id,
              label: metric.label,
              value: metric.value,
              target: undefined,
              delta: metric.delta,
              trend: metric.trend,
            }))
          )
        }

        if (runtimeMetrics.briefing) {
          setBriefing(runtimeMetrics.briefing)
        }

        setLastUpdated(Date.now())
      } catch {
        if (!active) {
          return
        }
      }
    }

    void syncMetrics()

    return () => {
      active = false
    }
  }, [runtimeEvents.length, runtimeMemoryUpdates.length])

  useEffect(() => {
    if (runtimeEvents.length === 0) {
      return
    }

    setTimeline(
      runtimeEvents.slice(0, 6).map((event, index) => ({
        id: event.id,
        time: new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        title: event.title,
        kind: event.kind === "task-completed" ? "automation" : event.kind === "execution-failed" ? "ai" : index % 2 === 0 ? "meeting" : "communication",
        owner: event.category,
        status: event.kind === "task-completed" ? "completed" : "active",
      }))
    )
  }, [runtimeEvents])

  useEffect(() => {
    if (runtimeMemoryUpdates.length === 0) {
      return
    }

    setHealth((previous) =>
      previous.map((item, index) =>
        index === 0 ? { ...item, subtitle: `${runtimeMemoryUpdates.length} backend memory updates synced`, score: Math.min(99, item.score + runtimeMemoryUpdates.length) } : item
      )
    )
  }, [runtimeMemoryUpdates.length])

  const summary = useMemo(
    () =>
      createExecutiveSummary({
        organizationName: "AIOS Enterprise Group",
        workspaceName: "Executive Workspace",
        aiStatus:
          overallHealth === "error"
            ? RuntimeStatus.Error
            : overallHealth === "degraded" || overallHealth === "warning"
              ? RuntimeStatus.Degraded
              : RuntimeStatus.Running,
        todayPriorities: priorities.length,
        unreadNotifications: unreadCount,
        runningAgents,
      }),
    [overallHealth, priorities.length, runningAgents, unreadCount]
  )

  const state = useMemo<ExecutiveWorkspaceState>(
    () => ({
      loading,
      summary,
      health,
      priorities,
      briefing,
      timeline,
      kpis,
      decisions,
      quickActions: mockQuickActions,
      businessScore: calculateBusinessScore(health),
      lastUpdated,
    }),
    [briefing, decisions, health, kpis, lastUpdated, loading, priorities, summary, timeline]
  )

  const value = useMemo<ExecutiveWorkspaceContextValue>(
    () => ({
      ...state,
      refresh: () => {
        setLoading(true)
        window.setTimeout(() => {
          setLoading(false)
          setLastUpdated(Date.now())
        }, 280)
      },
      approveDecision: (decisionId: string) => {
        setDecisions((previous) =>
          previous.map((item) =>
            item.id === decisionId ? { ...item, status: DecisionStatus.Approved } : item
          )
        )
      },
      deferPriorityAction: (actionId: string) => {
        setPriorities((previous) => previous.filter((item) => item.id !== actionId))
      },
    }),
    [state]
  )

  const hasActivity = filteredActivities.length > 0

  if (!hasActivity) {
    return <ExecutiveWorkspaceContext.Provider value={value}>{children}</ExecutiveWorkspaceContext.Provider>
  }

  return <ExecutiveWorkspaceContext.Provider value={value}>{children}</ExecutiveWorkspaceContext.Provider>
}

export function useExecutiveWorkspaceContext(): ExecutiveWorkspaceContextValue {
  const context = useContext(ExecutiveWorkspaceContext)
  if (!context) {
    throw new Error("useExecutiveWorkspaceContext must be used within ExecutiveWorkspaceProvider")
  }

  return context
}
