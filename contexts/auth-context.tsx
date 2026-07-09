"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import { useSecurityContext } from "@/contexts/security-context"
import type { AuthenticationMethod } from "@/types/security-foundation"
import { createAuthenticatedIdentity } from "@/utils/security-foundation"

type AuthContextValue = ReturnType<typeof createAuthenticatedIdentity> & {
  signInAs: (userId: string, method?: AuthenticationMethod) => void
  signOut: () => void
  refreshIdentity: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const security = useSecurityContext()
  const [method, setMethod] = useState<AuthenticationMethod>("passwordless")
  const [activeUserId, setActiveUserId] = useState<string | null>(security.users.find((item) => item.status === "active")?.id ?? security.users[0]?.id ?? null)
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  const baseIdentity = useMemo(() => createAuthenticatedIdentity(security, method), [method, security])
  const user = useMemo(() => security.users.find((item) => item.id === activeUserId) ?? baseIdentity.user, [activeUserId, baseIdentity.user, security.users])

  const value = useMemo<AuthContextValue>(
    () => ({
      ...baseIdentity,
      user,
      isAuthenticated: isAuthenticated && Boolean(user),
      authenticationMethod: method,
      signInAs: (userId: string, nextMethod: AuthenticationMethod = method) => {
        setActiveUserId(userId)
        setMethod(nextMethod)
        setIsAuthenticated(true)
      },
      signOut: () => {
        setIsAuthenticated(false)
      },
      refreshIdentity: () => {
        setIsAuthenticated(Boolean(user))
      },
    }),
    [baseIdentity, isAuthenticated, method, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider")
  }

  return context
}