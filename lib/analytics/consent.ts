export type AnalyticsConsent = "undecided" | "granted" | "denied"

export const ANALYTICS_CONSENT_STORAGE_KEY = "aios.analytics-consent.v1"

type ConsentStorage = Pick<Storage, "getItem" | "setItem">

function getBrowserStorage(): ConsentStorage | null {
  if (typeof window === "undefined") {
    return null
  }

  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function parseAnalyticsConsent(value: string | null): AnalyticsConsent {
  return value === "granted" || value === "denied" ? value : "undecided"
}

export function readAnalyticsConsent(
  storage: ConsentStorage | null = getBrowserStorage(),
): AnalyticsConsent {
  if (!storage) {
    return "undecided"
  }

  try {
    return parseAnalyticsConsent(storage.getItem(ANALYTICS_CONSENT_STORAGE_KEY))
  } catch {
    return "undecided"
  }
}

export function saveAnalyticsConsent(
  consent: Exclude<AnalyticsConsent, "undecided">,
  storage: ConsentStorage | null = getBrowserStorage(),
): boolean {
  if (!storage) {
    return false
  }

  try {
    storage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, consent)
    return true
  } catch {
    return false
  }
}
