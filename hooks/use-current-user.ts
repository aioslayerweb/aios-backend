"use client"

import { useAuthContext } from "@/contexts/auth-context"

export function useCurrentUser() {
  const { user, isAuthenticated, authenticationMethod, signInAs, signOut } = useAuthContext()

  return {
    currentUser: user,
    isAuthenticated,
    authenticationMethod,
    signInAs,
    signOut,
  }
}