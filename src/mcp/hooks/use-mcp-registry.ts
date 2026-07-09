"use client"

import { useMCPPlatformContext } from "@/src/mcp/contexts/mcp-platform-context"

export function useMCPRegistry() {
  const { registry } = useMCPPlatformContext()
  return registry
}
