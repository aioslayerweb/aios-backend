"use client"

import { useMCPPlatformContext } from "@/src/mcp/contexts/mcp-platform-context"

export function useMCPPrompts() {
  const { registry } = useMCPPlatformContext()
  return {
    prompts: registry.prompts,
  }
}
