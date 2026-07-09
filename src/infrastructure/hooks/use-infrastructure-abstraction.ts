"use client"

import { useInfrastructureContext } from "@/src/infrastructure/contexts/infrastructure-context"

export function useInfrastructureAbstraction() {
  const { state, platform, refresh } = useInfrastructureContext()

  return {
    adapters: state.adapters,
    listAdapters: platform.adapters.list.bind(platform.adapters),
    enableAdapter: platform.adapters.enable.bind(platform.adapters),
    refresh,
  }
}
