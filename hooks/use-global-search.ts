"use client"

import { useGlobalSearchContext } from "@/contexts/global-search-context"

export function useGlobalSearch() {
  return useGlobalSearchContext()
}
