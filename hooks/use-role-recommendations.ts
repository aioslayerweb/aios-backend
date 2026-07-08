"use client"

import { useRoleIntelligenceContext } from "@/contexts/role-intelligence-context"

export function useRoleRecommendations() {
  const { roleDashboard } = useRoleIntelligenceContext()

  return {
    recommendations: roleDashboard.recommendations,
    workflows: roleDashboard.workflows,
    prompts: roleDashboard.prompts,
  }
}