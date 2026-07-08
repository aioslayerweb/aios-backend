"use client"

import { useKnowledgeGraph } from "@/hooks/use-knowledge-graph"

export function useRelationships() {
  const { visibleEdges } = useKnowledgeGraph()

  return {
    relationships: visibleEdges,
  }
}