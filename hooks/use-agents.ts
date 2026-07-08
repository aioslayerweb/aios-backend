"use client"

import { useRuntimeLive } from "@/hooks/use-runtime-live"

export function useAgents() {
  const { agents, runningAgents } = useRuntimeLive()

  return {
    agents,
    runningAgents,
  }
}
