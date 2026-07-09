"use client"

import { useMCPPlatformContext } from "@/src/mcp/contexts/mcp-platform-context"

export function useMCPMetrics() {
  const { metrics } = useMCPPlatformContext()
  return metrics
}
