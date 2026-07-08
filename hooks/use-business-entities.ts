"use client"

import { useKnowledgeGraph } from "@/hooks/use-knowledge-graph"

export function useBusinessEntities() {
  const { visibleNodes, selectedNode, selectedNodeId, setSelectedNodeId } = useKnowledgeGraph()

  return {
    entities: visibleNodes,
    selectedEntity: selectedNode,
    selectedEntityId: selectedNodeId,
    setSelectedEntityId: setSelectedNodeId,
  }
}