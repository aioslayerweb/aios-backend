"use client"

import { useSecurityContext } from "@/contexts/security-context"

export function usePermissions() {
  const { filteredPermissions } = useSecurityContext()

  return {
    permissions: filteredPermissions,
  }
}