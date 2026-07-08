"use client"

import { useOrganizationIntelligenceContext } from "@/contexts/organization-intelligence-context"

export function useOrganizationChart() {
  const { chartNodes, chartEdges, selectedOrganization } = useOrganizationIntelligenceContext()

  return {
    chartNodes,
    chartEdges,
    selectedOrganization,
  }
}