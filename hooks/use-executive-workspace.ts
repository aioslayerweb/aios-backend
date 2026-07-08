"use client"

import { useExecutiveWorkspaceContext } from "@/contexts/executive-workspace-context"

export function useExecutiveWorkspace() {
  return useExecutiveWorkspaceContext()
}
