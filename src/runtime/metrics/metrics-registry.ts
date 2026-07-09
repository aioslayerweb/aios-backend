import type { RuntimeMetricName, RuntimeMetricPoint } from "@/src/runtime/types"

export class MetricsRegistry {
  private readonly points: RuntimeMetricPoint[] = []

  record(point: RuntimeMetricPoint): void {
    this.points.push(point)
  }

  increment(name: RuntimeMetricName, tenantId: string, amount = 1, unit = "count", labels?: Record<string, string>): void {
    this.points.push({
      name,
      tenantId,
      value: amount,
      unit,
      timestamp: new Date().toISOString(),
      labels,
    })
  }

  queryByTenant(tenantId: string): RuntimeMetricPoint[] {
    return this.points.filter((point) => point.tenantId === tenantId)
  }

  latestByTenant(tenantId: string, limit = 200): RuntimeMetricPoint[] {
    return this.queryByTenant(tenantId).slice(-Math.max(1, limit))
  }
}
