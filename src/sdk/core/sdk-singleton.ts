import { SDKPlatform } from "@/src/sdk/core/sdk-platform"

let sdkPlatformSingleton: SDKPlatform | null = null

export function getSDKPlatform(): SDKPlatform {
  if (!sdkPlatformSingleton) {
    sdkPlatformSingleton = new SDKPlatform()
  }
  return sdkPlatformSingleton
}
