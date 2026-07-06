"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

type SidebarContextValue = {
  collapsed: boolean
  setCollapsed: (value: boolean) => void
  toggle: () => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  const value = useMemo(
    () => ({
      collapsed,
      setCollapsed,
      toggle: () => setCollapsed((prev) => !prev),
    }),
    [collapsed]
  )

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export function useSidebarContext(): SidebarContextValue {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebarContext must be used within SidebarProvider")
  }

  return context
}
