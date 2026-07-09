"use client"

import { useSDKPlatform } from "@/src/sdk/hooks/use-sdk-platform"

export function useExtensions() {
  const platform = useSDKPlatform()

  return {
    extensions: platform.extensions.list(),
    uiExtensions: platform.uiExtensions.list(),
    registerExtension: platform.extensions.register.bind(platform.extensions),
    enableExtension: platform.extensions.enable.bind(platform.extensions),
    registerUIExtension: platform.uiExtensions.register.bind(platform.uiExtensions),
  }
}
