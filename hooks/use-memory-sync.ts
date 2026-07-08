"use client"

import { useOrchestratorContext } from "@/contexts/orchestrator-context"

export function useMemorySync() {
  const { memorySync } = useOrchestratorContext()
  return { memorySync }
}
