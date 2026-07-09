import type { QualityGateDefinition } from "@/tests/shared/types"

export const qualityGateDefinitions: QualityGateDefinition[] = [
  {
    name: "lint",
    required: true,
    description: "Static lint validation for frontend and platform code.",
  },
  {
    name: "typecheck",
    required: true,
    description: "TypeScript type safety across shared, domain, and platform modules.",
  },
  {
    name: "build",
    required: true,
    description: "Production build verification for app routes and providers.",
  },
  {
    name: "unit",
    required: true,
    description: "Unit-level correctness for utilities, hooks, contexts, policy, and orchestration logic.",
    threshold: ">= 85% changed-lines coverage",
  },
  {
    name: "integration",
    required: true,
    description: "Cross-module contract validation for platform adapters and AIOS engines.",
    threshold: "All critical integration suites passing",
  },
  {
    name: "e2e",
    required: true,
    description: "User-journey validation across core enterprise workspaces.",
    threshold: "Critical user journeys pass on default profile",
  },
  {
    name: "ai-evaluation",
    required: true,
    description: "AI behavior checks for regression, grounding, consistency, and tool routing quality.",
    threshold: "No critical AI evaluation regressions",
  },
  {
    name: "performance",
    required: true,
    description: "Latency and runtime quality benchmarks for UI, workflows, MCP, and model routing.",
    threshold: "No critical threshold violations",
  },
  {
    name: "security",
    required: true,
    description: "Automated security validation for RBAC, isolation, policy controls, and audit guarantees.",
    threshold: "All required controls validated",
  },
]
