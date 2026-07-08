"use client"

import { useKnowledgeGraphContext } from "@/contexts/knowledge-graph-context"

export function useKnowledgeGraph() {
  return useKnowledgeGraphContext()
}