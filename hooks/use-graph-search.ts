"use client"

import { useKnowledgeGraph } from "@/hooks/use-knowledge-graph"

export function useGraphSearch() {
  const { search, updateSearch } = useKnowledgeGraph()

  return {
    search,
    updateSearch,
  }
}