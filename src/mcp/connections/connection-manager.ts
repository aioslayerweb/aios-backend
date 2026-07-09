import type { ConnectedSystem } from "@/lib/integrations"
import type { MCPCapabilityDescriptor, MCPProviderDescriptor, MCPServerConnection } from "@/src/mcp/types"
import { mcpProviderCatalog } from "@/src/mcp/utils/provider-catalog"

function providerFromSystem(system: ConnectedSystem): MCPProviderDescriptor | undefined {
  const normalized = system.id.toLowerCase()
  return mcpProviderCatalog.find((provider) => provider.id === normalized || provider.name.toLowerCase() === system.vendor.toLowerCase())
}

function baseCapabilities(name: string): MCPCapabilityDescriptor[] {
  return [
    { id: `${name}-tools`, name: "Tools", key: `${name}-tools`, description: "Tool execution surface exposed via MCP.", version: "1.0.0", stable: true },
    { id: `${name}-resources`, name: "Resources", key: `${name}-resources`, description: "Resource retrieval surface exposed via MCP.", version: "1.0.0", stable: true },
    { id: `${name}-prompts`, name: "Prompts", key: `${name}-prompts`, description: "Prompt templates exposed via MCP.", version: "1.0.0", stable: true },
  ]
}

function mapSystemToConnection(system: ConnectedSystem, organizationIds: string[], workspaceIds: string[]): MCPServerConnection {
  const provider = providerFromSystem(system)
  const providerId = provider?.id ?? "custom"
  const authMethod = provider?.authenticationMethods[0] ?? "api-key"

  return {
    id: `mcp-${system.id}`,
    provider: providerId,
    name: system.name,
    runtimeMode: provider?.runtimeMode ?? "external",
    endpoint: `mcp://${providerId}/${system.id}`,
    version: "1.0.0",
    status: system.authState === "required" ? "auth-required" : system.health === "offline" ? "disconnected" : system.health === "warning" ? "degraded" : "connected",
    tools: system.supportedObjects.map((item) => `${system.id}-tool-${item}`),
    resources: system.supportedObjects.map((item) => `${system.id}-resource-${item}`),
    prompts: [`${system.id}-prompt-default`],
    capabilities: baseCapabilities(system.id),
    health: {
      status: system.health === "offline" ? "offline" : system.health === "warning" || system.health === "rate-limited" ? "warning" : "healthy",
      latencyMs: 120,
      availabilityPercent: system.health === "offline" ? 0 : 99.2,
      retryCount: 0,
      authenticationFailures: system.authState === "required" ? 1 : 0,
      toolFailures: system.errors,
      providerFailures: system.errors,
      versionCompatibility: "compatible",
      lastCheckedAt: new Date().toISOString(),
    },
    security: {
      authenticationMethod: authMethod,
      authenticationState: system.authState === "required" ? "pending" : "validated",
      permissions: ["view_dashboard"],
      tenantAware: true,
      workspaceAware: true,
      departmentAware: true,
      roleAware: true,
    },
    organizationAssignment: organizationIds,
    workspaceAssignment: workspaceIds,
    approvalStatus: "approved",
    updateAvailable: false,
  }
}

function createPlannedConnection(provider: MCPProviderDescriptor, organizationIds: string[], workspaceIds: string[]): MCPServerConnection {
  return {
    id: `mcp-${provider.id}`,
    provider: provider.id,
    name: provider.name,
    runtimeMode: provider.runtimeMode,
    endpoint: `mcp://${provider.id}`,
    version: "1.0.0",
    status: "disconnected",
    tools: [],
    resources: [],
    prompts: [],
    capabilities: baseCapabilities(provider.id),
    health: {
      status: "offline",
      latencyMs: 0,
      availabilityPercent: 0,
      retryCount: 0,
      authenticationFailures: 0,
      toolFailures: 0,
      providerFailures: 0,
      versionCompatibility: "compatible",
      lastCheckedAt: new Date().toISOString(),
    },
    security: {
      authenticationMethod: provider.authenticationMethods[0] ?? "none",
      authenticationState: "pending",
      permissions: ["view_dashboard"],
      tenantAware: true,
      workspaceAware: true,
      departmentAware: true,
      roleAware: true,
    },
    organizationAssignment: organizationIds,
    workspaceAssignment: workspaceIds,
    approvalStatus: "pending",
    updateAvailable: false,
  }
}

export function createMCPConnectionManager(input: {
  connectedSystems: ConnectedSystem[]
  organizationIds: string[]
  workspaceIds: string[]
}): MCPServerConnection[] {
  const mapped = input.connectedSystems.map((system) => mapSystemToConnection(system, input.organizationIds, input.workspaceIds))
  const existingProviders = new Set(mapped.map((item) => item.provider))
  const planned = mcpProviderCatalog
    .filter((provider) => !existingProviders.has(provider.id) && provider.id !== "aios")
    .map((provider) => createPlannedConnection(provider, input.organizationIds, input.workspaceIds))

  return [...mapped, ...planned]
}
