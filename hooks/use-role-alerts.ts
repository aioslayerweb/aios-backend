"use client"

import { useRoleIntelligenceContext } from "@/contexts/role-intelligence-context"

export function useRoleAlerts() {
  const { roleDashboard } = useRoleIntelligenceContext()

  return {
    alerts: roleDashboard.alerts,
  }
}