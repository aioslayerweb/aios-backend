"use client"

import { useSecurityContext } from "@/contexts/security-context"

export function useSecurityPolicies() {
  const { filteredPolicies } = useSecurityContext()

  return {
    policies: filteredPolicies,
  }
}