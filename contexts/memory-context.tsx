"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

export type MemoryEntry = {
  id: string
  contextId: string
  summary: string
  createdAt: number
}

type MemoryContextValue = {
  entries: MemoryEntry[]
  setEntries: (entries: MemoryEntry[]) => void
  addEntry: (entry: MemoryEntry) => void
}

const MemoryContext = createContext<MemoryContextValue | null>(null)

export function MemoryProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<MemoryEntry[]>([])

  const value = useMemo(
    () => ({
      entries,
      setEntries,
      addEntry: (entry: MemoryEntry) => setEntries((prev) => [entry, ...prev]),
    }),
    [entries]
  )

  return <MemoryContext.Provider value={value}>{children}</MemoryContext.Provider>
}

export function useMemoryContext(): MemoryContextValue {
  const context = useContext(MemoryContext)
  if (!context) {
    throw new Error("useMemoryContext must be used within MemoryProvider")
  }

  return context
}
