"use client"

import { useGovernance } from "@/hooks/use-governance"

export function useAuditTrail() {
  const { auditTrail } = useGovernance()

  return {
    auditTrail,
  }
}