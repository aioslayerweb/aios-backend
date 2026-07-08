"use client"

import { usePlanningEngine } from "@/hooks/use-planning-engine"

export function useSimulation() {
  const { simulation, selectedSimulation, setSelectedSimulationId, runSimulation } = usePlanningEngine()
  return { simulation, selectedSimulation, setSelectedSimulationId, runSimulation }
}
