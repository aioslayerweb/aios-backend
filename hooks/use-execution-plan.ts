"use client"

import { usePromptOS } from "@/hooks/use-prompt-os"

export function useExecutionPlan() {
  const { plan, timeline } = usePromptOS()

  return {
    plan,
    timeline,
  }
}
