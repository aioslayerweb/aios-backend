"use client"

import { useExecutiveReports } from "@/hooks/use-executive-reports"

export function useStrategicKPIs() {
  const { strategicKPIs } = useExecutiveReports()

  return {
    strategicKPIs,
  }
}