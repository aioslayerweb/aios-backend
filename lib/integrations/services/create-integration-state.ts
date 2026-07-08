import type {
  ConnectedSystem,
  AvailableIntegration,
  IntegrationActivity,
  IntegrationDeveloperTool,
  IntegrationLogEntry,
  IntegrationState,
  IntegrationSyncJob,
  IntegrationTouchpoint,
} from "../types"
import type { EnterpriseIntegrationAdapter } from "../adapters/base-adapter"

function mapConnectedSystem(adapter: EnterpriseIntegrationAdapter): ConnectedSystem {
  const definition = adapter.definition

  return {
    id: definition.id,
    name: definition.name,
    vendor: definition.vendor,
    category: definition.category,
    health: definition.health,
    authState: definition.authState,
    lastSync: definition.lastSync,
    synchronizedObjects: definition.synchronizedObjects,
    errors: definition.errors,
    statusDetail: definition.statusDetail,
    linkedModules: definition.linkedModules,
    authMethods: definition.authMethods,
    supportedObjects: definition.supportedObjects,
    mock: definition.mock,
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
    status: definition.authState === "connected" ? "connected" : "available",
    mock: definition.mock,
  }
}

function buildSyncJobs(systems: ConnectedSystem[]): IntegrationSyncJob[] {
  return systems.slice(0, 8).map((system, index) => ({
    id: `sync-${system.id}`,
    systemId: system.id,
    systemName: system.name,
    object: system.supportedObjects[index % system.supportedObjects.length] ?? "knowledge",
    status:
      system.health === "offline"
        ? "failed"
        : system.health === "warning" || system.health === "rate-limited"
          ? "queued"
          : index % 4 === 0
            ? "running"
            : "completed",
    queued: index % 4 === 1 ? 22 : 8,
    running: index % 4 === 0 ? 3 : 1,
    completed: 120 + index * 17,
    failed: system.errors,
    updatedAt: system.lastSync,
  }))
}

function buildActivities(): IntegrationActivity[] {
  return [
    {
      id: "activity-1",
      title: "New CRM contact synced",
      detail: "HubSpot contact lifecycle event linked to Planning Engine revenue forecast.",
      source: "HubSpot",
      timestamp: "2 min ago",
      status: "synced",
    },
    {
      id: "activity-2",
      title: "Calendar updated",
      detail: "Microsoft 365 meeting changes replayed into Executive Intelligence Center briefing context.",
      source: "Microsoft 365",
      timestamp: "5 min ago",
      status: "updated",
    },
    {
      id: "activity-3",
      title: "Invoice imported",
      detail: "Stripe settlement data normalized into finance memory objects.",
      source: "Stripe",
      timestamp: "9 min ago",
      status: "created",
    },
    {
      id: "activity-4",
      title: "Knowledge indexed",
      detail: "Confluence page bundle embedded for Prompt OS retrieval.",
      source: "Confluence",
      timestamp: "14 min ago",
      status: "synced",
    },
    {
      id: "activity-5",
      title: "Workflow triggered",
      detail: "Slack escalation event routed to Multi-Agent Orchestrator incident workflow.",
      source: "Slack",
      timestamp: "18 min ago",
      status: "warning",
    },
  ]
}

function buildLogs(): IntegrationLogEntry[] {
  return [
    {
      id: "log-1",
      timestamp: "2026-07-08 09:14:22",
      source: "Salesforce",
      target: "Memory Layer",
      duration: "482ms",
      status: "warning",
      retryable: true,
      detail: "Bulk opportunity sync queued after rate limit threshold.",
    },
    {
      id: "log-2",
      timestamp: "2026-07-08 09:12:09",
      source: "Microsoft 365",
      target: "Event Processor",
      duration: "164ms",
      status: "success",
      retryable: false,
      detail: "Email delta checkpoint applied successfully.",
    },
    {
      id: "log-3",
      timestamp: "2026-07-08 09:06:54",
      source: "Xero",
      target: "Event Replay",
      duration: "1.8s",
      status: "failed",
      retryable: true,
      detail: "Tenant sandbox region unavailable; replay deferred.",
    },
    {
      id: "log-4",
      timestamp: "2026-07-08 08:58:10",
      source: "Slack",
      target: "Workflow Builder",
      duration: "96ms",
      status: "success",
      retryable: false,
      detail: "Incident webhook mapped to AIOS escalation workflow.",
    },
  ]
}

function buildTouchpoints(adapterCount: number): IntegrationTouchpoint[] {
  return [
    {
      id: "touchpoint-runtime",
      name: "Runtime Engine",
      description: "Executes sync workflows, schedules retries, and coordinates long-running adapter jobs.",
      adapterCount,
      state: "ready",
    },
    {
      id: "touchpoint-memory",
      name: "Memory Layer",
      description: "Converts synchronized objects into memory objects and durable business context.",
      adapterCount,
      state: "observing",
    },
    {
      id: "touchpoint-events",
      name: "Event Processor + Event Replay",
      description: "Normalizes inbound events and replays failed sequences for deterministic recovery.",
      adapterCount,
      state: "replaying",
    },
    {
      id: "touchpoint-promptos",
      name: "Prompt OS + Workflow Builder",
      description: "Turns enterprise signals into retrieval context and automation triggers.",
      adapterCount,
      state: "ready",
    },
    {
      id: "touchpoint-executive",
      name: "Executive Intelligence Center + Planning Engine + Multi-Agent Orchestrator",
      description: "Consumes synchronized evidence to plan, explain, recommend, and orchestrate business actions.",
      adapterCount,
      state: "observing",
    },
  ]
}

function buildDeveloperTools(systems: ConnectedSystem[]): IntegrationDeveloperTool[] {
  return systems.map((system) => ({
    id: `dev-${system.id}`,
    name: `${system.name} Adapter`,
    transport: system.authMethods.includes("service-account") ? ["polling", "webhook"] : ["webhook"],
    rateLimitPerMinute: 300,
    retries: system.errors > 0 ? 5 : 3,
    queue: `queue.${system.id.replace(/-/g, ".")}`,
    webhookTopics: system.supportedObjects.slice(0, 3).map((item) => `${system.id}.${item}.updated`),
    pollingWindow: system.health === "offline" ? "Paused" : "5m incremental",
  }))
}

export function createIntegrationState(adapters: EnterpriseIntegrationAdapter[]): IntegrationState {
  const connectedSystems = adapters.map(mapConnectedSystem)
  const availableIntegrations = adapters.map(mapAvailableIntegration)

  return {
    connectedSystems,
    availableIntegrations,
    syncJobs: buildSyncJobs(connectedSystems),
    activities: buildActivities(),
    logs: buildLogs(),
    touchpoints: buildTouchpoints(connectedSystems.length),
    developerTools: buildDeveloperTools(connectedSystems),
    selectedCategory: "all",
    developerMode: false,
  }
}