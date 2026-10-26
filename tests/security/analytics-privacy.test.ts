import assert from "node:assert/strict"
import { test } from "node:test"
import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  parseAnalyticsConsent,
  readAnalyticsConsent,
  saveAnalyticsConsent,
} from "@/lib/analytics/consent"
import { loadAfterConsent } from "@/lib/analytics/consent-aware-loader"
import { createAnalyticsController } from "@/lib/analytics/controller"
import {
  getAnalyticsArea,
  sanitizeAnalyticsProperties,
  sanitizePosthogEvent,
} from "@/lib/analytics/privacy"
import { formatStableDateTime, formatStableTime } from "@/utils/date"

test("analytics consent remains undecided unless an explicit stored choice exists", () => {
  let value: string | null = null
  const storage = {
    getItem: (key: string) => key === ANALYTICS_CONSENT_STORAGE_KEY ? value : null,
    setItem: (key: string, nextValue: string) => {
      if (key === ANALYTICS_CONSENT_STORAGE_KEY) value = nextValue
    },
  }

  assert.equal(parseAnalyticsConsent(null), "undecided")
  assert.equal(readAnalyticsConsent(storage), "undecided")
  assert.equal(saveAnalyticsConsent("granted", storage), true)
  assert.equal(readAnalyticsConsent(storage), "granted")
  assert.equal(saveAnalyticsConsent("denied", storage), true)
  assert.equal(readAnalyticsConsent(storage), "denied")
  assert.equal(readAnalyticsConsent(null), "undecided")
})

test("unavailable or throwing browser storage never grants analytics consent", () => {
  const throwingStorage = {
    getItem: () => {
      throw new Error("storage disabled")
    },
    setItem: () => {
      throw new Error("storage disabled")
    },
  }

  assert.equal(readAnalyticsConsent(null), "undecided")
  assert.equal(readAnalyticsConsent(throwingStorage), "undecided")
  assert.equal(saveAnalyticsConsent("granted", null), false)
  assert.equal(saveAnalyticsConsent("granted", throwingStorage), false)
})

test("PostHog import can retry after consent is withdrawn before it resolves", async () => {
  let consentGranted = true
  let resolveFirstImport: ((provider: string) => void) | undefined
  let resolveSecondImport: ((provider: string) => void) | undefined
  let importCount = 0
  let initializationCount = 0
  const errors: unknown[] = []
  const state = { pending: null as Promise<void> | null }
  const load = () => {
    importCount += 1
    return new Promise<string>((resolve) => {
      if (importCount === 1) {
        resolveFirstImport = resolve
      } else {
        resolveSecondImport = resolve
      }
    })
  }
  const initialize = () => {
    initializationCount += 1
  }
  const onError = (error: unknown) => errors.push(error)

  loadAfterConsent(state, () => consentGranted, load, initialize, onError)
  await Promise.resolve()
  consentGranted = false
  resolveFirstImport?.("first provider")
  await state.pending

  assert.equal(state.pending, null)
  assert.equal(initializationCount, 0)

  consentGranted = true
  loadAfterConsent(state, () => consentGranted, load, initialize, onError)
  await Promise.resolve()
  resolveSecondImport?.("second provider")
  await state.pending
  loadAfterConsent(state, () => consentGranted, load, initialize, onError)

  assert.equal(importCount, 2)
  assert.equal(initializationCount, 1)
  assert.deepEqual(errors, [])
})

test("analytics controller gates providers and events until explicit consent", () => {
  const calls: string[] = []
  const events: Array<{ event: string; properties: Record<string, string | number> }> = []
  const controller = createAnalyticsController({
    enable: () => calls.push("enable"),
    disable: () => calls.push("disable"),
    track: (event, properties) => events.push({ event, properties }),
  })

  assert.equal(controller.isEnabled(), false)
  assert.equal(controller.track("demo_click", { area: "demo" }), false)
  assert.equal(controller.trackPageView("/demo-platform", "demo"), false)
  assert.deepEqual(calls, [])
  assert.deepEqual(events, [])

  controller.setConsent(true)
  controller.setConsent(true)
  assert.deepEqual(calls, ["enable"])
  assert.equal(controller.trackPageView("/demo-platform", "demo"), true)
  assert.equal(controller.trackPageView("/demo-platform", "demo"), false)
  assert.equal(controller.trackPageView("/demo-platform/agents", "demo"), true)
  assert.deepEqual(events.map(({ event }) => event), ["page_view", "page_view"])
})

test("analytics opt-out blocks future events and a renewed opt-in has one page view", () => {
  const calls: string[] = []
  const events: Array<{ event: string; properties: Record<string, string | number> }> = []
  const controller = createAnalyticsController({
    enable: () => calls.push("enable"),
    disable: () => calls.push("disable"),
    track: (event, properties) => events.push({ event, properties }),
  })

  controller.setConsent(true)
  controller.trackPageView("/app/customers/private-record", "app")
  controller.setConsent(false)
  assert.equal(controller.track("navigation_click", { area: "app" }), false)
  assert.equal(controller.trackPageView("/app/customers/private-record", "app"), false)
  controller.setConsent(true)
  assert.equal(controller.trackPageView("/app/customers/private-record", "app"), true)

  assert.deepEqual(calls, ["enable", "disable", "enable"])
  assert.deepEqual(events.map(({ event }) => event), ["page_view", "page_view"])
  assert.deepEqual(events[0]?.properties, { area: "app" })
})

test("analytics reports only broad route areas, not dynamic route values", () => {
  assert.equal(getAnalyticsArea("/app/customers/account-private-42?email=owner@example.com"), "app")
  assert.equal(getAnalyticsArea("/demo-platform/decisions"), "demo")
  assert.equal(getAnalyticsArea("/pricing"), "public")
})

test("analytics property sanitization drops labels, URLs, paths, and arbitrary data", () => {
  const properties = sanitizeAnalyticsProperties({
    area: "app",
    label: "Private customer name",
    href: "/app/customers/account-private-42",
    path: "/app/customers/account-private-42?email=owner@example.com",
    email: "owner@example.com",
    width: 390.4,
    height: 844,
  })

  assert.deepEqual(properties, { area: "app", width: 390, height: 844 })
})

test("analytics property sanitization rejects invalid areas and viewport dimensions", () => {
  const properties = sanitizeAnalyticsProperties({
    area: "/app/customer-private",
    width: Number.POSITIVE_INFINITY,
    height: -1,
  })

  assert.deepEqual(properties, {})
})

test("PostHog before-send sanitization removes automatic URL and identity properties", () => {
  const event = sanitizePosthogEvent({
    properties: {
      area: "demo",
      "$current_url": "https://aiospilot.com/demo-platform/customers/private-42",
      "$pathname": "/demo-platform/customers/private-42",
      "$referrer": "https://private.example",
      label: "Customer name",
    },
    $set: { email: "person@example.com", area: "app" },
    $set_once: { initial_pathname: "/app/customers/private-42" },
  })

  assert.deepEqual(event, {
    properties: { area: "demo" },
    $set: { area: "app" },
    $set_once: {},
  })
  assert.equal(sanitizePosthogEvent(null), null)
})

test("stable date-time formatting is independent of the server or browser timezone", () => {
  assert.equal(formatStableDateTime("2026-10-26T07:00:00.000Z"), "10/26/2026, 7:00:00 AM")
  assert.equal(formatStableDateTime("not-a-date"), "Invalid Date")
  assert.equal(formatStableTime("2026-10-26T07:00:00.000Z"), "07:00 AM")
  assert.equal(formatStableTime("not-a-date"), "Invalid Date")
})
