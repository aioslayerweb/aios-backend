"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import { useIntegrationContext } from "@/contexts/integration-context"
import { useRoleContext } from "@/hooks/use-role-context"
import { useSecurityContext } from "@/contexts/security-context"
import { createMCPConnectionManager } from "@/src/mcp/connections/connection-manager"
import { createMCPGatewayDefinition, executeGatewayPlan } from "@/src/mcp/gateway/pipeline"
import { createMCPHealthSnapshot } from "@/src/mcp/health/health-center"
import { createMCPMetricsSnapshot } from "@/src/mcp/metrics/metrics-center"
import { createMCPPromptRegistry } from "@/src/mcp/prompts/prompt-registry"
import { createMCPRegistryState } from "@/src/mcp/registry/mcp-registry"
import { createMCPResourceRegistry } from "@/src/mcp/resources/resource-registry"
import { createDefaultMCPPolicyRules, evaluateMCPPolicies } from "@/src/mcp/security/policy-engine"
import { createMCPServerExports } from "@/src/mcp/server/capability-catalog"
import { createMCPToolRegistry } from "@/src/mcp/tools/tool-registry"
import type {
  MCPExecutionEvent,
  MCPGatewayRequest,
  MCPGatewayResponse,
  MCPPlatformState,
  MCPPolicyDecision,
  MCPTraceEvent,
} from "@/src/mcp/types"

type MCPPlatformContextValue = MCPPlatformState & {
  executeRequest: (request: Omit<MCPGatewayRequest, "id" | "timestamp">) => { response: MCPGatewayResponse; decision: MCPPolicyDecision }
  traces: MCPTraceEvent[]
}

const MCPPlatformContext = createContext<MCPPlatformContextValue | null>(null)

export function MCPPlatformProvider({ children }: { children: ReactNode }) {
  const integrations = useIntegrationContext()
  const security = useSecurityContext()
  const roleContext = useRoleContext()

  const [events, setEvents] = useState<MCPExecutionEvent[]>([])
  const [traces, setTraces] = useState<MCPTraceEvent[]>([])

  const serverConnections = useMemo(
    () =>
      createMCPConnectionManager({
        connectedSystems: integrations.connectedSystems,
        organizationIds: security.organizations.map((organization) => organization.id),
        workspaceIds: security.workspaces.map((workspace) => workspace.id),
      }),
    [integrations.connectedSystems, security.organizations, security.workspaces]
  )

  const tools = useMemo(() => createMCPToolRegistry(serverConnections), [serverConnections])
  const resources = useMemo(() => createMCPResourceRegistry(serverConnections), [serverConnections])
  const prompts = useMemo(() => createMCPPromptRegistry(serverConnections), [serverConnections])
  const registry = useMemo(() => createMCPRegistryState({ servers: serverConnections, tools, resources, prompts }), [prompts, resources, serverConnections, tools])
  const policyRules = useMemo(() => createDefaultMCPPolicyRules(), [])
  const gateway = useMemo(() => createMCPGatewayDefinition(), [])
  const serverExports = useMemo(() => createMCPServerExports(), [])
  const health = useMemo(() => createMCPHealthSnapshot(serverConnections), [serverConnections])
  const metrics = useMemo(() => createMCPMetricsSnapshot({ servers: serverConnections, events }), [events, serverConnections])

  const executeRequest = useCallback(
    (request: Omit<MCPGatewayRequest, "id" | "timestamp">) => {
      const runtimeRequest: MCPGatewayRequest = {
        ...request,
        id: `mcp-req-${Date.now()}`,
        timestamp: new Date().toISOString(),
      }

      const decision = evaluateMCPPolicies({
        requestId: runtimeRequest.id,
        role: roleContext.role,
        permissions: roleContext.permissions.map((permission) => permission.key),
        department: roleContext.authenticatedIdentity.user?.department ?? "cross-functional",
        provider: (runtimeRequest.input.provider as never) ?? "custom",
        rules: policyRules,
      })

      const { response, traces: executionTraces } = executeGatewayPlan({
        request: runtimeRequest,
        providers: serverConnections.slice(0, 2).map((server) => server.provider),
        allow: decision.effect === "allow",
      })

      const event: MCPExecutionEvent = {
        id: `mcp-event-${Date.now()}`,
        requestId: runtimeRequest.id,
        status: response.status,
        startedAt: runtimeRequest.timestamp,
        finishedAt: new Date().toISOString(),
        durationMs: response.durationMs,
        inputs: runtimeRequest.input,
        outputs: response.output,
        errors: response.status === "success" ? [] : [decision.reason],
        agent: "MCP Gateway",
        workflow: "mcp-request-orchestration",
        userId: runtimeRequest.actorUserId,
        organizationId: runtimeRequest.organizationId,
        workspaceId: runtimeRequest.workspaceId,
        toolId: runtimeRequest.toolId,
        provider: serverConnections[0]?.provider ?? "custom",
      }

      setEvents((previous) => [event, ...previous].slice(0, 120))
      setTraces((previous) => [...executionTraces, ...previous].slice(0, 320))

      return { response, decision }
    },
    [policyRules, roleContext.authenticatedIdentity.user?.department, roleContext.permissions, roleContext.role, serverConnections]
  )

  const value = useMemo<MCPPlatformContextValue>(
    () => ({
      platformModes: ["host", "server", "gateway", "registry"],
      host: {
        mode: "host",
        servers: serverConnections,
        activeServerIds: serverConnections.filter((server) => server.status === "connected").map((server) => server.id),
        supportsFutureServers: true,
      },
      server: {
        mode: "server",
        serviceName: "AIOS MCP Server",
        version: "1.0.0",
        exports: serverExports,
      },
      gateway,
      registry,
      policyRules,
      health,
      metrics,
      observability: {
        traces,
        logs: traces.map((trace) => ({
          id: `mcp-log-${trace.id}`,
          level: "info",
          message: `Gateway stage ${trace.stage} executed.`,
          requestId: trace.requestId,
          timestamp: trace.timestamp,
          metadata: trace.metadata,
        })),
        metrics,
        executionGraphNodes: gateway.pipeline.map((stage) => ({ id: `node-${stage}`, label: stage, stage })),
        executionGraphEdges: gateway.pipeline.slice(1).map((stage, index) => ({ from: `node-${gateway.pipeline[index]}`, to: `node-${stage}` })),
      },
      executionEvents: events,
      executeRequest,
      traces,
    }),
    [events, executeRequest, gateway, health, metrics, policyRules, registry, serverConnections, serverExports, traces]
  )

  return <MCPPlatformContext.Provider value={value}>{children}</MCPPlatformContext.Provider>
}

export function useMCPPlatformContext() {
  const context = useContext(MCPPlatformContext)
  if (!context) {
    throw new Error("useMCPPlatformContext must be used within MCPPlatformProvider")
  }

  return context
}
