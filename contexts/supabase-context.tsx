"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { loadWhenEnabled } from "@/lib/runtime/live-data-boundary"
import type { BrowserSupabaseClient } from "@/lib/supabase"

type SupabaseContextValue = {
  client: BrowserSupabaseClient | null
}

const SupabaseContext = createContext<SupabaseContextValue | null>(null)

export function SupabaseProvider({
  children,
  enabled,
}: {
  children: ReactNode
  enabled: boolean
}) {
  const [client, setClient] = useState<BrowserSupabaseClient | null>(null)

  useEffect(() => {
    let active = true

    const initializeClient = async () => {
      const nextClient = await loadWhenEnabled(enabled, async () => {
        const { getBrowserSupabaseClient } = await import("@/lib/supabase")
        return getBrowserSupabaseClient()
      })

      if (active) {
        setClient(nextClient)
      }
    }

    void initializeClient()

    return () => {
      active = false
    }
  }, [enabled])

  return <SupabaseContext.Provider value={{ client }}>{children}</SupabaseContext.Provider>
}

export function useSupabaseContext(): SupabaseContextValue {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error("useSupabaseContext must be used within SupabaseProvider")
  }

  return context
}
