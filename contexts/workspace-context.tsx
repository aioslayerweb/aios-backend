"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import type { WorkspaceKey } from "@/types"

type WorkspaceContextValue = {
  workspace: WorkspaceKey
  contextId: string | null
  setWorkspace: (workspace: WorkspaceKey) => void
  setContextId: (contextId: string | null) => void
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspace, setWorkspace] = useState<WorkspaceKey>("home")
  const [contextId, setContextId] = useState<string | null>(null)

  const value = useMemo(
    () => ({ workspace, contextId, setWorkspace, setContextId }),
    [workspace, contextId]
  )

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useWorkspaceContext(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error("useWorkspaceContext must be used within WorkspaceProvider")
  }

  return context
}
