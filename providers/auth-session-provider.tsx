"use client"

import type { ReactNode } from "react"
import { SessionContext, SessionProvider, type SessionContextValue } from "next-auth/react"

const disabledSession: SessionContextValue = {
  data: null,
  status: "unauthenticated",
  update: async () => null,
}

export function AuthSessionProvider({ children, enabled = true }: { children: ReactNode; enabled?: boolean }) {
  if (!enabled) {
    return <SessionContext.Provider value={disabledSession}>{children}</SessionContext.Provider>
  }

  return (
    <SessionProvider
      refetchInterval={5 * 60}
      refetchOnWindowFocus
    >
      {children}
    </SessionProvider>
  )
}
