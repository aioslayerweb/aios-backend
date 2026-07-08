"use client"

import { useSecurityContext } from "@/contexts/security-context"

export function useSecurity() {
  return useSecurityContext()
}