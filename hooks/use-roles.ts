"use client"

import { useSecurityContext } from "@/contexts/security-context"

export function useRoles() {
  const { filteredRoles } = useSecurityContext()

  return {
    roles: filteredRoles,
  }
}