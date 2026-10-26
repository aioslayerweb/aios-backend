const DEFAULT_RUNTIME_API_BASE =
  process.env.NEXT_PUBLIC_RUNTIME_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:3001"

export type RuntimeRequestOptions = RequestInit & {
  retries?: number
  retryDelayMs?: number
}

export class RuntimeRequestError extends Error {
  constructor(readonly status: number) {
    super(`Runtime request failed with status ${status}`)
    this.name = "RuntimeRequestError"
  }
}

export function getRuntimeApiBase(): string {
  return DEFAULT_RUNTIME_API_BASE.replace(/\/$/, "")
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

export async function runtimeFetchJson<T>(pathname: string, options: RuntimeRequestOptions = {}): Promise<T> {
  const {
    retries = 1,
    retryDelayMs = 250,
    ...requestOptions
  } = options
  const method = requestOptions.method ?? "GET"
  const url = `${getRuntimeApiBase()}${pathname.startsWith("/") ? pathname : `/${pathname}`}`
  const headers = new Headers(requestOptions.headers)
  if (!headers.has("content-type")) {
    headers.set("content-type", "application/json")
  }

  let lastError: unknown = null

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...requestOptions,
        method,
        cache: "no-store",
        headers,
      })

      if (!response.ok) {
        throw new RuntimeRequestError(response.status)
      }

      return (await response.json()) as T
    } catch (error) {
      if (requestOptions.signal?.aborted) {
        throw error
      }
      lastError = error
      if (attempt < retries) {
        await sleep(retryDelayMs * (attempt + 1))
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Runtime request failed")
}
