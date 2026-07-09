export type TestLayer =
  | "unit"
  | "integration"
  | "e2e"
  | "ai"
  | "performance"
  | "security"

export type TestPriority = "critical" | "high" | "medium" | "low"

export type TestStatus = "planned" | "ready" | "blocked" | "deprecated"

export type TestOwner = {
  team: string
  role: string
}

export type TestCaseDefinition = {
  id: string
  name: string
  description: string
  layer: TestLayer
  priority: TestPriority
  owner: TestOwner
  tags: string[]
  status: TestStatus
}

export type TestSuiteDefinition = {
  id: string
  name: string
  layer: TestLayer
  goal: string
  cases: TestCaseDefinition[]
}

export type FlakySignal = {
  testId: string
  failureRatePercent: number
  lastFailureAt: string
}

export type TestMetricsSnapshot = {
  generatedAt: string
  totalSuites: number
  totalCases: number
  successRatePercent: number
  regressionRatePercent: number
  averageDurationMs: number
  flakyTests: FlakySignal[]
}

export type QualityGateName =
  | "lint"
  | "typecheck"
  | "build"
  | "unit"
  | "integration"
  | "e2e"
  | "ai-evaluation"
  | "performance"
  | "security"

export type QualityGateDefinition = {
  name: QualityGateName
  required: boolean
  description: string
  threshold?: string
}

export type ScenarioStep = {
  id: string
  action: string
  expectedOutcome: string
}

export type WorkflowSimulationScenario = {
  id: string
  name: string
  description: string
  tenantScoped: boolean
  roleScoped: boolean
  seed: string
  steps: ScenarioStep[]
}

export type AIEvaluationDimension =
  | "prompt-regression"
  | "response-consistency"
  | "json-schema-validation"
  | "tool-selection-accuracy"
  | "reasoning-evaluation"
  | "hallucination-detection"
  | "grounding-check"
  | "response-latency"
  | "prompt-version-comparison"
  | "model-comparison"

export type AIEvaluationCase = {
  id: string
  title: string
  dimension: AIEvaluationDimension
  objective: string
  expectedSchema?: Record<string, unknown>
  threshold: string
}

export type ResilienceFaultType =
  | "provider-outage"
  | "slow-response"
  | "network-failure"
  | "database-failure"
  | "timeout"
  | "invalid-mcp-response"
  | "authentication-failure"
  | "rate-limit"
  | "memory-corruption"
  | "fallback-routing"

export type ResilienceScenario = {
  id: string
  name: string
  fault: ResilienceFaultType
  expectedFallback: string
  expectedRecovery: string
}

export type PerformanceBenchmarkMetric =
  | "render-time"
  | "hydration"
  | "memory-usage"
  | "api-latency"
  | "workflow-execution-time"
  | "agent-response-time"
  | "mcp-latency"
  | "knowledge-graph-query"
  | "model-routing-latency"

export type PerformanceBenchmarkDefinition = {
  id: string
  metric: PerformanceBenchmarkMetric
  goal: string
  warningThreshold: string
  criticalThreshold: string
}

export type SecurityValidationType =
  | "rbac"
  | "tenant-isolation"
  | "policy-enforcement"
  | "permission-escalation"
  | "secret-handling"
  | "audit-logging"
  | "session-validation"

export type SecurityValidationDefinition = {
  id: string
  type: SecurityValidationType
  description: string
  expectedControl: string
}
