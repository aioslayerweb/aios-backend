"use client"

import { useIntegrations } from "@/hooks/use-integrations"

export function useSyncStatus() {
  const { syncJobs, syncSummary, triggerSync } = useIntegrations()

  return {
    syncJobs,
    syncSummary,
    triggerSync,
  }
}