import { sanitizeAnalyticsProperties } from "./privacy"

type AnalyticsEvent = string

export type AnalyticsTransport = {
  enable: () => void
  disable: () => void
  track: (event: AnalyticsEvent, properties: Record<string, string | number>) => void
}

export function createAnalyticsController(transport: AnalyticsTransport) {
  let enabled = false
  let lastPagePath: string | null = null

  function setConsent(nextEnabled: boolean) {
    if (enabled === nextEnabled) {
      return
    }

    enabled = nextEnabled
    if (enabled) {
      transport.enable()
      return
    }

    lastPagePath = null
    transport.disable()
  }

  function track(event: string, properties: Readonly<Record<string, unknown>> = {}): boolean {
    if (!enabled) {
      return false
    }

    transport.track(event, sanitizeAnalyticsProperties(properties))
    return true
  }

  function trackPageView(pathname: string, area: "app" | "demo" | "public"): boolean {
    if (!enabled || pathname === lastPagePath) {
      return false
    }

    lastPagePath = pathname
    return track("page_view", { area })
  }

  return {
    setConsent,
    track,
    trackPageView,
    isEnabled: () => enabled,
  }
}
