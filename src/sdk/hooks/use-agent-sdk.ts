"use client"

import { useSDKPlatform } from "@/src/sdk/hooks/use-sdk-platform"

export function useAgentSDK() {
  const platform = useSDKPlatform()

  return {
    agents: platform.agents.list(),
    registerAgent: platform.agents.register.bind(platform.agents),
  }
}
