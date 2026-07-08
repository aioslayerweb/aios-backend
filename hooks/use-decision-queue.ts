"use client"

import { useDecisionEngine } from "@/hooks/use-decision-engine"

export function useDecisionQueue() {
  const { filteredQueue, selectedDecision, selectedDecisionId, setSelectedDecisionId, query, updateQuery } = useDecisionEngine()

  return {
    queue: filteredQueue,
    selectedDecision,
    selectedDecisionId,
    setSelectedDecisionId,
    query,
    updateQuery,
  }
}