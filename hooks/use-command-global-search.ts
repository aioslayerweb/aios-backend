"use client"

import { useEffect, useState } from "react"
import { useCommandSearch } from "@/hooks/use-command-search"

export function useCommandGlobalSearch(query: string, debounceMs = 90) {
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query)
    }, debounceMs)

    return () => window.clearTimeout(timer)
  }, [debounceMs, query])

  return useCommandSearch(debouncedQuery)
}
