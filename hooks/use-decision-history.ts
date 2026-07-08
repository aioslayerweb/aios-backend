"use client"

import { useGovernance } from "@/hooks/use-governance"

export function useDecisionHistory() {
  const { filteredDecisions, selectedDecision, selectedDecisionId, setSelectedDecisionId, query, updateQuery } = useGovernance()

  return {
    decisions: filteredDecisions,
    selectedDecision,
    selectedDecisionId,
    setSelectedDecisionId,
    query,
    updateQuery,
  }
}