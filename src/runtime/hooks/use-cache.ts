"use client"

import { useRuntimePlatformContext } from "@/src/runtime/contexts/runtime-platform-context"

export function useCache() {
  const { state, runtimePlatform, tenantId, refresh } = useRuntimePlatformContext()

  return {
    cache: state.cache,
    setCache: runtimePlatform.cache.set.bind(runtimePlatform.cache),
    getCache: runtimePlatform.cache.get.bind(runtimePlatform.cache),
    invalidateCache: runtimePlatform.cache.invalidate.bind(runtimePlatform.cache),
    invalidateCacheByTag: runtimePlatform.cache.invalidateByTag.bind(runtimePlatform.cache),
    tenantId,
    refresh,
  }
}
