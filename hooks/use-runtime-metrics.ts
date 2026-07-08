"use client"

import { useOrchestratorContext } from "@/contexts/orchestrator-context"

export function useRuntimeMetrics() {
  const { metrics } = useOrchestratorContext()
  return { metrics }
}
