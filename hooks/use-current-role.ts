"use client"

import { useRoleIntelligenceContext } from "@/contexts/role-intelligence-context"

export function useCurrentRole() {
  const { currentRole, currentRoleId, effectiveRole, previewRole, previewRoleId, simulationEnabled } = useRoleIntelligenceContext()

  return {
    currentRole,
    currentRoleId,
    effectiveRole,
    previewRole,
    previewRoleId,
    simulationEnabled,
  }
}