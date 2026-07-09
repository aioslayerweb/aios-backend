import type { HealthCheckResult, HealthStatus } from "@/src/runtime/types"

export class HealthMonitor {
  private readonly checks = new Map<string, HealthCheckResult>()

  updateCheck(check: HealthCheckResult): void {
    this.checks.set(this.composeKey(check.tenantId, check.id), check)
  }

  evaluate(tenantId: string): HealthStatus {
    const tenantChecks = this.listByTenant(tenantId)
    if (tenantChecks.length === 0) {
      return "degraded"
    }
    if (tenantChecks.some((check) => check.status === "unhealthy")) {
      return "unhealthy"
    }
    if (tenantChecks.some((check) => check.status === "degraded")) {
      return "degraded"
    }
    return "healthy"
  }

  listByTenant(tenantId: string): HealthCheckResult[] {
    return Array.from(this.checks.values()).filter((check) => check.tenantId === tenantId)
  }

  private composeKey(tenantId: string, id: string): string {
    return `${tenantId}:${id}`
  }
}
