import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import { resolve } from "node:path"
import { loadRuntimeReplayContext } from "../../lib/runtime"
import { fetchRuntimeBusinessMetrics, fetchRuntimeMemoryUpdates } from "../../lib/runtime/runtime-memory"
import { fetchRuntimeTimeline, pollRuntimeTimeline } from "../../lib/runtime/runtime-events"
import { RuntimeRequestError, runtimeFetchJson } from "../../lib/runtime/runtime-client"

test("runtime responses are fetched for each request instead of sharing a global cache", async () => {
  const originalFetch = globalThis.fetch
  const requestMarkers: string[] = []

  globalThis.fetch = async (_input, init) => {
    const requestMarker = new Headers(init?.headers).get("x-test-request")
    assert.ok(requestMarker)
    requestMarkers.push(requestMarker)

    return new Response(JSON.stringify({ marker: requestMarker }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const requestA = await runtimeFetchJson<{ marker: string }>("/aios/timeline", {
      retries: 0,
      headers: { "X-Test-Request": "request-a" },
    })
    const requestB = await runtimeFetchJson<{ marker: string }>("/aios/timeline", {
      retries: 0,
      headers: { "X-Test-Request": "request-b" },
    })

    assert.equal(requestA.marker, "request-a")
    assert.equal(requestB.marker, "request-b")
    assert.deepEqual(requestMarkers, [
      "request-a",
      "request-b",
    ])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test("runtime authorization failures remain distinguishable from other HTTP errors", async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ error: "synthetic failure" }), { status: 403 })

  try {
    await assert.rejects(
      runtimeFetchJson("/aios/debug/synthetic-context", { retries: 0 }),
      (error: unknown) => error instanceof RuntimeRequestError && error.status === 403,
    )
  } finally {
    globalThis.fetch = originalFetch
  }
})

test("runtime memory and metrics do not fall back to unscoped browser database queries", async () => {
  const originalFetch = globalThis.fetch
  const requestedPaths: string[] = []
  globalThis.fetch = async (input) => {
    requestedPaths.push(new URL(String(input)).pathname)
    return new Response(JSON.stringify({ error: "runtime access unavailable" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    await assert.rejects(fetchRuntimeMemoryUpdates(), (error: unknown) =>
      error instanceof RuntimeRequestError && error.status === 503,
    )
    await assert.rejects(fetchRuntimeBusinessMetrics(), (error: unknown) =>
      error instanceof RuntimeRequestError && error.status === 503,
    )
    assert.deepEqual(requestedPaths, [
      "/aios/timeline",
      "/aios/timeline",
      "/aios/timeline",
      "/aios/timeline",
    ])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test("malformed successful runtime responses are rejected rather than normalized to empty data", async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ error: "synthetic authorization failure" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })

  try {
    await assert.rejects(
      fetchRuntimeTimeline(),
      /invalid timeline response/,
    )
  } finally {
    globalThis.fetch = originalFetch
  }
})

test("empty context replay never falls back to the unscoped global timeline", async () => {
  const originalFetch = globalThis.fetch
  const requestedPaths: string[] = []

  globalThis.fetch = async (input) => {
    requestedPaths.push(new URL(String(input)).pathname)
    return new Response(JSON.stringify({ timeline: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    assert.deepEqual(await loadRuntimeReplayContext("synthetic-context-a"), [])
    assert.deepEqual(requestedPaths, ["/aios/replay/synthetic-context-a"])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test("disposing runtime polling aborts in-flight fetches and suppresses stale callbacks", async () => {
  const originalFetch = globalThis.fetch
  let requestStarted!: () => void
  const request = { signal: null as AbortSignal | null }
  const started = new Promise<void>((resolve) => {
    requestStarted = resolve
  })
  const updates: unknown[] = []
  const errors: unknown[] = []

  globalThis.fetch = (_input, init) =>
    new Promise<Response>((_resolve, reject) => {
      request.signal = init?.signal ?? null
      requestStarted()
      request.signal?.addEventListener("abort", () => {
        reject(new DOMException("Aborted", "AbortError"))
      })
    })

  try {
    const dispose = pollRuntimeTimeline(
      (events) => updates.push(events),
      (error) => errors.push(error),
      60_000,
    )

    await started
    dispose()
    await new Promise<void>((resolve) => setImmediate(resolve))

    assert.equal(request.signal?.aborted, true)
    assert.deepEqual(updates, [])
    assert.deepEqual(errors, [])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test("HTTP snapshot availability does not advertise a live WebSocket connection", () => {
  const liveContext = readFileSync(
    resolve(process.cwd(), "contexts/runtime-live-context.tsx"),
    "utf8",
  )
  const statusContext = readFileSync(
    resolve(process.cwd(), "contexts/runtime-status-context.tsx"),
    "utf8",
  )

  assert.doesNotMatch(liveContext, /setWebsocketState/)
  assert.match(statusContext, /mode: "idle",\s+enabled: false/)
})
