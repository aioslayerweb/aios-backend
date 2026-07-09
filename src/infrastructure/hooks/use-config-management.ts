"use client"

import { useInfrastructureContext } from "@/src/infrastructure/contexts/infrastructure-context"

export function useConfigManagement() {
  const { state, platform, refresh } = useInfrastructureContext()

  return {
    runtimeConfigurations: state.runtimeConfigurations,
    configVersions: state.configVersions,
    getConfig: platform.config.getRuntimeConfig.bind(platform.config),
    setConfig: platform.config.setRuntimeConfig.bind(platform.config),
    validateConfig: platform.config.validate.bind(platform.config),
    refresh,
  }
}
