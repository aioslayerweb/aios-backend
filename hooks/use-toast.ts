"use client"

import type { NotificationCategory, NotificationPriority } from "@/types"
import { useNotificationCenter } from "@/hooks/use-notification-center"

type ToastOptions = {
  title: string
  description?: string
  category?: NotificationCategory
  priority?: NotificationPriority
  autoDismissMs?: number | null
}

export function useToast() {
  const { notify } = useNotificationCenter()

  return {
    info: (options: ToastOptions) =>
      notify({
        ...options,
        level: "INFO",
        category: options.category ?? "SYSTEM",
        priority: options.priority ?? "MEDIUM",
        toast: true,
      }),
    success: (options: ToastOptions) =>
      notify({
        ...options,
        level: "SUCCESS",
        category: options.category ?? "SYSTEM",
        priority: options.priority ?? "MEDIUM",
        toast: true,
      }),
    warning: (options: ToastOptions) =>
      notify({
        ...options,
        level: "WARNING",
        category: options.category ?? "SYSTEM",
        priority: options.priority ?? "HIGH",
        toast: true,
      }),
    error: (options: ToastOptions) =>
      notify({
        ...options,
        level: "ERROR",
        category: options.category ?? "SYSTEM",
        priority: options.priority ?? "HIGH",
        toast: true,
      }),
  }
}
