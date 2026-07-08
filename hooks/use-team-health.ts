"use client"

import { useOrganizationIntelligenceContext } from "@/contexts/organization-intelligence-context"

export function useTeamHealth() {
  const { teamHealth } = useOrganizationIntelligenceContext()

  return { teamHealth }
}