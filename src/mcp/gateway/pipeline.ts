import type {
  MCPGatewayDefinition,
  MCPGatewayRequest,
  MCPGatewayResponse,
  MCPGatewayResponsibility,
  MCPGatewayPipelineStage,
  MCPProviderId,
  MCPTraceEvent,
} from "@/src/mcp/types"

export const mcpGatewayPipeline: MCPGatewayPipelineStage[] = [
  "authentication",
  "tenant-resolution",
  "rbac",
  "role-context",
  "organization-context",
  "knowledge-graph",
  "memory",
  "decision-engine",
  "workflow-engine",
  "tool-selection",
  "external-mcp-servers",
  "response-aggregation",
  "audit",
  "response",
]

export const mcpGatewayResponsibilities: MCPGatewayResponsibility[] = [
  "tool-routing",
  "request-enrichment",
  "response-normalization",
  "policy-enforcement",
  "prompt-augmentation",
  "caching",
  "observability",
  "retry-handling",
  "circuit-breakers",
]

export function createMCPGatewayDefinition(): MCPGatewayDefinition {
  return {
    mode: "gateway",
    pipeline: mcpGatewayPipeline,
    responsibilities: mcpGatewayResponsibilities,
    retryPolicy: {
      maxRetries: 2,
      backoffMs: 250,
    },
    circuitBreaker: {
      failureThreshold: 5,
      resetTimeoutMs: 5000,
    },
    cache: {
      enabled: true,
      ttlMs: 30000,
    },
  }
}

export function executeGatewayPlan(input: {
  request: MCPGatewayRequest
  providers: MCPProviderId[]
  allow: boolean
}): { response: MCPGatewayResponse; traces: MCPTraceEvent[] } {
  const started = Date.now()
  const traces: MCPTraceEvent[] = mcpGatewayPipeline.map((stage, index) => ({
    id: `${input.request.id}-${stage}`,
    requestId: input.request.id,
    stage,
    timestamp: new Date(Date.now() + index).toISOString(),
    durationMs: stage === "external-mcp-servers" ? 45 : 8,
    metadata: {
      stage,
      requestId: input.request.id,
    },
  }))

  const status = input.allow ? "success" : "blocked"
  const duration = Date.now() - started + 60

  const response: MCPGatewayResponse = {
    requestId: input.request.id,
    status,
    durationMs: duration,
    providerCalls: input.providers.map((provider) => ({
      provider,
      latencyMs: 45,
      status: input.allow ? "success" : "blocked",
    })),
    output: {
      normalizedResponse: input.allow,
      requestEcho: input.request.input,
    },
    normalized: true,
    audited: true,
  }

  return { response, traces }
}
