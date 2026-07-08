"use client"

import { usePlanningEngine } from "@/hooks/use-planning-engine"

export function useExecutionPlans() {
  const { plans, filteredPlans, selectedPlan, setSelectedPlanId, recalculatePlans } = usePlanningEngine()
  return { plans, filteredPlans, selectedPlan, setSelectedPlanId, recalculatePlans }
}
