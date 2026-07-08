"use client"

import { usePlanningEngineContext } from "@/contexts/planning-engine-context"

export function usePlanningEngine() {
  return usePlanningEngineContext()
}
