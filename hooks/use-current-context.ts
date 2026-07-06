"use client"

import { useAIAssistant } from "@/hooks/use-ai-assistant"

export function useCurrentContext() {
  const { currentContext } = useAIAssistant()
  return currentContext
}
