"use client"

import { useGlobalSearchContext } from "@/contexts/global-search-context"

export function useRecentSearches() {
  const { recentSearches, commitSearch } = useGlobalSearchContext()

  return {
    recentSearches,
    commitSearch,
  }
}
