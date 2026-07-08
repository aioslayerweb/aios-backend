"use client"

import { usePlanningEngine } from "@/hooks/use-planning-engine"

export function usePriorityMatrix() {
  const { priorityMatrix } = usePlanningEngine()
  return { priorityMatrix }
}
