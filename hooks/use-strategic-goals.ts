"use client"

import { usePlanningEngine } from "@/hooks/use-planning-engine"

export function useStrategicGoals() {
  const { goals, filteredGoals, selectedGoal, setSelectedGoalId, query, updateQuery } = usePlanningEngine()
  return { goals, filteredGoals, selectedGoal, setSelectedGoalId, query, updateQuery }
}
