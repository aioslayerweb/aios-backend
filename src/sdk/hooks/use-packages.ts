"use client"

import { useSDKPlatform } from "@/src/sdk/hooks/use-sdk-platform"

export function usePackages() {
  const platform = useSDKPlatform()

  return {
    packages: platform.packages.list(),
    registerPackage: platform.packages.register.bind(platform.packages),
  }
}
