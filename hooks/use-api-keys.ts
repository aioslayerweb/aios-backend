"use client"

import { useSecurityContext } from "@/contexts/security-context"

export function useApiKeys() {
  const { filteredApiKeys, rotateApiKey } = useSecurityContext()

  return {
    apiKeys: filteredApiKeys,
    rotateApiKey,
  }
}