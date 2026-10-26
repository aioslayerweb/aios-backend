import assert from "node:assert/strict"
import { after, test } from "node:test"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { securityIdentities, securityRecords } from "../fixtures/security-identities"

const originalFetch = globalThis.fetch
globalThis.fetch = async () => {
  throw new Error("Network access is disabled in the offline security test harness")
}
after(() => {
  globalThis.fetch = originalFetch
})

function readSource(path: string): string {
  return readFileSync(resolve(process.cwd(), path), "utf8")
}

function extractExpressRuntimePaths(): string[] {
  const serverSource = readSource("src/server.ts")
  const replayMount = serverSource.match(/app\.use\(\s*["']([^"']+)["']\s*,\s*replayRouter\s*\)/)
  assert.ok(replayMount, "Express replay router must have a declared mount path")

  const replaySource = readSource("src/api/replay.ts")
  return Array.from(
    replaySource.matchAll(/router\.get\(\s*["']([^"']+)["']/g),
    (match) => `${replayMount[1]}${match[1]}`,
  )
}

function extractFrontendRuntimePaths(): string[] {
  const runtimeSource = readSource("lib/runtime/runtime-events.ts")
  return Array.from(
    runtimeSource.matchAll(/runtimeFetchJson<[^>]+>\(\s*["'`]([^"'`]+)["'`]/g),
    (match) => match[1].replace(/\$\{encodeURIComponent\(contextId\)\}/g, ":contextId"),
  )
}

test("security fixtures use synthetic identities, separate tenants, roles, and mapped or unmapped records", () => {
  assert.equal(new Set(securityIdentities.map((identity) => identity.organizationId)).size, 2)
  assert.equal(new Set(securityIdentities.map((identity) => identity.role)).size, 2)
  assert.deepEqual(
    securityRecords.map((record) => record.organizationId),
    ["org-northwind", "org-helios", null],
  )
  assert.ok(securityIdentities.every((identity) => identity.id.startsWith("user-")))
})

test("frontend runtime calls match the explicit Express replay route contract", () => {
  const expectedFrontendPaths = [
    "/aios/events",
    "/aios/timeline",
    "/aios/replay/:contextId",
    "/aios/debug/:contextId",
  ]

  assert.deepEqual(extractFrontendRuntimePaths(), expectedFrontendPaths)
  assert.ok(expectedFrontendPaths.every((path) => extractExpressRuntimePaths().includes(path)))
})

test.todo("selected deployed API implements every frontend runtime route; current FastAPI source lacks /aios/* and deployment ownership is unresolved")
test.todo("user cannot read or replay a record owned by another organization")
