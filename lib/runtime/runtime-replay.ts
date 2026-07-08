import { runtimeFetchJson } from "./runtime-client"
import type { RuntimeDebugResponse, RuntimeReplayResponse } from "./runtime-types"

export async function fetchRuntimeReplay(contextId: string) {
  const response = await runtimeFetchJson<RuntimeReplayResponse>(`/aios/replay/${encodeURIComponent(contextId)}`, {
    ttlMs: 7_500,
    cacheKey: `runtime-replay:${contextId}`,
    retries: 1,
  })

  return response.timeline ?? []
}

export async function fetchRuntimeDebug(contextId: string): Promise<RuntimeDebugResponse | null> {
  try {
    return await runtimeFetchJson<RuntimeDebugResponse>(`/aios/debug/${encodeURIComponent(contextId)}`, {
      ttlMs: 7_500,
      cacheKey: `runtime-debug:${contextId}`,
      retries: 1,
    })
  } catch {
    return null
  }
}
