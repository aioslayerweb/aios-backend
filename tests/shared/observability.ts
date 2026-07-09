import type { TestMetricsSnapshot } from "@/tests/shared/types"

export type TestExecutionRecord = {
  id: string
  suiteId: string
  startedAt: string
  finishedAt: string
  durationMs: number
  passed: boolean
  flaky: boolean
  tags: string[]
}

export function buildTestMetricsSnapshot(executions: TestExecutionRecord[]): TestMetricsSnapshot {
  const totalCases = executions.length
  const passed = executions.filter((record) => record.passed).length
  const failed = totalCases - passed
  const successRatePercent = totalCases === 0 ? 100 : Number(((passed / totalCases) * 100).toFixed(2))
  const regressionRatePercent = totalCases === 0 ? 0 : Number(((failed / totalCases) * 100).toFixed(2))
  const averageDurationMs = totalCases === 0 ? 0 : Math.round(executions.reduce((sum, record) => sum + record.durationMs, 0) / totalCases)

  const flaky = executions
    .filter((record) => record.flaky)
    .map((record) => ({
      testId: record.id,
      failureRatePercent: record.passed ? 10 : 60,
      lastFailureAt: record.finishedAt,
    }))

  const suiteCount = new Set(executions.map((record) => record.suiteId)).size

  return {
    generatedAt: new Date().toISOString(),
    totalSuites: suiteCount,
    totalCases,
    successRatePercent,
    regressionRatePercent,
    averageDurationMs,
    flakyTests: flaky,
  }
}
