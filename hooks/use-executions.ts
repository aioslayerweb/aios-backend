"use client"

import { useRuntimeLive } from "@/hooks/use-runtime-live"

export function useExecutions() {
  const { executions, pendingTasks, queueDepth } = useRuntimeLive()

  return {
    executions,
    pendingTasks,
    queueDepth,
  }
}
