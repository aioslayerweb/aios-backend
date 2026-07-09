"use client"

import { useMCPPlatformContext } from "@/src/mcp/contexts/mcp-platform-context"

export function useMCPHealth() {
  const { health } = useMCPPlatformContext()
  return health
}
