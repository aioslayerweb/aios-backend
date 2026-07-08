"use client"

import { useRuntimeLive } from "@/hooks/use-runtime-live"

export function useRuntime() {
  const { events, runningAgents, pendingTasks, queueDepth } = useRuntimeLive()

  return {
    events,
    runningAgents,
    pendingTasks,
    queueDepth,
  }
}
