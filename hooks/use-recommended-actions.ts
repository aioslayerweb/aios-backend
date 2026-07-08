"use client"

import { useDecisionEngine } from "@/hooks/use-decision-engine"

export function useRecommendedActions() {
  const { selectedActions, approveAction, rejectAction, executeAction } = useDecisionEngine()

  return {
    actions: selectedActions,
    approveAction,
    rejectAction,
    executeAction,
  }
}