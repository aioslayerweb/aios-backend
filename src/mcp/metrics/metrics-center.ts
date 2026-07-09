import type { MCPExecutionEvent, MCPMetricsSnapshot, MCPServerConnection } from "@/src/mcp/types"

export function createMCPMetricsSnapshot(input: {
  servers: MCPServerConnection[]
  events: MCPExecutionEvent[]
}): MCPMetricsSnapshot {
  const requestCount = input.events.length
  const successCount = input.events.filter((event) => event.status === "success").length
  const successRatePercent = requestCount === 0 ? 100 : Math.round((successCount / requestCount) * 100)
  const averageLatencyMs = requestCount === 0 ? 0 : Math.round(input.events.reduce((sum, event) => sum + event.durationMs, 0) / requestCount)

  const toolInvocationCounts: Record<string, number> = {}
  const providerInvocationCounts: Record<string, number> = {}
  const errorCounts: Record<string, number> = {}

  for (const event of input.events) {
    if (event.toolId) {
      toolInvocationCounts[event.toolId] = (toolInvocationCounts[event.toolId] ?? 0) + 1
    }

    providerInvocationCounts[event.provider] = (providerInvocationCounts[event.provider] ?? 0) + 1

    for (const error of event.errors) {
      errorCounts[error] = (errorCounts[error] ?? 0) + 1
    }
  }

  const providerCostEstimate = input.servers.reduce((sum, server) => sum + (server.health.latencyMs > 0 ? 0.002 : 0), 0) * Math.max(requestCount, 1)

  return {
    requestCount,
    successRatePercent,
    averageLatencyMs,
    providerCostEstimate: Number(providerCostEstimate.toFixed(4)),
    toolInvocationCounts,
    providerInvocationCounts,
    errorCounts,
  }
}
