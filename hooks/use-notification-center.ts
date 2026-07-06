"use client"

import { useNotificationContext } from "@/contexts/notification-context"

export function useNotificationCenter() {
  return useNotificationContext()
}
