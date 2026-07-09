import {
  buildTestMetricsSnapshot,
  qualityGateDefinitions,
  type TestExecutionRecord,
} from "@/tests/shared"

export type QualityHarnessResult = {
  gates: typeof qualityGateDefinitions
  metrics: ReturnType<typeof buildTestMetricsSnapshot>
}

export function runQualityHarness(executions: TestExecutionRecord[]): QualityHarnessResult {
  return {
    gates: qualityGateDefinitions,
    metrics: buildTestMetricsSnapshot(executions),
  }
}
