"use client"

import { useInfrastructureContext } from "@/src/infrastructure/contexts/infrastructure-context"

export function useMonitoringOperations() {
  const { state, platform, refresh } = useInfrastructureContext()

  return {
    monitoringPoints: state.monitoring,
    alerts: state.alerts,
    recordMonitoringPoint: platform.monitoring.record.bind(platform.monitoring),
    listByMetric: platform.monitoring.byMetric.bind(platform.monitoring),
    listAlerts: platform.monitoring.listAlerts.bind(platform.monitoring),
    refresh,
  }
}
