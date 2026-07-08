"use client"

import { useMemo } from "react"
import { useGlobalSearchContext } from "@/contexts/global-search-context"

export function useKnowledge() {
  const { knowledgeCollections, query } = useGlobalSearchContext()

  const filteredCollections = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      return knowledgeCollections
    }

    return knowledgeCollections.filter((item) => {
      const haystack = `${item.name} ${item.topics.join(" ")}`.toLowerCase()
      return haystack.includes(normalized)
    })
  }, [knowledgeCollections, query])

  return {
    collections: filteredCollections,
    totalCollections: knowledgeCollections.length,
  }
}
