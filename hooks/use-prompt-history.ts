"use client"

import { useMemo } from "react"
import { usePromptOS } from "@/hooks/use-prompt-os"

export function usePromptHistory(search = "") {
  const { history, searchHistory } = usePromptOS()

  const filtered = useMemo(() => searchHistory(search), [search, searchHistory])
  const pinned = useMemo(() => history.filter((item) => item.pinned), [history])
  const favorites = useMemo(() => history.filter((item) => item.favorite), [history])

  return {
    history: filtered,
    pinned,
    favorites,
  }
}
