"use client"

import { useMCPPlatformContext } from "@/src/mcp/contexts/mcp-platform-context"

export function useMCPTools() {
  const { registry } = useMCPPlatformContext()
  return {
    tools: registry.availableTools,
  }
}
