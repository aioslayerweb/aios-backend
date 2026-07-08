"use client"

import { useKnowledgeGraph } from "@/hooks/use-knowledge-graph"

export function useEntityInspector() {
  const { selectedInspector, selectedNode } = useKnowledgeGraph()

  return {
    inspector: selectedInspector,
    selectedEntity: selectedNode,
  }
}