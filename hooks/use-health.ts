"use client"

import { useRuntimeLive } from "@/hooks/use-runtime-live"

export function useHealth() {
  const { health } = useRuntimeLive()

  return {
    health,
  }
}
