"use client"

import { useOrchestratorContext } from "@/contexts/orchestrator-context"

export function useExecutionTimeline() {
  const { timeline } = useOrchestratorContext()
  return { timeline }
}
