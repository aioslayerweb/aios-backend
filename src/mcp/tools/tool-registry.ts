import type { MCPServerConnection, MCPToolRegistryEntry } from "@/src/mcp/types"

export function createMCPToolRegistry(servers: MCPServerConnection[]): MCPToolRegistryEntry[] {
  return servers.flatMap((server) =>
    server.tools.map((toolId) => ({
      id: toolId,
      name: toolId.replace(/-/g, " "),
      description: `Tool surfaced from ${server.name} through MCP gateway routing.`,
      provider: server.provider,
      server: server.id,
      version: server.version,
      requiredPermissions: server.security.permissions,
      requiredRole: "Any",
      requiredCapabilities: server.capabilities.map((capability) => capability.id),
      supportedDepartments: ["cross-functional"],
      inputSchema: { type: "object", properties: { query: { type: "string" } } },
      outputSchema: { type: "object", properties: { result: { type: "string" } } },
      health: server.health.status,
      status: server.status === "connected" ? "ready" : server.status === "degraded" ? "degraded" : "disabled",
    }))
  )
}
