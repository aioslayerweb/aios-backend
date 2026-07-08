"use client"

import { useDecisionEngineContext } from "@/contexts/decision-engine-context"

export function useDecisionEngine() {
  return useDecisionEngineContext()
}