"use client"

import { useMemo } from "react"
import { getSDKPlatform } from "@/src/sdk/core/sdk-singleton"

export function useSDKPlatform() {
  return useMemo(() => getSDKPlatform(), [])
}
