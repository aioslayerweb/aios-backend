import type { AlertDefinition, ObservabilitySnapshot, StructuredLogRecord, TraceSpan } from "@/src/runtime/types"

export class ObservabilityCenter {
  private readonly logs: StructuredLogRecord[] = []
  private readonly spans = new Map<string, TraceSpan>()
  private readonly alerts = new Map<string, AlertDefinition>()

  log(record: StructuredLogRecord): void {
    this.logs.push(record)
  }

  startSpan(span: TraceSpan): void {
    this.spans.set(span.spanId, span)
  }

  endSpan(spanId: string, status: "ok" | "error"): void {
    const span = this.spans.get(spanId)
    if (!span) {
      return
    }

    this.spans.set(spanId, {
      ...span,
      endedAt: new Date().toISOString(),
      status,
    })
  }

  registerAlert(alert: AlertDefinition): void {
    this.alerts.set(alert.id, alert)
  }

  listLogs(tenantId?: string, limit = 200): StructuredLogRecord[] {
    const filtered = tenantId ? this.logs.filter((log) => log.tenantId === tenantId) : this.logs
    return filtered.slice(-Math.max(1, limit))
  }

  listTraces(limit = 200): TraceSpan[] {
    return Array.from(this.spans.values()).slice(-Math.max(1, limit))
  }

  snapshot(): ObservabilitySnapshot {
    const logsPerMinute = this.logs.length
    const tracesPerMinute = this.spans.size
    const openAlerts = this.alerts.size
    const correlatedLogs = this.logs.filter((log) => Boolean(log.correlationId)).length
    const correlationCoveragePercent = this.logs.length === 0 ? 100 : Number(((correlatedLogs / this.logs.length) * 100).toFixed(2))

    return {
      logsPerMinute,
      tracesPerMinute,
      openAlerts,
      correlationCoveragePercent,
    }
  }
}
