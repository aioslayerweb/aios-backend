import type {
  AvailableIntegration,
  ConnectedSystem,
  IntegrationDeveloperTool,
  IntegrationState,
  IntegrationTouchpoint,
} from "../types"
import type { EnterpriseIntegrationAdapter } from "../adapters/base-adapter"

function mapConnectedSystem(adapter: EnterpriseIntegrationAdapter): ConnectedSystem {
  const definition = adapter.definition
  const mock = definition.mock

  return {
    id: definition.id,
    name: definition.name,
    vendor: definition.vendor,
    category: definition.category,
    health: mock ? "auth-required" : definition.health,
    authState: mock ? "required" : definition.authState,
    lastSync: mock ? "never" : definition.lastSync,
    synchronizedObjects: mock ? 0 : definition.synchronizedObjects,
    errors: mock ? 0 : definition.errors,
    statusDetail: mock
      ? "Catalog example only. Provider credentials and synchronization infrastructure are not configured."
      : definition.statusDetail,
    linkedModules: definition.linkedModules,
    authMethods: definition.authMethods,
    supportedObjects: definition.supportedObjects,
    mock,
  }
}

function mapAvailableIntegration(adapter: EnterpriseIntegrationAdapter): AvailableIntegration {
  const definition = adapter.definition

  return {
    id: definition.id,
    name: definition.name,
    category: definition.category,
    description: definition.description,
    authMethods: definition.authMethods,
    supportedObjects: definition.supportedObjects,
    status: !definition.mock && definition.authState === "connected" ? "connected" : "available",
    mock: definition.mock,
  }
}

function buildTouchpoints(): IntegrationTouchpoint[] {
  return [
    {
      id: "touchpoint-runtime",
      name: "Runtime Engine",
      description: "Planned integration point; no connector sync worker or retry queue is configured.",
      adapterCount: 0,
      state: "planned",
    },
    {
      id: "touchpoint-memory",
      name: "Memory Layer",
      description: "Planned integration point; normalized connector records are not persisted to Business Memory.",
      adapterCount: 0,
      state: "planned",
    },
    {
      id: "touchpoint-events",
      name: "Event Processor + Event Replay",
      description: "Planned integration point; inbound connector events and replay are not configured.",
      adapterCount: 0,
      state: "planned",
    },
    {
      id: "touchpoint-promptos",
      name: "Prompt OS + Workflow Builder",
      description: "Planned integration point; external provider signals are not connected to workflows.",
      adapterCount: 0,
      state: "planned",
    },
    {
      id: "touchpoint-executive",
      name: "Executive Intelligence Center + Planning Engine + Multi-Agent Orchestrator",
      description: "Planned integration point; no provider records are currently supplied to intelligence surfaces.",
      adapterCount: 0,
      state: "planned",
    },
  ]
}

function buildDeveloperTools(systems: ConnectedSystem[]): IntegrationDeveloperTool[] {
  return systems.map((system) => ({
    id: `dev-${system.id}`,
    name: `${system.name} Adapter`,
    transport: system.authMethods.includes("service-account") ? ["polling", "webhook"] : ["webhook"],
    rateLimitPerMinute: 0,
    retries: 0,
    queue: "not-configured",
    webhookTopics: [],
    pollingWindow: "Not configured",
  }))
}

export function createIntegrationState(adapters: EnterpriseIntegrationAdapter[]): IntegrationState {
  const connectedSystems = adapters.map(mapConnectedSystem)
  const availableIntegrations = adapters.map(mapAvailableIntegration)

  return {
    connectedSystems,
    availableIntegrations,
    syncJobs: [],
    activities: [],
    logs: [],
    touchpoints: buildTouchpoints(),
    developerTools: buildDeveloperTools(connectedSystems),
    selectedCategory: "all",
    developerMode: false,
  }
}
