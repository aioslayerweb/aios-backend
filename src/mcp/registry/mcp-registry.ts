import type {
  MCPRegistryServerRecord,
  MCPRegistryState,
  MCPResourceRegistryEntry,
  MCPServerConnection,
  MCPToolRegistryEntry,
  MCPPromptRegistryEntry,
} from "@/src/mcp/types"

function mapServerRecord(connection: MCPServerConnection): MCPRegistryServerRecord {
  return {
    id: connection.id,
    provider: connection.provider,
    version: connection.version,
    health: connection.health.status,
    authentication: connection.security.authenticationMethod,
    organizationAssignment: connection.organizationAssignment,
    workspaceAssignment: connection.workspaceAssignment,
    usageCount: connection.tools.length + connection.resources.length + connection.prompts.length,
    latencyMs: connection.health.latencyMs,
    errors: connection.health.toolFailures + connection.health.providerFailures,
    updateAvailable: connection.updateAvailable,
    approvalStatus: connection.approvalStatus,
  }
}

export function createMCPRegistryState(input: {
  servers: MCPServerConnection[]
  tools: MCPToolRegistryEntry[]
  resources: MCPResourceRegistryEntry[]
  prompts: MCPPromptRegistryEntry[]
}): MCPRegistryState {
  return {
    mode: "registry",
    installedServers: input.servers.map(mapServerRecord),
    availableTools: input.tools,
    resources: input.resources,
    prompts: input.prompts,
  }
}
