"use client"

import { useAIAssistant } from "@/hooks/use-ai-assistant"

export function useExecutionTimeline() {
  const { executionTimeline } = useAIAssistant()
  return executionTimeline
}
