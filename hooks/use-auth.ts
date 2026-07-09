"use client"

import { useAuthContext } from "@/contexts/auth-context"

export function useAuth() {
  const { user, ...rest } = useAuthContext()

  return {
    currentUser: user,
    ...rest,
  }
}