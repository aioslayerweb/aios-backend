"use client"

import { useWorkspaceContext } from "@/contexts/workspace-context"

export function useWorkspace() {
  return useWorkspaceContext()
}
