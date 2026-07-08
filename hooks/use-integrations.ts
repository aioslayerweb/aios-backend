"use client"

import { useIntegrationContext } from "@/contexts/integration-context"

export function useIntegrations() {
  return useIntegrationContext()
}