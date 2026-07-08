"use client"

import { useSecurityContext } from "@/contexts/security-context"

export function useWorkspaces() {
  const { filteredWorkspaces, selectedWorkspace, selectedWorkspaceId, setSelectedWorkspaceId } = useSecurityContext()

  return {
    workspaces: filteredWorkspaces,
    selectedWorkspace,
    selectedWorkspaceId,
    setSelectedWorkspaceId,
  }
}