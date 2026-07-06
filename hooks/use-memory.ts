"use client"

import { useMemoryContext } from "@/contexts/memory-context"

export function useMemory() {
  return useMemoryContext()
}
