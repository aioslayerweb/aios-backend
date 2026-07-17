"use client"

import { useSession } from "next-auth/react"

export function useAuthSession() {
  const { data, status, update } = useSession()

  return {
    session: data,
    status,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    refreshSession: update,
  }
}
