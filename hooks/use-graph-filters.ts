"use client"

import { useKnowledgeGraph } from "@/hooks/use-knowledge-graph"

export function useGraphFilters() {
  const { filters, updateFilters, clearFilters } = useKnowledgeGraph()

  return {
    filters,
    updateFilters,
    clearFilters,
  }
}