"use client"

import { useInfrastructureContext } from "@/src/infrastructure/contexts/infrastructure-context"

export function useDeployment() {
  const { state, platform, refresh } = useInfrastructureContext()

  return {
    deployments: state.deployments,
    listTargets: platform.deployment.listTargets.bind(platform.deployment),
    activateTarget: platform.deployment.activateTarget.bind(platform.deployment),
    refresh,
  }
}
