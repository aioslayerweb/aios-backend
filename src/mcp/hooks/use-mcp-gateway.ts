"use client"

import { useMCPPlatformContext } from "@/src/mcp/contexts/mcp-platform-context"

export function useMCPGateway() {
  const { gateway, executeRequest, traces } = useMCPPlatformContext()
  return {
    gateway,
    executeRequest,
    traces,
  }
}
