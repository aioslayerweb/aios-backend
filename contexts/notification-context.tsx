"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import type {
  LegacyPushInput,
  NotificationCreateInput,
  NotificationFilters,
  NotificationHistoryGroups,
  NotificationItem,
} from "@/types"
import {
  filterNotifications,
  groupNotificationHistory,
  levelToTone,
  sortNotifications,
  toneToLevel,
} from "@/utils/notifications"

type NotificationContextValue = {
  notifications: NotificationItem[]
  toasts: NotificationItem[]
  drawerOpen: boolean
  unreadCount: number
  filters: NotificationFilters
  filteredNotifications: NotificationItem[]
  groupedHistory: NotificationHistoryGroups
  notify: (item: NotificationCreateInput) => string
  push: (item: LegacyPushInput) => string
  remove: (id: string) => void
  dismissToast: (id: string) => void
  pauseToast: (id: string) => void
  resumeToast: (id: string) => void
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
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [pausedToastIds, setPausedToastIds] = useState<string[]>([])
  const [filters, setFiltersState] = useState<NotificationFilters>({
    query: "",
    unreadOnly: false,
    categories: [],
    priorities: [],
  })

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  )

  const filteredNotifications = useMemo(
    () => sortNotifications(filterNotifications(notifications, filters)),
    [filters, notifications]
  )

  const groupedHistory = useMemo(
    () => groupNotificationHistory(filteredNotifications),
    [filteredNotifications]
  )

  const toasts = useMemo(
    () =>
      sortNotifications(
        notifications.filter((item) => item.toast && !item.toastDismissed)
      ),
    [notifications]
  )

  const remove = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id))
    setPausedToastIds((prev) => prev.filter((value) => value !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
    setPausedToastIds([])
  }, [])

  const notify = useCallback((item: NotificationCreateInput) => {
    const id = crypto.randomUUID()
    setNotifications((prev) => [
      {
        id,
        title: item.title,
        description: item.description,
        level: item.level ?? "INFO",
        category: item.category ?? "SYSTEM",
        priority: item.priority ?? "MEDIUM",
        read: item.read ?? false,
        createdAt: Date.now(),
        source: item.source,
        toast: item.toast ?? true,
        autoDismissMs: item.autoDismissMs ?? 5000,
        toastDismissed: false,
      },
      ...prev,
    ])
    return id
  }, [])

  const push = useCallback(
    (item: LegacyPushInput) => {
      return notify({
        title: item.title,
        description: item.description,
        level: toneToLevel(item.tone),
        category: "SYSTEM",
        priority: item.tone === "error" ? "HIGH" : "MEDIUM",
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

  useEffect(() => {
    const timers = toasts
      .filter(
        (item) =>
          typeof item.autoDismissMs === "number" &&
          item.autoDismissMs > 0 &&
          !pausedToastIds.includes(item.id)
      )
      .map((item) =>
        window.setTimeout(() => {
          dismissToast(item.id)
        }, item.autoDismissMs as number)
      )

    return () => {
      timers.forEach((timerId) => window.clearTimeout(timerId))
    }
  }, [dismissToast, pausedToastIds, toasts])

  const markRead = useCallback((id: string, read = true) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read } : item))
    )
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))
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
      groupedHistory,
      notify,
      push,
      remove,
      dismissToast,
      pauseToast,
      resumeToast,
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
      groupedHistory,
      markAllRead,
      markRead,
      notifications,
      notify,
      pauseToast,
      push,
      remove,
      resetFilters,
      resumeToast,
      setFilters,
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
