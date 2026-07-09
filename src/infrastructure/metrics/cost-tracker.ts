import type { DeploymentEnvironment, MonitoringMetric, MonitoringPoint } from "@/src/infrastructure/types"

const costMetrics: MonitoringMetric[] = [
  "cost-model-usage",
  "cost-infrastructure-usage",
  "cost-storage",
  "cost-memory",
  "cost-database",
  "cost-mcp-traffic",
  "cost-workflow-execution",
  "cost-agent-execution",
]

export class CostTracker {
  private readonly points: MonitoringPoint[] = []

  record(point: MonitoringPoint): void {
    if (!costMetrics.includes(point.metric)) {
      return
    }
    this.points.push(point)
  }

  list(environment?: DeploymentEnvironment): MonitoringPoint[] {
    return environment ? this.points.filter((point) => point.environment === environment) : this.points
  }

  summarize(environment: DeploymentEnvironment): Record<MonitoringMetric, number> {
    const summary = Object.create(null) as Record<MonitoringMetric, number>
    for (const metric of costMetrics) {
      summary[metric] = 0
    }
    for (const point of this.list(environment)) {
      summary[point.metric] += point.value
    }
    return summary
  }
}
