"use client"

import { useGovernance } from "@/hooks/use-governance"

export function useReasoning() {
  const { selectedReasoning, selectedEvidence } = useGovernance()

  return {
    reasoning: selectedReasoning,
    evidence: selectedEvidence,
  }
}