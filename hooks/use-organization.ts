"use client"

import { useOrganizationIntelligenceContext } from "@/contexts/organization-intelligence-context"

export function useOrganization() {
  const { organizations, selectedOrganization, selectedOrganizationId, setSelectedOrganizationId, snapshot } = useOrganizationIntelligenceContext()

  return {
    organizations,
    selectedOrganization,
    selectedOrganizationId,
    setSelectedOrganizationId,
    snapshot,
  }
}