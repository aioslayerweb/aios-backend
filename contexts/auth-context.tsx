"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import { signOut, useSession } from "next-auth/react"
import { useSecurityContext } from "@/contexts/security-context"
import type { SessionRecord, UserRecord } from "@/types"
import type { AuthenticatedIdentity, AuthenticationMethod } from "@/types/security-foundation"

type AuthContextValue = AuthenticatedIdentity & {
  authenticationStatus: "loading" | "authenticated" | "unauthenticated"
  signInAs: (userId: string, method?: AuthenticationMethod) => void
  signOut: () => void
  refreshIdentity: () => void
}

function mapSessionUserToUserRecord(sessionUser: { id?: string; name?: string | null; email?: string | null }, security: ReturnType<typeof useSecurityContext>, activeUserId: string | null): UserRecord | null {
  const byId = activeUserId ? security.users.find((item) => item.id === activeUserId) : undefined
  if (byId) {
    return byId
  }

  const email = typeof sessionUser.email === "string" ? sessionUser.email.toLowerCase() : ""
  const byEmail = security.users.find((item) => item.email.toLowerCase() === email)
  if (byEmail) {
    return byEmail
  }

  if (!email) {
    return null
  }

  const fallbackOrganization = security.organizations[0]?.id ?? "org-default"
  const fallbackWorkspace = security.workspaces[0]?.id ?? "workspace-default"
  const fallbackDepartment = security.departments[0]?.id ?? "department-default"
  const fallbackTeam = security.teams[0]?.id
  const fallbackRole = security.roles[0]?.id ?? "role-default"

  return {
    id: sessionUser.id ?? `user-${email.split("@")[0]}`,
    organizationId: fallbackOrganization,
    workspaceId: fallbackWorkspace,
    departmentId: fallbackDepartment,
    teamIds: fallbackTeam ? [fallbackTeam] : [],
    name: sessionUser.name ?? "AIOS User",
    email,
    department: "executive",
    roleId: fallbackRole,
    status: "active",
    lastLogin: new Date().toISOString(),
    assignedAgents: [],
    assignedWorkflows: [],
    serviceAccount: false,
  }
}

function mapUserToSessionRecord(user: UserRecord | null, sessions: ReadonlyArray<SessionRecord>): SessionRecord | null {
  if (!user) {
    return null
  }

  return sessions.find((item) => item.userId === user.id) ?? sessions.find((item) => item.current) ?? null
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const security = useSecurityContext()
  const { data: session, status, update } = useSession()
  const [method, setMethod] = useState<AuthenticationMethod>("email")
  const [activeUserId, setActiveUserId] = useState<string | null>(null)

  const user = useMemo(
    () => mapSessionUserToUserRecord(session?.user ?? {}, security, activeUserId),
    [activeUserId, security, session?.user],
  )

  const sessionRecord = useMemo(() => mapUserToSessionRecord(user, security.sessions), [security.sessions, user])
  const isAuthenticated = status === "authenticated" && Boolean(session?.user)

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session: sessionRecord,
      isAuthenticated,
      authenticationStatus: status,
      authenticationMethod: method,
      authenticatedAt: Date.now(),
      mfaEnabled: true,
      serviceAccount: false,
      externalUser: user?.roleId === "role-guest",
      signInAs: (userId: string, nextMethod: AuthenticationMethod = method) => {
        setActiveUserId(userId)
        setMethod(nextMethod)
      },
      signOut: () => {
        void signOut({ callbackUrl: "/login" })
      },
      refreshIdentity: () => {
        void update()
      },
    }),
    [isAuthenticated, method, sessionRecord, status, update, user]
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