"use client"

import { useMemo } from "react"
import { usePromptOS } from "@/hooks/use-prompt-os"

export function usePromptExecution() {
  const { status, interpretation, agents, timeline, plan, reasoning } = usePromptOS()

  const progress = useMemo(() => {
    if (plan.length === 0) {
      return 0
    }

    const completed = plan.filter((item) => item.status === "completed").length
    return Math.round((completed / plan.length) * 100)
  }, [plan])

  return {
    status,
    interpretation,
    agents,
    timeline,
    plan,
    reasoning,
    progress,
  }
}
