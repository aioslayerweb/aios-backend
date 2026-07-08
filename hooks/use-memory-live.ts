"use client"

import { useRuntimeLive } from "@/hooks/use-runtime-live"

export function useMemoryLive() {
  const { memoryUpdates } = useRuntimeLive()

  return {
    memoryUpdates,
  }
}
