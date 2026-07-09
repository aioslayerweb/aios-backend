"use client"

import { useInfrastructureContext } from "@/src/infrastructure/contexts/infrastructure-context"

export function useSecretsManagement() {
  const { state, platform, refresh } = useInfrastructureContext()

  return {
    secretReferences: state.secrets,
    listSecrets: platform.secrets.list.bind(platform.secrets),
    rotateSecret: platform.secrets.rotate.bind(platform.secrets),
    refresh,
  }
}
