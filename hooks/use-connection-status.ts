"use client"

import { useMemo } from "react"
import { useRuntimeStatus } from "@/hooks/use-runtime-status"

export function useConnectionStatus() {
  const { modules, connectionState, websocketState } = useRuntimeStatus()

  const supabase = useMemo(
    () => modules.find((item) => item.key === "supabase"),
    [modules]
  )
  const api = useMemo(() => modules.find((item) => item.key === "api"), [modules])

  return {
    connectionState,
    websocketState,
    supabase,
    api,
  }
}
