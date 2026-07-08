"use client"

import { useMemo } from "react"
import { useExecutiveWorkspace } from "@/hooks/use-executive-workspace"

export function useDecisionCenter() {
  const { decisions, approveDecision } = useExecutiveWorkspace()

  const pending = useMemo(
    () => decisions.filter((item) => item.status === "proposed" || item.status === "under_review"),
    [decisions]
  )

  return {
    decisions,
    pending,
    approveDecision,
  }
}
