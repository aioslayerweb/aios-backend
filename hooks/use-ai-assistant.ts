"use client"

import { useAIAssistantContext } from "@/contexts/ai-assistant-context"

export function useAIAssistant() {
  return useAIAssistantContext()
}
