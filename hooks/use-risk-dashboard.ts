"use client"

import { useExecutiveReports } from "@/hooks/use-executive-reports"

export function useRiskDashboard() {
  const { riskCategories } = useExecutiveReports()

  return {
    riskCategories,
  }
}