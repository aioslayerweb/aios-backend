"use client"

import { useOrchestratorContext } from "@/contexts/orchestrator-context"

export function useAgentHealth() {
  const { health } = useOrchestratorContext()
  return { health }
}
