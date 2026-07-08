"use client"

import { useWorkflowBuilderContext } from "@/contexts/workflow-builder-context"

export function useWorkflowBuilder() {
  return useWorkflowBuilderContext()
}
