"use client"

import type { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  return <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus>{children}</SessionProvider>
}
