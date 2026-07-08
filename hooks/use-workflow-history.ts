"use client"

import { useMemo } from "react"
import { useWorkflowBuilder } from "@/hooks/use-workflow-builder"

export function useWorkflowHistory() {
  const { selectedWorkflow } = useWorkflowBuilder()

  const history = useMemo(() => selectedWorkflow?.history ?? [], [selectedWorkflow])
  const versions = useMemo(() => selectedWorkflow?.versions ?? [], [selectedWorkflow])

  return {
    history,
    versions,
  }
}
