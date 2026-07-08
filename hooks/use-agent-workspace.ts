"use client"

import { useAgentWorkspaceContext } from "@/contexts/agent-workspace-context"

export function useAgentWorkspace() {
  return useAgentWorkspaceContext()
}
