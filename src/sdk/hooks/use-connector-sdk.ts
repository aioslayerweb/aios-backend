"use client"

import { useSDKPlatform } from "@/src/sdk/hooks/use-sdk-platform"

export function useConnectorSDK() {
  const platform = useSDKPlatform()

  return {
    connectors: platform.connectors.list(),
    registerConnector: platform.connectors.register.bind(platform.connectors),
  }
}
