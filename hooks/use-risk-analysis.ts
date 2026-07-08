"use client"

import { useGovernance } from "@/hooks/use-governance"

export function useRiskAnalysis() {
  const { selectedRisk, risk } = useGovernance()

  return {
    selectedRisk,
    risk,
  }
}