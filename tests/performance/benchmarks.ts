import type { PerformanceBenchmarkDefinition } from "@/tests/shared"

export const performanceBenchmarks: PerformanceBenchmarkDefinition[] = [
  {
    id: "perf-render-home",
    metric: "render-time",
    goal: "Initial executive workspace render remains responsive.",
    warningThreshold: "p95 <= 1800ms",
    criticalThreshold: "p95 <= 2500ms",
  },
  {
    id: "perf-hydration-app",
    metric: "hydration",
    goal: "Hydration completes without severe blocking.",
    warningThreshold: "p95 <= 1000ms",
    criticalThreshold: "p95 <= 1600ms",
  },
  {
    id: "perf-api-latency",
    metric: "api-latency",
    goal: "Frontend API integrations remain under enterprise SLO.",
    warningThreshold: "p95 <= 700ms",
    criticalThreshold: "p95 <= 1100ms",
  },
  {
    id: "perf-workflow-exec",
    metric: "workflow-execution-time",
    goal: "Autonomous workflow orchestration remains timely.",
    warningThreshold: "p95 <= 2200ms",
    criticalThreshold: "p95 <= 3000ms",
  },
  {
    id: "perf-agent-response",
    metric: "agent-response-time",
    goal: "Role-aware agent response remains predictable.",
    warningThreshold: "p95 <= 2100ms",
    criticalThreshold: "p95 <= 2800ms",
  },
  {
    id: "perf-mcp-latency",
    metric: "mcp-latency",
    goal: "MCP gateway routing and execution remain reliable.",
    warningThreshold: "p95 <= 900ms",
    criticalThreshold: "p95 <= 1400ms",
  },
  {
    id: "perf-model-routing",
    metric: "model-routing-latency",
    goal: "Provider/model selection overhead stays minimal.",
    warningThreshold: "p95 <= 250ms",
    criticalThreshold: "p95 <= 450ms",
  },
]
