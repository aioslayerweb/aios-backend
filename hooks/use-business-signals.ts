"use client"

import { useDecisionEngine } from "@/hooks/use-decision-engine"

export function useBusinessSignals() {
  const { selectedSignals } = useDecisionEngine()

  return {
    signals: selectedSignals,
  }
}