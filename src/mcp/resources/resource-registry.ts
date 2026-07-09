import type { MCPResourceCategory, MCPResourceRegistryEntry, MCPServerConnection } from "@/src/mcp/types"

function categoryFromResource(resource: string): MCPResourceCategory {
  if (resource.includes("knowledge")) return "knowledge"
  if (resource.includes("file")) return "files"
  if (resource.includes("email")) return "emails"
  if (resource.includes("ticket") || resource.includes("message")) return "messages"
  if (resource.includes("dashboard")) return "dashboards"
  if (resource.includes("report")) return "reports"
  if (resource.includes("database")) return "databases"
  if (resource.includes("crm") || resource.includes("contact") || resource.includes("deal")) return "crm"
  if (resource.includes("erp")) return "erp"
  return "documents"
}

export function createMCPResourceRegistry(servers: MCPServerConnection[]): MCPResourceRegistryEntry[] {
  return servers.flatMap((server) =>
    server.resources.map((resourceId) => ({
      id: resourceId,
      name: resourceId.replace(/-/g, " "),
      category: categoryFromResource(resourceId),
      description: `Resource exposed by ${server.name}.`,
      provider: server.provider,
      server: server.id,
      tenantScoped: true,
      workspaceScoped: true,
      departmentScoped: true,
      health: server.health.status,
      status: server.status === "connected" ? "available" : server.status === "degraded" ? "restricted" : "offline",
    }))
  )
}
