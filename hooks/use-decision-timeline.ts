"use client"

import { useDecisionEngine } from "@/hooks/use-decision-engine"

export function useDecisionTimeline() {
  const { timeline, selectedDecisionId } = useDecisionEngine()

  return {
    timeline: timeline.filter((item) => item.decisionId === selectedDecisionId),
  }
}