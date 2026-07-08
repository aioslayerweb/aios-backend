"use client"

import { useSecurityContext } from "@/contexts/security-context"

export function useAuditLogs() {
  const { filteredAuditLogs } = useSecurityContext()

  return {
    auditTrail: filteredAuditLogs,
  }
}