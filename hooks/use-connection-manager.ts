"use client"

import { useIntegrations } from "@/hooks/use-integrations"

export function useConnectionManager() {
  const { connectedSystems, connectSystem, pauseSystem } = useIntegrations()

  return {
    connectedSystems,
    connectSystem,
    pauseSystem,
  }
}