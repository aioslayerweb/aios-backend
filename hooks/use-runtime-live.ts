"use client"

import { useRuntimeLiveContext } from "@/contexts/runtime-live-context"

export function useRuntimeLive() {
  return useRuntimeLiveContext()
}
