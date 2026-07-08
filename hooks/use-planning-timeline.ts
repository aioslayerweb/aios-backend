"use client"

import { usePlanningEngine } from "@/hooks/use-planning-engine"

export function usePlanningTimeline() {
  const { timeline } = usePlanningEngine()
  return { timeline }
}
