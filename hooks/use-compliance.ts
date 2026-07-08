"use client"

import { useGovernance } from "@/hooks/use-governance"

export function useCompliance() {
  const { filteredCompliance, complianceView, setComplianceView } = useGovernance()

  return {
    compliance: filteredCompliance,
    complianceView,
    setComplianceView,
  }
}