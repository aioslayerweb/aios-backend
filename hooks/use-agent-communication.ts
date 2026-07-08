"use client"

import { useOrchestratorContext } from "@/contexts/orchestrator-context"

export function useAgentCommunication() {
  const { messages } = useOrchestratorContext()
  return { messages }
}
