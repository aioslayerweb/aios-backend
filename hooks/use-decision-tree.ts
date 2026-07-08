"use client"

import { usePlanningEngine } from "@/hooks/use-planning-engine"

export function useDecisionTree() {
  const { decisionTree, selectedDecision, setSelectedDecisionId } = usePlanningEngine()
  return { decisionTree, selectedDecision, setSelectedDecisionId }
}
