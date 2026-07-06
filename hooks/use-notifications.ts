"use client"

import { useNotificationContext } from "@/contexts/notification-context"

export function useNotifications() {
  return useNotificationContext()
}
