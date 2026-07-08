"use client"

import { useSecurityContext } from "@/contexts/security-context"

export function useOrganizations() {
  const { filteredOrganizations, selectedOrganization, selectedOrganizationId, setSelectedOrganizationId } = useSecurityContext()

  return {
    organizations: filteredOrganizations,
    selectedOrganization,
    selectedOrganizationId,
    setSelectedOrganizationId,
  }
}