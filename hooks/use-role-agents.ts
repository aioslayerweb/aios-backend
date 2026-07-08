"use client"

import { useRoleIntelligenceContext } from "@/contexts/role-intelligence-context"

export function useRoleAgents() {
  const { roleDashboard } = useRoleIntelligenceContext()

  return {
    agents: roleDashboard.agents,
  }
}