"use client"

import { useExecutiveWorkspace } from "@/hooks/use-executive-workspace"

export function useExecutiveBriefing() {
  const { briefing, summary } = useExecutiveWorkspace()

  return {
    briefing,
    summary,
  }
}
