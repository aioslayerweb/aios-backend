export type AnalyticsArea = "app" | "demo" | "public"

export function getAnalyticsArea(pathname: string): AnalyticsArea {
  const firstSegment = pathname.split(/[?#]/, 1)[0]?.split("/").filter(Boolean)[0]

  if (firstSegment === "app") return "app"
  if (firstSegment === "demo-platform") return "demo"
  return "public"
}

export function sanitizeAnalyticsProperties(
  properties: Readonly<Record<string, unknown>>,
): Record<string, string | number> {
  const safeProperties: Record<string, string | number> = {}
  const area = properties.area

  if (area === "app" || area === "demo" || area === "public") {
    safeProperties.area = area
  }

  for (const dimension of ["width", "height"] as const) {
    const value = properties[dimension]
    if (typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 10_000) {
      safeProperties[dimension] = Math.round(value)
    }
  }

  return safeProperties
}

type PosthogEvent = {
  properties?: Record<string, unknown>
  $set?: Record<string, unknown>
  $set_once?: Record<string, unknown>
}

export function sanitizePosthogEvent<T extends PosthogEvent>(event: T | null): T | null {
  if (!event) {
    return null
  }

  if (event.properties) {
    event.properties = sanitizeAnalyticsProperties(event.properties)
  }
  if (event.$set) {
    event.$set = sanitizeAnalyticsProperties(event.$set)
  }
  if (event.$set_once) {
    event.$set_once = sanitizeAnalyticsProperties(event.$set_once)
  }

  return event
}
