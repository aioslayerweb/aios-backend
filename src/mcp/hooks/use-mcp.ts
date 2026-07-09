"use client"

import { useMCPPlatformContext } from "@/src/mcp/contexts/mcp-platform-context"

export function useMCP() {
  return useMCPPlatformContext()
}
