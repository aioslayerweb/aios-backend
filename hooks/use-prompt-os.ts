"use client"

import { usePromptOSContext } from "@/contexts/prompt-os-context"

export function usePromptOS() {
  return usePromptOSContext()
}
