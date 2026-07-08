"use client"

import { useMemo } from "react"
import { useWorkflowBuilder } from "@/hooks/use-workflow-builder"

export function useWorkflowExecution() {
  const { execution, selectedWorkflow, runExecutionPreview, stopExecutionPreview } = useWorkflowBuilder()

  const completion = useMemo(() => {
    if (execution.steps.length === 0) {
      return 0
    }

    const done = execution.steps.filter((item) => item.status === "completed").length
    return Math.round((done / execution.steps.length) * 100)
  }, [execution.steps])

  return {
    execution,
    selectedWorkflow,
    completion,
    runExecutionPreview,
    stopExecutionPreview,
  }
}
