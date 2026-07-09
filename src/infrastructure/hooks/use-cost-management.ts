"use client"

import { useInfrastructureContext } from "@/src/infrastructure/contexts/infrastructure-context"

export function useCostManagement() {
  const { state, platform, refresh } = useInfrastructureContext()

  return {
    costPoints: state.monitoring.filter((point) => point.metric.startsWith("cost-")),
    summarizeCosts: platform.costs.summarize.bind(platform.costs),
    refresh,
  }
}
