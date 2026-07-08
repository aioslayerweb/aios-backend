"use client"

import { useIntegrations } from "@/hooks/use-integrations"

export function useIntegrationLogs() {
  const { logs, retryLog } = useIntegrations()

  return {
    logs,
    retryLog,
  }
}