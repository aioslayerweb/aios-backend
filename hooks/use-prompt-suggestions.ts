"use client"

import { usePromptOS } from "@/hooks/use-prompt-os"

export function usePromptSuggestions() {
  const { followUps, applyFollowUp } = usePromptOS()

  return {
    suggestions: followUps,
    applyFollowUp,
  }
}
