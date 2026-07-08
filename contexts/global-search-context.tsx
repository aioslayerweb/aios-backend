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
import { useAgentWorkspaceContext } from "@/contexts/agent-workspace-context"
import { useCommandPaletteContext } from "@/contexts/command-palette-context"
import { useMemoryContext } from "@/contexts/memory-context"
import { useNotificationContext } from "@/contexts/notification-context"
import { useRuntimeLiveContext } from "@/contexts/runtime-live-context"
import type {
  GlobalSearchState,
  SearchDepartment,
  SearchBookmark,
  SearchFilters,
  SearchHistoryEntry,
  SearchInspectorModel,
  SearchResult,
  SearchSourceKey,
} from "@/types"
import {
  applySearchFilters,
  defaultGlobalSearchState,
  mockRelatedEntities,
  mockStaticSearchResults,
} from "@/utils/global-search"

const BOOKMARKS_KEY = "aios.search.bookmarks"
const RECENT_KEY = "aios.search.recent"

type GlobalSearchContextValue = GlobalSearchState & {
  selectedResult: SearchResult | null
  inspector: SearchInspectorModel
  setQuery: (value: string) => void
  setAiMode: (enabled: boolean) => void
  setSelectedResultId: (id: string | null) => void
  setFilters: (patch: Partial<SearchFilters>) => void
  toggleSource: (source: SearchSourceKey) => void
  toggleBookmark: (resultId: string, pinned?: boolean) => void
  commitSearch: (value: string) => void
}

const GlobalSearchContext = createContext<GlobalSearchContextValue | null>(null)

function inferPriority(value: string): SearchResult["priority"] {
  if (value === "critical") {
    return "critical"
  }
  if (value === "high") {
    return "high"
  }
  if (value === "medium") {
    return "medium"
  }
  return "low"
}

function notificationPriority(value: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"): SearchResult["priority"] {
  if (value === "CRITICAL") {
    return "critical"
  }

  if (value === "HIGH") {
    return "high"
  }

  if (value === "MEDIUM") {
    return "medium"
  }

  return "low"
}

function executionPriority(status: "queued" | "running" | "waiting" | "completed" | "failed" | "retrying"): SearchResult["priority"] {
  if (status === "failed") {
    return "high"
  }

  if (status === "retrying" || status === "running") {
    return "medium"
  }

  return "low"
}

function toSourceTag(source: SearchResult["source"]): string[] {
  return [source, "indexed"]
}

function agentPriority(status: "idle" | "running" | "waiting" | "failed" | "completed"): SearchResult["priority"] {
  if (status === "failed") {
    return "high"
  }

  if (status === "running") {
    return "medium"
  }

  return "low"
}

function agentDepartment(value: string): SearchDepartment {
  if (
    value === "executive" ||
    value === "sales" ||
    value === "operations" ||
    value === "support" ||
    value === "knowledge" ||
    value === "finance" ||
    value === "marketing" ||
    value === "hr"
  ) {
    return value
  }

  return "platform"
}

export function GlobalSearchProvider({ children }: { children: ReactNode }) {
  const memory = useMemoryContext()
  const activity = useActivityFeedContext()
  const notifications = useNotificationContext()
  const runtime = useRuntimeLiveContext()
  const agentWorkspace = useAgentWorkspaceContext()
  const commandPalette = useCommandPaletteContext()

  const defaults = useMemo(() => defaultGlobalSearchState(), [])

  const [query, setQuery] = useState(defaults.query)
  const [filters, setFiltersState] = useState(defaults.filters)
  const [aiMode, setAiMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null)
  const [bookmarks, setBookmarks] = useState<SearchBookmark[]>([])
  const [recentSearches, setRecentSearches] = useState<SearchHistoryEntry[]>([])

  useEffect(() => {
    try {
      const rawBookmarks = window.localStorage.getItem(BOOKMARKS_KEY)
      const rawRecent = window.localStorage.getItem(RECENT_KEY)

      if (rawBookmarks) {
        const parsed = JSON.parse(rawBookmarks)
        if (Array.isArray(parsed)) {
          setBookmarks(
            parsed
              .filter(
                (item): item is SearchBookmark =>
                  typeof item === "object" &&
                  item !== null &&
                  typeof item.resultId === "string" &&
                  typeof item.createdAt === "number"
              )
              .slice(0, 120)
          )
        }
      }

      if (rawRecent) {
        const parsed = JSON.parse(rawRecent)
        if (Array.isArray(parsed)) {
          setRecentSearches(
            parsed
              .filter(
                (item): item is SearchHistoryEntry =>
                  typeof item === "object" &&
                  item !== null &&
                  typeof item.query === "string" &&
                  typeof item.timestamp === "number"
              )
              .slice(0, 24)
          )
        }
      }
    } catch {
      // Ignore local storage parsing failures.
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
  }, [bookmarks])

  useEffect(() => {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(recentSearches))
  }, [recentSearches])

  const indexedResults = useMemo<SearchResult[]>(() => {
    const now = Date.now()

    const memoryResults = memory.entries.map((item) => ({
      id: `memory-${item.id}`,
      title: `Memory ${item.contextId}`,
      summary: item.summary,
      source: "memory" as const,
      category: "Memory",
      confidence: 72,
      timestamp: item.createdAt,
      priority: "medium" as const,
      tags: ["memory", item.contextId],
      department: "platform" as const,
      referenceId: item.id,
      metadata: {
        contextId: item.contextId,
      },
    }))

    const activityResults = activity.activities.map((item) => ({
      id: `activity-${item.id}`,
      title: item.title,
      summary: item.summary,
      source: "activity" as const,
      category: "Activity",
      confidence: item.priority === "critical" ? 92 : item.priority === "high" ? 86 : 78,
      timestamp: item.timestamp,
      priority: inferPriority(item.priority),
      tags: [...toSourceTag("activity"), ...item.metadata.tags.slice(0, 4)],
      department: "platform" as const,
      referenceId: item.id,
      metadata: {
        eventType: item.metadata.eventType,
        source: item.source.label,
      },
    }))

    const notificationResults = notifications.notifications.map((item) => ({
      id: `notification-${item.id}`,
      title: item.title,
      summary: item.description ?? "Notification without details",
      source: "notifications" as const,
      category: "Notification",
      confidence: item.priority === "CRITICAL" ? 91 : item.priority === "HIGH" ? 84 : 74,
      timestamp: item.createdAt,
      priority: notificationPriority(item.priority),
      tags: ["notification", item.category.toLowerCase()],
      department: "platform" as const,
      referenceId: item.id,
      metadata: {
        level: item.level,
        category: item.category,
      },
    }))

    const runtimeEventResults = runtime.events.map((item) => ({
      id: `runtime-event-${item.id}`,
      title: item.title,
      summary: item.summary,
      source: "runtime-events" as const,
      category: "Runtime Event",
      confidence: item.priority === "critical" ? 95 : 82,
      timestamp: item.timestamp,
      priority: inferPriority(item.priority),
      tags: ["runtime", item.kind],
      department: "platform" as const,
      referenceId: item.id,
      metadata: {
        kind: item.kind,
      },
    }))

    const executionResults = runtime.executions.map((item) => ({
      id: `execution-${item.id}`,
      title: item.label,
      summary: `Execution ${item.status} in queue.`,
      source: "executions" as const,
      category: "Execution",
      confidence: item.status === "failed" ? 68 : 85,
      timestamp: item.updatedAt,
      priority: executionPriority(item.status),
      tags: ["execution", item.status],
      department: "operations" as const,
      referenceId: item.id,
      metadata: {
        status: item.status,
      },
    }))

    const agentResults = agentWorkspace.agents.map((item) => ({
      id: `agent-${item.id}`,
      title: item.name,
      summary: item.currentTask,
      source: "agents" as const,
      category: "Agent",
      confidence: item.confidence,
      timestamp: now - item.etaMinutes * 60 * 1000,
      priority: agentPriority(item.status),
      tags: ["agent", item.department, item.status],
      department: agentDepartment(item.department),
      referenceId: item.id,
      metadata: {
        status: item.status,
        health: item.health,
      },
    }))

    const taskResults = agentWorkspace.tasks.map((item) => ({
      id: `task-${item.id}`,
      title: item.title,
      summary: `Task ${item.status} with ${item.priority} priority.`,
      source: "tasks" as const,
      category: "Task",
      confidence: item.status === "failed" ? 62 : 80,
      timestamp: item.updatedAt,
      priority: item.priority,
      tags: ["task", item.status, item.priority],
      department: "operations" as const,
      referenceId: item.id,
      metadata: {
        ownerAgentId: item.ownerAgentId,
      },
    }))

    const commandResults = commandPalette.commands.map((item) => ({
      id: `command-${item.id}`,
      title: item.title,
      summary: item.description,
      source: "commands" as const,
      category: "Command",
      confidence: item.pinned ? 90 : 76,
      timestamp: now,
      priority: item.pinned ? ("high" as const) : ("low" as const),
      tags: ["command", item.group, ...item.keywords.slice(0, 3)],
      department: "platform" as const,
      referenceId: item.id,
      metadata: {
        group: item.group,
        type: item.type,
      },
    }))

    return [
      ...memoryResults,
      ...activityResults,
      ...notificationResults,
      ...runtimeEventResults,
      ...executionResults,
      ...agentResults,
      ...taskResults,
      ...commandResults,
      ...mockStaticSearchResults(),
    ]
  }, [
    activity.activities,
    agentWorkspace.agents,
    agentWorkspace.tasks,
    commandPalette.commands,
    memory.entries,
    notifications.notifications,
    runtime.events,
    runtime.executions,
  ])

  const filteredResults = useMemo(
    () => applySearchFilters(indexedResults, filters, query),
    [filters, indexedResults, query]
  )

  const aiResults = useMemo<SearchResult[]>(() => {
    if (!aiMode || !query.trim()) {
      return []
    }

    return [
      {
        id: `ai-result-${Date.now()}`,
        title: `AI Insight: ${query}`,
        summary: "Simulated AI explanation generated from indexed activity, runtime, and memory sources.",
        source: "vector-placeholder",
        category: "AI Search",
        confidence: 87,
        timestamp: Date.now(),
        priority: "medium",
        tags: ["ai-search", "simulated", "prompt-os-ready"],
        department: "platform",
        referenceId: `ai-${Date.now()}`,
        metadata: {
          mode: "ai",
        },
      },
    ]
  }, [aiMode, query])

  const visibleResults = useMemo(
    () => [...aiResults, ...filteredResults],
    [aiResults, filteredResults]
  )

  useEffect(() => {
    setLoading(true)
    const timer = window.setTimeout(() => {
      setLoading(false)
    }, 90)

    return () => window.clearTimeout(timer)
  }, [query, filters])

  useEffect(() => {
    if (!selectedResultId && visibleResults.length > 0) {
      setSelectedResultId(visibleResults[0].id)
    }
  }, [selectedResultId, visibleResults])

  const selectedResult = useMemo(
    () => visibleResults.find((item) => item.id === selectedResultId) ?? null,
    [selectedResultId, visibleResults]
  )

  const inspector = useMemo<SearchInspectorModel>(() => {
    const result = selectedResult

    return {
      result,
      related: mockRelatedEntities(result),
      timeline:
        result
          ? [
              { id: `${result.id}-1`, label: "Indexed into global search", timestamp: result.timestamp - 4_000 },
              { id: `${result.id}-2`, label: "Connected relationships resolved", timestamp: result.timestamp - 2_000 },
              { id: `${result.id}-3`, label: "Ready for explorer actions", timestamp: result.timestamp },
            ]
          : [],
      linkedMemories: memory.entries.slice(0, 4).map((entry) => ({
        id: entry.id,
        summary: entry.summary,
        timestamp: entry.createdAt,
      })),
      associatedAgents: agentWorkspace.agents.slice(0, 4).map((agent) => ({
        id: agent.id,
        name: agent.name,
        status: agent.status,
      })),
    }
  }, [agentWorkspace.agents, memory.entries, selectedResult])

  const setFilters = useCallback((patch: Partial<SearchFilters>) => {
    setFiltersState((previous) => ({ ...previous, ...patch }))
  }, [])

  const toggleSource = useCallback((source: SearchSourceKey) => {
    setFiltersState((previous) => {
      const exists = previous.sources.includes(source)
      return {
        ...previous,
        sources: exists
          ? previous.sources.filter((item) => item !== source)
          : [...previous.sources, source],
      }
    })
  }, [])

  const toggleBookmark = useCallback((resultId: string, pinned = false) => {
    setBookmarks((previous) => {
      const existing = previous.find((item) => item.resultId === resultId)
      if (existing) {
        return previous.filter((item) => item.resultId !== resultId)
      }

      return [{ resultId, pinned, createdAt: Date.now() }, ...previous].slice(0, 120)
    })
  }, [])

  const commitSearch = useCallback((value: string) => {
    const normalized = value.trim()
    if (!normalized) {
      return
    }

    setRecentSearches((previous) => {
      const deduped = previous.filter((item) => item.query.toLowerCase() !== normalized.toLowerCase())
      return [{ query: normalized, timestamp: Date.now() }, ...deduped].slice(0, 24)
    })
  }, [])

  const value = useMemo<GlobalSearchContextValue>(
    () => ({
      query,
      filters,
      aiMode,
      loading,
      selectedResultId,
      bookmarks,
      recentSearches,
      results: indexedResults,
      filteredResults: visibleResults,
      knowledgeCollections: defaults.knowledgeCollections,
      memoryExplorer: defaults.memoryExplorer,
      suggestedSearches: defaults.suggestedSearches,
      selectedResult,
      inspector,
      setQuery,
      setAiMode,
      setSelectedResultId,
      setFilters,
      toggleSource,
      toggleBookmark,
      commitSearch,
    }),
    [
      aiMode,
      bookmarks,
      defaults.knowledgeCollections,
      defaults.memoryExplorer,
      defaults.suggestedSearches,
      visibleResults,
      filters,
      indexedResults,
      inspector,
      loading,
      query,
      recentSearches,
      selectedResult,
      selectedResultId,
      setFilters,
      toggleSource,
      toggleBookmark,
      commitSearch,
    ]
  )

  return <GlobalSearchContext.Provider value={value}>{children}</GlobalSearchContext.Provider>
}

export function useGlobalSearchContext(): GlobalSearchContextValue {
  const context = useContext(GlobalSearchContext)
  if (!context) {
    throw new Error("useGlobalSearchContext must be used within GlobalSearchProvider")
  }

  return context
}
