"use client"

import { useKnowledgeGraph } from "@/hooks/use-knowledge-graph"

export function useKnowledgeTimeline() {
  const { selectedTimeline } = useKnowledgeGraph()

  return {
    timeline: selectedTimeline,
  }
}