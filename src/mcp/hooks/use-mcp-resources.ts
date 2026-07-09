"use client"

import { useMCPPlatformContext } from "@/src/mcp/contexts/mcp-platform-context"

export function useMCPResources() {
  const { registry } = useMCPPlatformContext()
  return {
    resources: registry.resources,
  }
}
