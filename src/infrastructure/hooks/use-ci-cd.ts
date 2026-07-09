"use client"

import { useInfrastructureContext } from "@/src/infrastructure/contexts/infrastructure-context"

export function useCiCd() {
  const { state, platform, refresh } = useInfrastructureContext()

  return {
    pipelines: state.pipelines,
    listPipelines: platform.ci.listPipelines.bind(platform.ci),
    hasPipelineStage: platform.ci.hasStage.bind(platform.ci),
    refresh,
  }
}
