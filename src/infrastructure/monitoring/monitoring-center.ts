import type {
  AlertDefinition,
  AlertSeverity,
  DeploymentEnvironment,
  MonitoringMetric,
  MonitoringPoint,
} from "@/src/infrastructure/types"

export class MonitoringCenter {
  private readonly points: MonitoringPoint[] = []
  private readonly alerts = new Map<string, AlertDefinition>()

  record(point: MonitoringPoint): void {
    this.points.push(point)
  }

  list(environment?: DeploymentEnvironment): MonitoringPoint[] {
    return environment ? this.points.filter((point) => point.environment === environment) : this.points
  }

  byMetric(metric: MonitoringMetric, environment?: DeploymentEnvironment): MonitoringPoint[] {
    return this.list(environment).filter((point) => point.metric === metric)
  }

  registerAlert(alert: AlertDefinition): void {
    this.alerts.set(alert.id, alert)
  }

  listAlerts(severity?: AlertSeverity): AlertDefinition[] {
    const all = Array.from(this.alerts.values())
    return severity ? all.filter((alert) => alert.severity === severity) : all
  }
}
