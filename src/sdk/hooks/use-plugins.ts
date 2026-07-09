"use client"

import { useSDKPlatform } from "@/src/sdk/hooks/use-sdk-platform"

export function usePlugins() {
  const platform = useSDKPlatform()

  return {
    plugins: platform.plugins.list(),
    signedPlugins: platform.plugins.listSignedOnly(),
    extensions: platform.extensions.list(),
    registerPlugin: platform.plugins.register.bind(platform.plugins),
    registerExtension: platform.extensions.register.bind(platform.extensions),
  }
}
