"use client"

import { createContext, useContext, useMemo, type ReactNode } from "react"
import { getBrowserSupabaseClient, type BrowserSupabaseClient } from "@/lib/supabase"

type SupabaseContextValue = {
  client: BrowserSupabaseClient | null
}

const SupabaseContext = createContext<SupabaseContextValue | null>(null)

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const value = useMemo(
    () => ({ client: getBrowserSupabaseClient() }),
    []
  )

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>
}

export function useSupabaseContext(): SupabaseContextValue {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error("useSupabaseContext must be used within SupabaseProvider")
  }

  return context
}
