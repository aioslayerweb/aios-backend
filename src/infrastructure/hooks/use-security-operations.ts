"use client"

import { useInfrastructureContext } from "@/src/infrastructure/contexts/infrastructure-context"

export function useSecurityOperations() {
  const { state, platform, refresh } = useInfrastructureContext()

  return {
    securityOperations: state.securityOperations,
    listSecurityOperations: platform.security.list.bind(platform.security),
    latestDependencyAudit: platform.security.latestByType("dependency-audit"),
    refresh,
  }
}
