"use client"

import { useRuntimeStatusContext } from "@/contexts/runtime-status-context"

export function useRuntimeStatus() {
  return useRuntimeStatusContext()
}
