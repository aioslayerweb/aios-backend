import assert from "node:assert/strict"
import { test } from "node:test"
import { syntheticDemoInsights } from "@/lib/demo/synthetic-insights"
import { formatSimulationActivity } from "@/lib/demo/simulation"
import { loadWhenEnabled } from "@/lib/runtime/live-data-boundary"

test("disabled live-data boundary does not invoke its loader", async () => {
  let loadCount = 0
  const result = await loadWhenEnabled(false, async () => {
    loadCount += 1
    throw new Error("Live loader must not run in synthetic mode")
  })

  assert.equal(result, null)
  assert.equal(loadCount, 0)
})

test("enabled live-data boundary preserves the configured SaaS loader", async () => {
  const result = await loadWhenEnabled(true, async () => "live-loader-result")

  assert.equal(result, "live-loader-result")
})

test("demo insight fixtures are explicitly synthetic", () => {
  assert.ok(syntheticDemoInsights.length > 0)
  assert.ok(syntheticDemoInsights.every((insight) => insight.id.startsWith("demo-insight-")))
  assert.ok(syntheticDemoInsights.every((insight) => insight.status === "Example"))
})

test("demo action feedback describes a local simulation, not a completed operation", () => {
  const activity = formatSimulationActivity("Workflow trigger", "Sample workflow")

  assert.match(activity, /^SIMULATION ONLY:/)
  assert.match(activity, /preview/)
  assert.match(activity, /No business data was changed/)
})
