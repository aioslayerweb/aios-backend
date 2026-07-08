"use client"

import { useOrchestratorContext } from "@/contexts/orchestrator-context"

export function useAgentNetwork() {
  const { agents, selectedAgent, selectedAgentId, setSelectedAgentId, filteredAgents } = useOrchestratorContext()

  return { agents, selectedAgent, selectedAgentId, setSelectedAgentId, filteredAgents }
}
