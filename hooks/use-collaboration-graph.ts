"use client"

import { useOrganizationIntelligenceContext } from "@/contexts/organization-intelligence-context"

export function useCollaborationGraph() {
  const { collaborationEdges, chartNodes } = useOrganizationIntelligenceContext()

  return { collaborationEdges, chartNodes }
}