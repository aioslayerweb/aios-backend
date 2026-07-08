"use client"

import { useRoleIntelligenceContext } from "@/contexts/role-intelligence-context"

export function useRoleInsights() {
  const { roleDashboard } = useRoleIntelligenceContext()

  return {
    insights: roleDashboard.insights,
    summaryPoints: roleDashboard.summaryPoints,
  }
}