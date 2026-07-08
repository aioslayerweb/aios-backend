"use client"

import { useDecisionEngine } from "@/hooks/use-decision-engine"

export function useConfidenceAnalysis() {
  const { selectedConfidence } = useDecisionEngine()

  return {
    confidence: selectedConfidence,
  }
}