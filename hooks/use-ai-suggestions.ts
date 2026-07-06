"use client"

import { useMemo } from "react"
import { useAIAssistant } from "@/hooks/use-ai-assistant"

export function useAISuggestions() {
  const { suggestions } = useAIAssistant()

  const highPriority = useMemo(
    () => suggestions.filter((item) => item.priority === "high"),
    [suggestions]
  )

  return {
    suggestions,
    highPriority,
  }
}
