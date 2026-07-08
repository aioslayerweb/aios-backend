"use client"

import { useMemo } from "react"
import { useGlobalSearchContext } from "@/contexts/global-search-context"

export function useMemorySearch() {
  const { memoryExplorer, query } = useGlobalSearchContext()

  const filteredMemory = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      return memoryExplorer
    }

    return memoryExplorer.filter((item) => {
      const haystack = `${item.title} ${item.summary} ${item.lane}`.toLowerCase()
      return haystack.includes(normalized)
    })
  }, [memoryExplorer, query])

  return {
    memories: filteredMemory,
    totalMemories: memoryExplorer.length,
  }
}
