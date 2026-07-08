"use client"

import { useOrganizationIntelligenceContext } from "@/contexts/organization-intelligence-context"

export function useDecisionOwnership() {
  const { decisionPaths, selectedDepartment, impactSummary } = useOrganizationIntelligenceContext()

  return { decisionPaths, selectedDepartment, impactSummary }
}