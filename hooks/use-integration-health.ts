"use client"

import { useIntegrations } from "@/hooks/use-integrations"

export function useIntegrationHealth() {
  const { connectedSystems, healthSummary } = useIntegrations()

  return {
    connectedSystems,
    healthSummary,
  }
}