"use client"

import { useSecurityContext } from "@/contexts/security-context"

export function useUsers() {
  const { filteredUsers } = useSecurityContext()

  return {
    users: filteredUsers,
  }
}