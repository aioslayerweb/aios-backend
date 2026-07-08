"use client"

import { useMemo } from "react"
import { useExecutiveWorkspace } from "@/hooks/use-executive-workspace"

export function useExecutiveKPIs() {
  const { kpis } = useExecutiveWorkspace()

  const improvingCount = useMemo(
    () => kpis.filter((item) => item.trend === "up").length,
    [kpis]
  )

  return {
    kpis,
    improvingCount,
  }
}
