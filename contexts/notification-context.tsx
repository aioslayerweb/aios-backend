"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"

export type NotificationTone = "info" | "success" | "warning" | "error"

export type NotificationItem = {
  id: string
  title: string
  description?: string
  tone: NotificationTone
}

type NotificationContextValue = {
  notifications: NotificationItem[]
  push: (item: Omit<NotificationItem, "id">) => string
  remove: (id: string) => void
  clear: () => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  const remove = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const clear = useCallback(() => {
    setNotifications([])
  }, [])

  const push = useCallback((item: Omit<NotificationItem, "id">) => {
    const id = crypto.randomUUID()
    setNotifications((prev) => [...prev, { ...item, id }])
    return id
  }, [])

  const value = useMemo(
    () => ({ notifications, push, remove, clear }),
    [notifications, push, remove, clear]
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
