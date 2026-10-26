import assert from "node:assert/strict"
import { once } from "node:events"
import { createServer } from "node:http"
import { test } from "node:test"
import express from "express"
import intelligenceRouter from "../../src/api/intelligence"
import replayRouter from "../../src/api/replay"
import { eventStore } from "../../src/memory/eventStore"

const unavailableResponse = {
  error: "Organization-scoped runtime event access is not configured",
}

async function startRuntimeServer() {
  const app = express()
  app.use(express.json())
  app.use("/aios", replayRouter)
  app.use("/intelligence", intelligenceRouter)

  const server = createServer(app)
  server.listen(0, "127.0.0.1")
  await once(server, "listening")

  const address = server.address()
  assert.ok(address && typeof address !== "string")

  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()))
      }),
  }
}

test("runtime event APIs fail closed without organization authorization", async () => {
  const server = await startRuntimeServer()
  const eventCountBefore = eventStore.getAll().length

  try {
    for (const path of [
      "/aios/events",
      "/aios/events/type/EXECUTION_START",
      "/aios/timeline",
      "/aios/replay/synthetic-context",
      "/aios/debug/synthetic-context",
    ]) {
      const response = await fetch(`${server.baseUrl}${path}`)
      assert.equal(response.status, 503, path)
      assert.deepEqual(await response.json(), unavailableResponse, path)
    }

    const ingestion = await fetch(`${server.baseUrl}/intelligence/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "EXECUTION_START",
        timestamp: Date.now(),
        contextId: "synthetic-context",
        payload: { module: "Synthetic Test", source: "user" },
      }),
    })
    assert.equal(ingestion.status, 503)
    assert.deepEqual(await ingestion.json(), {
      success: false,
      ...unavailableResponse,
    })
    assert.equal(eventStore.getAll().length, eventCountBefore)
  } finally {
    await server.close()
  }
})
