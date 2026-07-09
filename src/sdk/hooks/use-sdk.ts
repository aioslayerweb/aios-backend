"use client"

import { useSDKPlatform } from "@/src/sdk/hooks/use-sdk-platform"

export function useSDK() {
  const platform = useSDKPlatform()
  return {
    platform,
    state: platform.snapshot(),
    refresh: () => platform.snapshot(),
  }
}
