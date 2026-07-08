"use client"

import { useRoleIntelligenceContext } from "@/contexts/role-intelligence-context"

export function useRoleDashboard() {
  const {
    availableRoles,
    currentRole,
    currentRoleId,
    effectiveRole,
    previewRole,
    previewRoleId,
    roleDashboard,
    simulationEnabled,
    setCurrentRoleId,
    setPreviewRoleId,
    setSimulationEnabled,
  } = useRoleIntelligenceContext()

  return {
    availableRoles,
    currentRole,
    currentRoleId,
    effectiveRole,
    previewRole,
    previewRoleId,
    roleDashboard,
    simulationEnabled,
    setCurrentRoleId,
    setPreviewRoleId,
    setSimulationEnabled,
  }
}