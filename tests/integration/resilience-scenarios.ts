import type { ResilienceScenario } from "@/tests/shared"

export const resilienceScenarios: ResilienceScenario[] = [
  {
    id: "res-provider-outage",
    name: "Provider outage fallback",
    fault: "provider-outage",
    expectedFallback: "Route request to alternate approved provider.",
    expectedRecovery: "Resume preferred provider after health restored.",
  },
  {
    id: "res-timeout",
    name: "Execution timeout handling",
    fault: "timeout",
    expectedFallback: "Trigger timeout-safe fallback with partial response guidance.",
    expectedRecovery: "Replay pending action when dependency recovers.",
  },
  {
    id: "res-invalid-mcp",
    name: "Invalid MCP response",
    fault: "invalid-mcp-response",
    expectedFallback: "Reject malformed payload and provide controlled error.",
    expectedRecovery: "Retry with sanitized request and structured diagnostics.",
  },
  {
    id: "res-auth-failure",
    name: "Authentication failure",
    fault: "authentication-failure",
    expectedFallback: "Block action and request re-authentication pathway.",
    expectedRecovery: "Allow action only after validated session renewal.",
  },
  {
    id: "res-rate-limit",
    name: "Rate limit recovery",
    fault: "rate-limit",
    expectedFallback: "Apply backoff and queue deferred execution.",
    expectedRecovery: "Drain queue once capacity returns.",
  },
  {
    id: "res-memory-corruption",
    name: "Memory corruption defense",
    fault: "memory-corruption",
    expectedFallback: "Quarantine suspect memory segment and switch to last known good snapshot.",
    expectedRecovery: "Run integrity repair and rehydrate context.",
  },
]
