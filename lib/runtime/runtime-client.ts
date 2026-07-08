const DEFAULT_RUNTIME_API_BASE =
  process.env.NEXT_PUBLIC_RUNTIME_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:3001"

type CacheEntry = {
  expiresAt: number
  value: unknown
}

const responseCache = new Map<string, CacheEntry>()

export type RuntimeRequestOptions = RequestInit & {
  cacheKey?: string
  ttlMs?: number
  retries?: number
  retryDelayMs?: number
}

export function getRuntimeApiBase(): string {
  return DEFAULT_RUNTIME_API_BASE.replace(/\/$/, "")
}

export function clearRuntimeCache(prefix?: string): void {
  if (!prefix) {
    responseCache.clear()
    return
  }

  for (const key of Array.from(responseCache.keys())) {
    if (key.startsWith(prefix)) {
      responseCache.delete(key)
    }
  }
}

function buildCacheKey(pathname: string, options: RuntimeRequestOptions): string {
  const body = typeof options.body === "string" ? options.body : ""
  const method = options.method ?? "GET"
  return `${pathname}::${method}::${body}`
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

export async function runtimeFetchJson<T>(pathname: string, options: RuntimeRequestOptions = {}): Promise<T> {
  const method = options.method ?? "GET"
  const ttlMs = options.ttlMs ?? 15_000
  const retries = options.retries ?? 1
  const retryDelayMs = options.retryDelayMs ?? 250
  const cacheKey = options.cacheKey ?? buildCacheKey(pathname, options)
  const now = Date.now()

  if (method === "GET") {
    const cached = responseCache.get(cacheKey)
    if (cached && cached.expiresAt > now) {
      return cached.value as T
    }
  }

  const url = `${getRuntimeApiBase()}${pathname.startsWith("/") ? pathname : `/${pathname}`}`

  let lastError: unknown = null

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...options,
        method,
        cache: "no-store",
        headers: {
          "content-type": "application/json",
          ...(options.headers ?? {}),
        },
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const data = (await response.json()) as T

      if (method === "GET") {
        responseCache.set(cacheKey, {
          expiresAt: now + ttlMs,
          value: data,
        })
      }

      return data
    } catch (error) {
      lastError = error
      if (attempt < retries) {
        await sleep(retryDelayMs * (attempt + 1))
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Runtime request failed")
}
