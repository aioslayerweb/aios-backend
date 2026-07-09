"use client"

import { useMCPPlatformContext } from "@/src/mcp/contexts/mcp-platform-context"

export function useMCPServers() {
  const { host } = useMCPPlatformContext()
  return {
    servers: host.servers,
    activeServerIds: host.activeServerIds,
    supportsFutureServers: host.supportsFutureServers,
  }
}
