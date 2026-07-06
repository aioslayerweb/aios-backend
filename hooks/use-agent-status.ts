"use client"

import { useMemo } from "react"
import { useAIAssistant } from "@/hooks/use-ai-assistant"

export function useAgentStatus() {
  const { agentStatuses } = useAIAssistant()

  const runningCount = useMemo(
    () => agentStatuses.filter((item) => item.status === "running").length,
    [agentStatuses]
  )

  return {
    agentStatuses,
    runningCount,
  }
}
