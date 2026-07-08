"use client"

import { useMemo } from "react"
import { useExecutiveWorkspace } from "@/hooks/use-executive-workspace"

export function useBusinessHealth() {
  const { health, businessScore } = useExecutiveWorkspace()

  const strongest = useMemo(
    () => health.reduce((best, item) => (item.score > best.score ? item : best), health[0]),
    [health]
  )

  return {
    health,
    businessScore,
    strongest,
  }
}
