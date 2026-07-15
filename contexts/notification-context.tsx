"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import type {
  LegacyPushInput,
  NotificationCreateInput,
  NotificationExecutiveSummary,
  NotificationFilters,
  NotificationItem,
  NotificationPriorityGroups,
} from "@/types"
import {
  autoExpireMs,
  buildExecutiveSummary,
  filterNotifications,
  groupByPriority,
  sortNotifications,
  toneToLevel,
} from "@/utils/notifications"

const MAX_NOTIFICATION_HISTORY = 250
const THROTTLE_INTERVAL_MS = 20_000
const MAX_GROUP_EVENTS = 6

function normalizedText(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ")
}

function clampScore(value: number | undefined, fallback: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback
  }

  return Math.max(0, Math.min(100, Math.round(value)))
}

function defaultUrgency(priority: NotificationItem["priority"]): NotificationItem["urgency"] {
  return priority
}

function fallbackGroupedLabel(item: NotificationCreateInput): string {
  if (item.groupedLabel) {
    return item.groupedLabel
  }

  const category = item.category ?? "SYSTEM"
  const map: Record<string, string> = {
    WORKFLOW: "workflow updates",
    INTEGRATION: "integration updates",
    AI_DECISION: "decision updates",
    AGENT: "agent updates",
    SECURITY: "security alerts",
    MEMORY: "memory updates",
    KNOWLEDGE: "knowledge updates",
    PLANNING: "planning updates",
    EXECUTIVE: "executive updates",
    CUSTOMER: "customer updates",
    FINANCE: "finance updates",
    SALES: "sales updates",
  }

  return map[category] ?? "system updates"
}

function groupedTitle(label: string, groupedCount: number): string {
  return groupedCount > 1 ? `${groupedCount} ${label}` : label
}

function defaultGroupKey(item: NotificationCreateInput): string {
  if (item.groupKey) {
    return item.groupKey
  }

  return [
    item.category ?? "SYSTEM",
    item.groupedLabel ?? "",
    item.source ?? "",
    normalizedText(item.title).replace(/\d+/g, "#"),
  ].join("|")
}

function defaultFingerprint(item: NotificationCreateInput): string {
  if (item.fingerprint) {
    return item.fingerprint
  }

  return [
    item.category ?? "SYSTEM",
    item.priority ?? "MEDIUM",
    normalizedText(item.title),
    normalizedText(item.description),
    normalizedText(item.source),
  ].join("::")
}

function createInitialNotifications(): NotificationItem[] {
  const now = Date.now()
  return [
    {
      id: "seed-notification-1",
      title: "Revenue forecast dropped 12%",
      groupedLabel: "decision updates",
      description: "Q3 forecast variance exceeded threshold across two enterprise regions.",
      groupBaseTitle: "decision updates",
      groupKey: "seed|critical-decision",
      fingerprint: "seed::revenue-forecast-dropped-12",
      groupedCount: 1,
      expanded: false,
      events: [
        {
          id: "seed-notification-1-event",
          createdAt: now - 4 * 60_000,
          title: "Revenue forecast dropped 12%",
          description: "Q3 forecast variance exceeded threshold across two enterprise regions.",
        },
      ],
      level: "ERROR",
      category: "AI_DECISION",
      priority: "CRITICAL",
      impact: 96,
      urgency: "CRITICAL",
      confidence: 94,
      assignedToMe: true,
      viewed: false,
      acknowledged: false,
      archived: false,
      read: false,
      createdAt: now - 4 * 60_000,
      source: "Decision Center",
      toast: true,
      autoDismissMs: null,
      toastDismissed: false,
    },
    {
      id: "seed-notification-2",
      title: "Security policy violation detected",
      groupedLabel: "security alerts",
      description: "Privileged action attempted outside approved policy window.",
      groupBaseTitle: "security alerts",
      groupKey: "seed|security-violation",
      fingerprint: "seed::security-policy-violation",
      groupedCount: 1,
      expanded: false,
      events: [
        {
          id: "seed-notification-2-event",
          createdAt: now - 12 * 60_000,
          title: "Security policy violation detected",
          description: "Privileged action attempted outside approved policy window.",
        },
      ],
      level: "ERROR",
      category: "SECURITY",
      priority: "CRITICAL",
      impact: 92,
      urgency: "CRITICAL",
      confidence: 91,
      assignedToMe: true,
      viewed: false,
      acknowledged: false,
      archived: false,
      read: false,
      createdAt: now - 12 * 60_000,
      source: "Security Command",
      toast: true,
      autoDismissMs: null,
      toastDismissed: false,
    },
    {
      id: "seed-notification-3",
      title: "ERP connection lost",
      groupedLabel: "integration updates",
      description: "Finance ERP connector has not returned heartbeat for 7 minutes.",
      groupBaseTitle: "integration updates",
      groupKey: "seed|erp-connection-lost",
      fingerprint: "seed::erp-connection-lost",
      groupedCount: 1,
      expanded: false,
      events: [
        {
          id: "seed-notification-3-event",
          createdAt: now - 18 * 60_000,
          title: "ERP connection lost",
          description: "Finance ERP connector has not returned heartbeat for 7 minutes.",
        },
      ],
      level: "WARNING",
      category: "INTEGRATION",
      priority: "HIGH",
      impact: 89,
      urgency: "HIGH",
      confidence: 88,
      assignedToMe: false,
      viewed: false,
      acknowledged: false,
      archived: false,
      read: false,
      createdAt: now - 18 * 60_000,
      source: "Integrations Hub",
      toast: true,
      autoDismissMs: null,
      toastDismissed: false,
    },
    {
      id: "seed-notification-4",
      title: "New strategic opportunity identified",
      groupedLabel: "executive updates",
      description: "Expansion scenario unlocked in enterprise healthcare segment.",
      groupBaseTitle: "executive updates",
      groupKey: "seed|strategic-opportunity",
      fingerprint: "seed::new-strategic-opportunity-identified",
      groupedCount: 1,
      expanded: false,
      events: [
        {
          id: "seed-notification-4-event",
          createdAt: now - 27 * 60_000,
          title: "New strategic opportunity identified",
          description: "Expansion scenario unlocked in enterprise healthcare segment.",
        },
      ],
      level: "INFO",
      category: "EXECUTIVE",
      priority: "HIGH",
      impact: 85,
      urgency: "HIGH",
      confidence: 87,
      assignedToMe: true,
      viewed: false,
      acknowledged: false,
      archived: false,
      read: false,
      createdAt: now - 27 * 60_000,
      source: "Executive Insights",
      toast: true,
      autoDismissMs: null,
      toastDismissed: false,
    },
    {
      id: "seed-notification-5",
      title: "Knowledge indexed successfully",
      groupedLabel: "knowledge updates",
      description: "42 executive artifacts indexed and linked to current initiatives.",
      groupBaseTitle: "knowledge updates",
      groupKey: "seed|knowledge-indexed",
      fingerprint: "seed::knowledge-indexed-successfully",
      groupedCount: 1,
      expanded: false,
      events: [
        {
          id: "seed-notification-5-event",
          createdAt: now - 45 * 60_000,
          title: "Knowledge indexed successfully",
          description: "42 executive artifacts indexed and linked to current initiatives.",
        },
      ],
      level: "SUCCESS",
      category: "KNOWLEDGE",
      priority: "MEDIUM",
      impact: 64,
      urgency: "MEDIUM",
      confidence: 95,
      assignedToMe: false,
      viewed: false,
      acknowledged: false,
      archived: false,
      read: false,
      createdAt: now - 45 * 60_000,
      source: "Knowledge Center",
      toast: true,
      autoDismissMs: autoExpireMs("MEDIUM"),
      toastDismissed: false,
    },
    {
      id: "seed-notification-6",
      title: "New memory added",
      groupedLabel: "memory updates",
      description: "Customer negotiation signal captured and attached to memory graph.",
      groupBaseTitle: "memory updates",
      groupKey: "seed|memory-added",
      fingerprint: "seed::new-memory-added",
      groupedCount: 1,
      expanded: false,
      events: [
        {
          id: "seed-notification-6-event",
          createdAt: now - 70 * 60_000,
          title: "New memory added",
          description: "Customer negotiation signal captured and attached to memory graph.",
        },
      ],
      level: "INFO",
      category: "MEMORY",
      priority: "LOW",
      impact: 34,
      urgency: "LOW",
      confidence: 90,
      assignedToMe: false,
      viewed: false,
      acknowledged: false,
      archived: false,
      read: false,
      createdAt: now - 70 * 60_000,
      source: "Memory Center",
      toast: true,
      autoDismissMs: autoExpireMs("LOW"),
      toastDismissed: false,
    },
  ]
}

type NotificationContextValue = {
  notifications: NotificationItem[]
  toasts: NotificationItem[]
  drawerOpen: boolean
  unreadCount: number
  filters: NotificationFilters
  filteredNotifications: NotificationItem[]
  groupedByPriority: NotificationPriorityGroups
  summary: NotificationExecutiveSummary
  notify: (item: NotificationCreateInput) => string
  push: (item: LegacyPushInput) => string
  remove: (id: string) => void
  dismissToast: (id: string) => void
  pauseToast: (id: string) => void
  resumeToast: (id: string) => void
  acknowledge: (id: string) => void
  archive: (id: string) => void
  assignToMe: (id: string) => void
  openNotification: (id: string) => void
  approveNotification: (id: string) => void
  toggleExpanded: (id: string) => void
  getVisibleToasts: (maxVisible: number) => NotificationItem[]
  markRead: (id: string, read?: boolean) => void
  markAllRead: () => void
  clear: () => void
  clearAll: () => void
  setDrawerOpen: (open: boolean) => void
  toggleDrawer: () => void
  setFilters: (next: Partial<NotificationFilters>) => void
  resetFilters: () => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => createInitialNotifications())
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [pausedToastIds, setPausedToastIds] = useState<string[]>([])
  const queueRef = useRef<NotificationItem[]>([])
  const throttleTimerRef = useRef<number | null>(null)
  const lastEmittedAtRef = useRef<number>(0)
  const playedCriticalSoundRef = useRef<string>("")
  const [filters, setFiltersState] = useState<NotificationFilters>({
    query: "",
    unreadOnly: false,
    categories: [],
    priorities: [],
    preset: "all",
  })

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read && !item.archived).length,
    [notifications]
  )

  const filteredNotifications = useMemo(
    () => sortNotifications(filterNotifications(notifications, filters)),
    [filters, notifications]
  )

  const groupedByPriority = useMemo(
    () => groupByPriority(filteredNotifications),
    [filteredNotifications]
  )

  const summary = useMemo(() => buildExecutiveSummary(filteredNotifications), [filteredNotifications])

  const toasts = useMemo(
    () =>
      sortNotifications(
        notifications.filter((item) => item.toast && !item.toastDismissed && !item.archived)
      ),
    [notifications]
  )

  const remove = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id))
    setPausedToastIds((prev) => prev.filter((value) => value !== id))
    queueRef.current = queueRef.current.filter((item) => item.id !== id)
  }, [])

  const commitNotification = useCallback((nextItem: NotificationItem) => {
    setNotifications((prev) => {
      const exactDuplicate = prev.find((entry) => entry.fingerprint === nextItem.fingerprint)
      if (exactDuplicate) {
        return prev
      }

      const existingIndex = prev.findIndex((entry) => entry.groupKey === nextItem.groupKey)
      if (existingIndex === -1) {
        return [nextItem, ...prev]
          .sort((left, right) => right.createdAt - left.createdAt)
          .slice(0, MAX_NOTIFICATION_HISTORY)
      }

      const existing = prev[existingIndex]
      const groupedCount = (existing.groupedCount ?? 1) + 1
      const mergedLabel = nextItem.groupedLabel ?? existing.groupedLabel ?? "updates"

      const merged: NotificationItem = {
        ...existing,
        title: groupedTitle(mergedLabel, groupedCount),
        groupBaseTitle: mergedLabel,
        groupedLabel: mergedLabel,
        groupedCount,
        description: nextItem.description ?? existing.description,
        level: nextItem.level,
        category: nextItem.category,
        priority: nextItem.priority,
        impact: nextItem.impact,
        urgency: nextItem.urgency,
        confidence: nextItem.confidence,
        source: nextItem.source ?? existing.source,
        createdAt: nextItem.createdAt,
        read: false,
        viewed: false,
        assignedToMe: nextItem.assignedToMe ?? existing.assignedToMe,
        acknowledged: existing.acknowledged && nextItem.priority !== "CRITICAL",
        archived: false,
        toast: true,
        autoDismissMs: nextItem.autoDismissMs,
        toastDismissed: false,
        expanded: false,
        events: [
          {
            id: `${nextItem.id}-event`,
            createdAt: nextItem.createdAt,
            title: nextItem.title,
            description: nextItem.description,
          },
          ...(existing.events ?? []),
        ].slice(0, MAX_GROUP_EVENTS),
      }

      const withoutExisting = prev.filter((entry) => entry.id !== existing.id)
      return [merged, ...withoutExisting]
        .sort((left, right) => right.createdAt - left.createdAt)
        .slice(0, MAX_NOTIFICATION_HISTORY)
    })
  }, [])

  const flushQueue = useCallback(() => {
    if (throttleTimerRef.current !== null) {
      window.clearTimeout(throttleTimerRef.current)
      throttleTimerRef.current = null
    }

    const next = queueRef.current[0]
    if (!next) {
      return
    }

    const now = Date.now()
    const elapsed = now - lastEmittedAtRef.current
    const remaining = Math.max(0, THROTTLE_INTERVAL_MS - elapsed)

    if (remaining > 0) {
      throttleTimerRef.current = window.setTimeout(() => {
        flushQueue()
      }, remaining)
      return
    }

    queueRef.current = queueRef.current.slice(1)
    lastEmittedAtRef.current = now
    commitNotification(next)

    if (queueRef.current.length > 0) {
      throttleTimerRef.current = window.setTimeout(() => {
        flushQueue()
      }, THROTTLE_INTERVAL_MS)
    }
  }, [commitNotification])

  const clearAll = useCallback(() => {
    setNotifications([])
    setPausedToastIds([])
    queueRef.current = []
  }, [])

  const notify = useCallback((item: NotificationCreateInput) => {
    const id = crypto.randomUUID()
    const createdAt = Date.now()
    const priority = item.priority ?? "MEDIUM"
    const groupedLabel = fallbackGroupedLabel(item)
    const nextItem: NotificationItem = {
      id,
      title: item.title,
      groupedLabel,
      groupBaseTitle: groupedLabel,
      groupKey: defaultGroupKey(item),
      fingerprint: defaultFingerprint(item),
      groupedCount: 1,
      expanded: false,
      events: [
        {
          id: `${id}-event`,
          createdAt,
          title: item.title,
          description: item.description,
        },
      ],
      description: item.description,
      level: item.level ?? "INFO",
      category: item.category ?? "SYSTEM",
      priority,
      impact: clampScore(item.impact, priority === "CRITICAL" ? 92 : priority === "HIGH" ? 82 : 63),
      urgency: item.urgency ?? defaultUrgency(priority),
      confidence: clampScore(item.confidence, 88),
      assignedToMe: item.assignedToMe ?? false,
      viewed: false,
      acknowledged: priority !== "CRITICAL",
      archived: false,
      read: item.read ?? false,
      createdAt,
      source: item.source,
      toast: item.toast ?? true,
      autoDismissMs: item.autoDismissMs ?? autoExpireMs(priority),
      toastDismissed: false,
    }

    queueRef.current = [...queueRef.current, nextItem]
    flushQueue()
    return id
  }, [flushQueue])

  const push = useCallback(
    (item: LegacyPushInput) => {
      return notify({
        title: item.title,
        description: item.description,
        level: toneToLevel(item.tone),
        category: "SYSTEM",
        priority: item.tone === "error" ? "HIGH" : "MEDIUM",
        impact: item.tone === "error" ? 80 : 55,
        confidence: 84,
        toast: true,
      })
    },
    [notify]
  )

  const dismissToast = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              toastDismissed: true,
            }
          : item
      )
    )
    setPausedToastIds((prev) => prev.filter((value) => value !== id))
  }, [])

  const pauseToast = useCallback((id: string) => {
    setPausedToastIds((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    )
  }, [])

  const resumeToast = useCallback((id: string) => {
    setPausedToastIds((prev) => prev.filter((value) => value !== id))
  }, [])

  const archive = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              archived: true,
              toastDismissed: true,
            }
          : item
      )
    )
  }, [])

  const assignToMe = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              assignedToMe: true,
              read: false,
            }
          : item
      )
    )
  }, [])

  const openNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              viewed: true,
              read: true,
              toastDismissed: item.priority === "HIGH" ? true : item.toastDismissed,
            }
          : item
      )
    )
  }, [])

  const approveNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              viewed: true,
              read: true,
              acknowledged: true,
              toastDismissed: item.priority === "CRITICAL" ? true : item.toastDismissed,
            }
          : item
      )
    )
  }, [])

  const acknowledge = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              acknowledged: true,
              viewed: true,
              read: true,
              toastDismissed: true,
            }
          : item
      )
    )
  }, [])

  const toggleExpanded = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, expanded: !item.expanded } : item))
    )
  }, [])

  const getVisibleToasts = useCallback(
    (maxVisible: number) => {
      return toasts.slice(0, Math.max(0, maxVisible))
    },
    [toasts]
  )

  useEffect(() => {
    if (!drawerOpen) {
      return
    }

    setNotifications((prev) => {
      if (!prev.some((item) => !item.read && !item.archived)) {
        return prev
      }

      return prev.map((item) => ({ ...item, read: true, viewed: true }))
    })
  }, [drawerOpen])

  useEffect(() => {
    const timers = notifications
      .filter(
        (item) =>
          !item.archived &&
          (item.priority === "LOW" || item.priority === "MEDIUM") &&
          typeof item.autoDismissMs === "number" &&
          item.autoDismissMs > 0
      )
      .map((item) =>
        window.setTimeout(() => {
          remove(item.id)
        }, item.autoDismissMs as number)
      )

    return () => {
      timers.forEach((timerId) => window.clearTimeout(timerId))
    }
  }, [notifications, remove])

  useEffect(() => {
    const timers = toasts
      .filter((item) => item.priority !== "CRITICAL" && !pausedToastIds.includes(item.id))
      .filter((item) => typeof item.autoDismissMs === "number" && item.autoDismissMs > 0)
      .map((item) =>
        window.setTimeout(() => {
          dismissToast(item.id)
        }, item.autoDismissMs as number)
      )

    return () => {
      timers.forEach((timerId) => window.clearTimeout(timerId))
    }
  }, [dismissToast, pausedToastIds, toasts])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const latestCritical = toasts.find((item) => item.priority === "CRITICAL" && !item.acknowledged)
    if (!latestCritical || playedCriticalSoundRef.current === latestCritical.id) {
      return
    }

    playedCriticalSoundRef.current = latestCritical.id

    const audioContext = new window.AudioContext()
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    oscillator.type = "sine"
    oscillator.frequency.value = 880
    gain.gain.value = 0.03
    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.14)

    return () => {
      audioContext.close().catch(() => undefined)
    }
  }, [toasts])

  useEffect(
    () => () => {
      if (throttleTimerRef.current !== null) {
        window.clearTimeout(throttleTimerRef.current)
      }
    },
    []
  )

  const markRead = useCallback((id: string, read = true) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              read,
              viewed: read ? true : item.viewed,
              toastDismissed: read && item.priority === "HIGH" ? true : item.toastDismissed,
            }
          : item
      )
    )
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true, viewed: true })))
  }, [])

  const setFilters = useCallback((next: Partial<NotificationFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...next }))
  }, [])

  const resetFilters = useCallback(() => {
    setFiltersState({
      query: "",
      unreadOnly: false,
      categories: [],
      priorities: [],
      preset: "all",
    })
  }, [])

  const toggleDrawer = useCallback(() => {
    setDrawerOpen((prev) => !prev)
  }, [])

  const clear = clearAll

  const value = useMemo(
    () => ({
      notifications,
      toasts,
      drawerOpen,
      unreadCount,
      filters,
      filteredNotifications,
      groupedByPriority,
      summary,
      notify,
      push,
      remove,
      dismissToast,
      pauseToast,
      resumeToast,
      acknowledge,
      archive,
      assignToMe,
      openNotification,
      approveNotification,
      toggleExpanded,
      getVisibleToasts,
      markRead,
      markAllRead,
      clear,
      clearAll,
      setDrawerOpen,
      toggleDrawer,
      setFilters,
      resetFilters,
    }),
    [
      clear,
      clearAll,
      dismissToast,
      drawerOpen,
      filteredNotifications,
      filters,
      getVisibleToasts,
      groupedByPriority,
      summary,
      markAllRead,
      markRead,
      notifications,
      notify,
      acknowledge,
      archive,
      assignToMe,
      openNotification,
      approveNotification,
      pauseToast,
      push,
      remove,
      resetFilters,
      resumeToast,
      setFilters,
      toggleExpanded,
      toasts,
      toggleDrawer,
      unreadCount,
    ]
  )

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  )
}

export function useNotificationContext(): NotificationContextValue {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotificationContext must be used within NotificationProvider")
  }

  return context
}
