"use client"

import { useDecisionEngine } from "@/hooks/use-decision-engine"

export function useDecisionReasoning() {
  const { selectedReasoning, selectedScore } = useDecisionEngine()

  return {
    reasoning: selectedReasoning,
    score: selectedScore,
  }
}