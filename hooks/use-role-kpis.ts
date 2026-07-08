"use client"

import { useRoleIntelligenceContext } from "@/contexts/role-intelligence-context"

export function useRoleKPIs() {
  const { roleDashboard } = useRoleIntelligenceContext()

  return {
    kpis: roleDashboard.kpis,
  }
}