"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import type {
  ActivityEventBridge,
  ActivityFeedState,
  ActivityFilter,
  ActivityGroupKey,
  ActivityItem,
} from "@/types"
import { useAIAssistantContext } from "@/contexts/ai-assistant-context"
import { useCommandPaletteContext } from "@/contexts/command-palette-context"
import { useNotificationContext } from "@/contexts/notification-context"
import { useRuntimeLiveContext } from "@/contexts/runtime-live-context"
import { useRuntimeStatusContext } from "@/contexts/runtime-status-context"
import type { RuntimeEvent } from "@/types"
import {
  applyActivityFilters,
  buildActivityTimeline,
  defaultActivityFilters,
  mockActivityFeed,
} from "@/utils/activity-feed"

type ActivityFeedContextValue = ActivityFeedState & {
  selectedActivity: ActivityItem | null
  setFilters: (next: Partial<ActivityFilter>) => void
  resetFilters: () => void
  setSelectedActivityId: (id: string | null) => void
  markRead: (id: string, unread?: boolean) => void
  togglePinned: (id: string) => void
  toggleGroupExpanded: (group: ActivityGroupKey) => void
  addActivity: (item: ActivityItem) => void
  setLoading: (value: boolean) => void
  bridge: ActivityEventBridge
}

const ActivityFeedContext = createContext<ActivityFeedContextValue | null>(null)

function makeSystemEvent(partial: Partial<ActivityItem>): ActivityItem {
  return {
    id: partial.id ?? `evt-${crypto.randomUUID()}`,
    title: partial.title ?? "System Event",
    summary: partial.summary ?? "Runtime signal detected.",
    timestamp: partial.timestamp ?? Date.now(),
    category: partial.category ?? "system-events",
    source: partial.source ?? {
      key: "system",
      label: "System",
      workspace: "Platform",
    },
    actor: partial.actor ?? {
      id: "system",
      name: "AIOS System",
      kind: "system",
    },
    priority: partial.priority ?? "medium",
    pinned: partial.pinned ?? false,
    unread: partial.unread ?? true,
    metadata: partial.metadata ?? {
      eventType: "System Connected",
      workspace: "Platform",
      status: "info",
      relatedObjects: [],
      tags: ["system"],
    },
    agent: partial.agent,
    user: partial.user,
  }
}

function runtimeEventToActivity(event: RuntimeEvent): ActivityItem {
  return makeSystemEvent({
    id: event.id,
    title: event.title,
    summary: event.summary,
    timestamp: event.timestamp,
    category: event.category,
    priority: event.priority,
    source:
      event.category === "memory"
        ? { key: "memory", label: "Runtime Memory", workspace: "Knowledge" }
        : event.category === "agents"
          ? { key: "agents", label: "Runtime Agents", workspace: "Orchestrator" }
          : event.category === "automations"
            ? { key: "automations", label: "Runtime Automations", workspace: "Workflows" }
            : { key: "ai-runtime", label: "AI Runtime", workspace: "Executive" },
    actor: {
      id: `runtime-${event.id}`,
      name: "AIOS Runtime Engine",
      kind: "system",
    },
    metadata: {
      eventType:
        event.kind === "execution-failed"
          ? "Error"
          : event.kind === "task-completed"
            ? "Task Completed"
            : event.kind === "agent-executing"
              ? "Agent Started"
              : event.kind === "decision-made"
                ? "AI Decision"
                : "Automation Executed",
      workspace:
        event.category === "memory"
          ? "Knowledge"
          : event.category === "agents"
            ? "Orchestrator"
            : event.category === "automations"
              ? "Workflows"
              : "Executive",
      status:
        event.kind === "execution-failed"
          ? "error"
          : event.kind === "task-completed"
            ? "completed"
            : event.kind === "agent-executing"
              ? "running"
              : "info",
      relatedObjects: [{ type: "runtime-event", id: event.id, label: event.title }],
      tags: [event.kind, event.category],
      replayToken: event.id,
    },
  })
}

export function ActivityFeedProvider({ children }: { children: ReactNode }) {
  const { unreadCount } = useNotificationContext()
  const { overallHealth, connectionState, modules } = useRuntimeStatusContext()
  const { agentStatuses } = useAIAssistantContext()
  const { events: runtimeEvents } = useRuntimeLiveContext()
  const { isOpen: isSearchOpen, query: searchQuery } = useCommandPaletteContext()

  const [activities, setActivities] = useState<ActivityItem[]>(() => mockActivityFeed())
  const [filters, setFiltersState] = useState<ActivityFilter>(defaultActivityFilters)
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedGroups, setExpandedGroups] = useState<Record<ActivityGroupKey, boolean>>({
    today: true,
    yesterday: true,
    "this-week": true,
    earlier: false,
  })

  const [externalSearchQuery, setExternalSearchQuery] = useState("")
  const [liveUpdatesEnabled] = useState(true)

  const previousHealthRef = useRef(overallHealth)
  const previousConnectionRef = useRef(connectionState)
  const previousUnreadRef = useRef(unreadCount)
  const previousRunningAgentsRef = useRef(
    agentStatuses.filter((entry) => entry.status === "running").length
  )

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false)
    }, 350)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (runtimeEvents.length === 0) {
      return
    }

    setActivities((previous) => {
      const existing = new Set(previous.map((item) => item.id))
      const next = runtimeEvents
        .slice(0, 24)
        .map(runtimeEventToActivity)
        .filter((item) => !existing.has(item.id))

      return [...next, ...previous].slice(0, 10_000)
    })
    setLoading(false)
  }, [runtimeEvents])

  useEffect(() => {
    if (!isSearchOpen) {
      setExternalSearchQuery("")
      return
    }

    setExternalSearchQuery(searchQuery)
  }, [isSearchOpen, searchQuery])

  const addActivity = useCallback((item: ActivityItem) => {
    setActivities((previous) => [item, ...previous].slice(0, 10_000))
  }, [])

  useEffect(() => {
    if (previousHealthRef.current === overallHealth) {
      return
    }

    previousHealthRef.current = overallHealth
    addActivity(
      makeSystemEvent({
        title: "Runtime health changed",
        summary: `Overall runtime health moved to ${overallHealth}.`,
        priority: overallHealth === "error" ? "critical" : overallHealth === "warning" ? "high" : "medium",
        metadata: {
          eventType: overallHealth === "error" ? "Error" : overallHealth === "warning" ? "Warning" : "System Connected",
          workspace: "Platform",
          status: overallHealth === "error" ? "error" : overallHealth === "warning" ? "warning" : "info",
          relatedObjects: [{ type: "runtime", id: "runtime-health", label: "Runtime Health" }],
          tags: ["runtime", "health"],
        },
      })
    )
  }, [addActivity, overallHealth])

  useEffect(() => {
    if (previousConnectionRef.current === connectionState) {
      return
    }

    previousConnectionRef.current = connectionState
    addActivity(
      makeSystemEvent({
        title: connectionState === "connected" ? "System connected" : "System connection changed",
        summary:
          connectionState === "connected"
            ? "Primary system channels are online."
            : "Connectivity changed; runtime will continue monitoring.",
        priority: connectionState === "connected" ? "low" : "high",
        metadata: {
          eventType: "System Connected",
          workspace: "Platform",
          status: connectionState === "connected" ? "success" : "warning",
          relatedObjects: [{ type: "connection", id: "platform-connection", label: "Platform Link" }],
          tags: ["system", "connection"],
        },
      })
    )
  }, [addActivity, connectionState])

  useEffect(() => {
    if (previousUnreadRef.current === unreadCount) {
      return
    }

    previousUnreadRef.current = unreadCount
    addActivity(
      makeSystemEvent({
        title: "Notification center updated",
        summary: `${unreadCount} unread notifications currently queued.`,
        category: "notifications",
        source: { key: "notifications", label: "Notification Center", workspace: "Executive" },
        priority: unreadCount > 10 ? "high" : "medium",
        metadata: {
          eventType: unreadCount > 10 ? "Warning" : "Automation Executed",
          workspace: "Executive",
          status: unreadCount > 10 ? "warning" : "info",
          relatedObjects: [{ type: "notification", id: "notif-queue", label: "Notification Queue" }],
          tags: ["notifications", "queue"],
        },
      })
    )
  }, [addActivity, unreadCount])

  useEffect(() => {
    const runningAgents = agentStatuses.filter((entry) => entry.status === "running").length
    if (runningAgents === previousRunningAgentsRef.current) {
      return
    }

    previousRunningAgentsRef.current = runningAgents

    addActivity(
      makeSystemEvent({
        title: "Agent execution updated",
        summary: `${runningAgents} agents currently running across the AI assistant panel.`,
        category: "agents",
        source: { key: "agents", label: "Agents", workspace: "Executive" },
        priority: runningAgents > 2 ? "high" : "medium",
        metadata: {
          eventType: runningAgents > 0 ? "Agent Started" : "Agent Finished",
          workspace: "Executive",
          status: runningAgents > 0 ? "running" : "completed",
          relatedObjects: [{ type: "module", id: "agents-runtime", label: "Agents Runtime" }],
          tags: ["agents", "assistant", ...modules.slice(0, 2).map((item) => item.key)],
        },
      })
    )
  }, [addActivity, agentStatuses, modules])

  const setFilters = useCallback((next: Partial<ActivityFilter>) => {
    setFiltersState((previous) => ({ ...previous, ...next }))
  }, [])

  const resetFilters = useCallback(() => {
    setFiltersState(defaultActivityFilters)
  }, [])

  const markRead = useCallback((id: string, unread = false) => {
    setActivities((previous) =>
      previous.map((item) => (item.id === id ? { ...item, unread } : item))
    )
  }, [])

  const togglePinned = useCallback((id: string) => {
    setActivities((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              pinned: !item.pinned,
            }
          : item
      )
    )
  }, [])

  const toggleGroupExpanded = useCallback((group: ActivityGroupKey) => {
    setExpandedGroups((previous) => ({
      ...previous,
      [group]: !previous[group],
    }))
  }, [])

  const activeQuery = externalSearchQuery.trim().length > 0 ? externalSearchQuery : filters.query

  const filteredActivities = useMemo(
    () =>
      applyActivityFilters(activities, {
        ...filters,
        query: activeQuery,
      }),
    [activities, activeQuery, filters]
  )

  const timeline = useMemo(
    () => buildActivityTimeline(activities, filteredActivities),
    [activities, filteredActivities]
  )

  const selectedActivity = useMemo(
    () => activities.find((item) => item.id === selectedActivityId) ?? null,
    [activities, selectedActivityId]
  )

  const bridge = useMemo<ActivityEventBridge>(
    () => ({
      publishRuntimeEvent: (event) => {
        addActivity(makeSystemEvent(event))
      },
      connectEventStore: async () => Promise.resolve(),
      connectReplayEngine: async () => Promise.resolve(),
      connectPersistentMemory: async () => Promise.resolve(),
    }),
    [addActivity]
  )

  const value = useMemo<ActivityFeedContextValue>(
    () => ({
      activities,
      filteredActivities,
      timeline,
      filters,
      selectedActivityId,
      selectedActivity,
      loading,
      expandedGroups,
      liveUpdatesEnabled,
      externalSearchQuery,
      setFilters,
      resetFilters,
      setSelectedActivityId,
      markRead,
      togglePinned,
      toggleGroupExpanded,
      addActivity,
      setLoading,
      bridge,
    }),
    [
      activities,
      addActivity,
      bridge,
      expandedGroups,
      externalSearchQuery,
      filteredActivities,
      filters,
      liveUpdatesEnabled,
      loading,
      markRead,
      resetFilters,
      selectedActivity,
      selectedActivityId,
      setFilters,
      timeline,
      toggleGroupExpanded,
      togglePinned,
    ]
  )

  return (
    <ActivityFeedContext.Provider value={value}>
      {children}
    </ActivityFeedContext.Provider>
  )
}

export function useActivityFeedContext(): ActivityFeedContextValue {
  const context = useContext(ActivityFeedContext)
  if (!context) {
    throw new Error("useActivityFeedContext must be used within ActivityFeedProvider")
  }

  return context
}
