import type { MCPHealthSnapshot, MCPServerConnection } from "@/src/mcp/types"

export function createMCPHealthSnapshot(servers: MCPServerConnection[]): MCPHealthSnapshot {
  const connected = servers.filter((server) => server.status === "connected")
  const degraded = servers.filter((server) => server.status === "degraded")
  const offline = servers.filter((server) => server.status === "disconnected" || server.status === "auth-required")
  const averageLatencyMs = servers.length === 0 ? 0 : Math.round(servers.reduce((sum, server) => sum + server.health.latencyMs, 0) / servers.length)

  return {
    overall: offline.length > 0 ? "warning" : "healthy",
    connectedServers: connected.length,
    degradedServers: degraded.length,
    offlineServers: offline.length,
    averageLatencyMs,
    authenticationFailures: servers.reduce((sum, server) => sum + server.health.authenticationFailures, 0),
    versionCompatibilityWarnings: servers.filter((server) => server.health.versionCompatibility !== "compatible").length,
    retryCount: servers.reduce((sum, server) => sum + server.health.retryCount, 0),
    toolFailures: servers.reduce((sum, server) => sum + server.health.toolFailures, 0),
    providerFailures: servers.reduce((sum, server) => sum + server.health.providerFailures, 0),
  }
}
