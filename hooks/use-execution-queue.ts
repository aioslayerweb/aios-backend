"use client"

import { useOrchestratorContext } from "@/contexts/orchestrator-context"

export function useExecutionQueue() {
  const { executions, filteredExecutions, selectedExecution, selectedExecutionId, setSelectedExecutionId } = useOrchestratorContext()

  return { executions, filteredExecutions, selectedExecution, selectedExecutionId, setSelectedExecutionId }
}
