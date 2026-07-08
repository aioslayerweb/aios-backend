"use client"

import { useSecurityContext } from "@/contexts/security-context"

export function useSessions() {
  const { filteredSessions, revokeSession } = useSecurityContext()

  return {
    sessions: filteredSessions,
    revokeSession,
  }
}