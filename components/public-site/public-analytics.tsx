"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui"
import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  parseAnalyticsConsent,
  readAnalyticsConsent,
  saveAnalyticsConsent,
  type AnalyticsConsent,
} from "@/lib/analytics/consent"
import { loadAfterConsent } from "@/lib/analytics/consent-aware-loader"
import { createAnalyticsController } from "@/lib/analytics/controller"
import { getAnalyticsArea, sanitizePosthogEvent } from "@/lib/analytics/privacy"

const googleAnalyticsId = process.env.NEXT_PUBLIC_GA4_ID ?? ""
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? ""
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com"

const allowedClickEvents = new Set([
  "demo_click",
  "pilot_application_click",
  "pricing_request_click",
  "download_click",
  "navigation_click",
  "pilot_click",
  "discovery_click",
  "contact_click",
])

type PosthogEvent = {
  event: string
  properties: Record<string, string | number>
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    posthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void
      opt_in_capturing: () => void
      opt_out_capturing: () => void
    }
  }
}

function inferClickEvent(target: HTMLElement) {
  const explicit = target.closest<HTMLElement>("[data-analytics-event]")?.dataset.analyticsEvent
  if (explicit) {
    return allowedClickEvents.has(explicit) ? explicit : undefined
  }

  const host = target.closest<HTMLElement>("a[href],button")
  if (!host) {
    return undefined
  }

  const label = (host.textContent ?? host.getAttribute("aria-label") ?? "").trim().toLowerCase()
  const href = host.getAttribute("href") ?? ""

  if (label.includes("book demo") || label.includes("request demo")) {
    return "demo_click"
  }

  if (label.includes("join pilot") || label.includes("pilot program")) {
    return "pilot_application_click"
  }

  if (label.includes("request pricing") || label.includes("pricing")) {
    return "pricing_request_click"
  }

  if (label.includes("download")) {
    return "download_click"
  }

  if (href.startsWith("/") || href.startsWith(window.location.origin)) {
    return "navigation_click"
  }

  return undefined
}

function clearGoogleAnalyticsCookies() {
  const names = document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("=", 1)[0])
    .filter((name) => name === "_ga" || name.startsWith("_ga_") || name === "_gid" || name.startsWith("_gat"))

  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; path=/`
    document.cookie = `${name}=; Max-Age=0; path=/; domain=${window.location.hostname}`
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.${window.location.hostname}`
  }
}

export function PublicAnalytics() {
  const pathname = usePathname()
  const [consent, setConsent] = useState<AnalyticsConsent>("undecided")
  const [editingChoice, setEditingChoice] = useState(false)
  const [storageWarning, setStorageWarning] = useState("")
  const consentRef = useRef(false)
  const trackedScroll = useRef(new Set<number>())
  const providerState = useRef({
    googleInitialized: false,
    posthogInitialized: false,
    pending: null as Promise<void> | null,
    pendingPosthogEvents: [] as PosthogEvent[],
  })

  const controller = useMemo(
    () =>
      createAnalyticsController({
        enable() {
          if (googleAnalyticsId) {
            if (!window.gtag) {
              window.dataLayer = window.dataLayer ?? []
              window.gtag = (...args: unknown[]) => window.dataLayer?.push(args)
            }

            if (!providerState.current.googleInitialized) {
              window.gtag("js", new Date())
              window.gtag("consent", "default", {
                analytics_storage: "granted",
                ad_storage: "denied",
                ad_user_data: "denied",
                ad_personalization: "denied",
              })
              window.gtag("config", googleAnalyticsId, {
                send_page_view: false,
                page_location: "https://aiospilot.com/",
                page_referrer: "",
                page_title: "AIOS",
                allow_google_signals: false,
                allow_ad_personalization_signals: false,
              })

              const script = document.createElement("script")
              script.async = true
              script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleAnalyticsId)}`
              script.onerror = () => console.error("Google Analytics could not be loaded.")
              document.head.appendChild(script)
              providerState.current.googleInitialized = true
            } else {
              window.gtag("consent", "update", {
                analytics_storage: "granted",
                ad_storage: "denied",
                ad_user_data: "denied",
                ad_personalization: "denied",
              })
            }
          }

          if (posthogKey) {
            if (providerState.current.posthogInitialized && window.posthog) {
              window.posthog.opt_in_capturing()
              return
            }

            if (!providerState.current.pending) {
              loadAfterConsent(
                providerState.current,
                () => consentRef.current,
                () => import("posthog-js"),
                ({ default: posthog }) => {
                  if (!providerState.current.posthogInitialized) {
                    posthog.init(posthogKey, {
                      api_host: posthogHost,
                      autocapture: false,
                      capture_pageview: false,
                      disable_session_recording: true,
                      persistence: "localStorage+cookie",
                      before_send: (event) => sanitizePosthogEvent(event),
                    })
                    window.posthog = posthog
                    providerState.current.posthogInitialized = true
                  }

                  window.posthog?.opt_in_capturing()
                  const queued = providerState.current.pendingPosthogEvents.splice(0)
                  queued.forEach(({ event, properties }) => window.posthog?.capture(event, properties))
                },
                (error) => console.error("PostHog could not be initialized.", error),
              )
            }
          }
        },
        disable() {
          if (window.gtag && providerState.current.googleInitialized) {
            window.gtag("consent", "update", {
              analytics_storage: "denied",
              ad_storage: "denied",
              ad_user_data: "denied",
              ad_personalization: "denied",
            })
            clearGoogleAnalyticsCookies()
          }

          providerState.current.pendingPosthogEvents = []
          if (window.posthog && providerState.current.posthogInitialized) {
            window.posthog.opt_out_capturing()
          }
        },
        track(event, properties) {
          const area = properties.area
          const googleProperties = area
            ? {
                ...properties,
                page_location: `https://aiospilot.com/${area}`,
                page_referrer: "",
                page_title: "AIOS",
              }
            : properties
          window.gtag?.("event", event, googleProperties)

          if (window.posthog && providerState.current.posthogInitialized) {
            window.posthog.capture(event, properties)
          } else if (posthogKey && consentRef.current) {
            providerState.current.pendingPosthogEvents.push({ event, properties })
          }
        },
      }),
    [],
  )

  useEffect(() => {
    setConsent(readAnalyticsConsent())

    const onStorage = (event: StorageEvent) => {
      if (event.key === ANALYTICS_CONSENT_STORAGE_KEY || event.key === null) {
        const nextConsent = event.key === null
          ? "undecided"
          : parseAnalyticsConsent(event.newValue)
        setConsent(nextConsent)
        setEditingChoice(nextConsent === "undecided")
      }
    }

    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  useEffect(() => {
    const allowed = consent === "granted"
    consentRef.current = allowed
    controller.setConsent(allowed)

    if (!allowed) {
      trackedScroll.current.clear()
      return
    }

    trackedScroll.current.clear()
    controller.trackPageView(pathname, getAnalyticsArea(pathname))

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof HTMLElement ? event.target : null
      if (!target) {
        return
      }

      const eventName = inferClickEvent(target)
      if (eventName) {
        controller.track(eventName, { area: getAnalyticsArea(pathname) })
      }
    }

    const onScroll = () => {
      const scrollRoot = document.documentElement
      const total = scrollRoot.scrollHeight - window.innerHeight
      if (total <= 0) {
        return
      }

      const percent = Math.round((window.scrollY / total) * 100)
      ;[25, 50, 75, 100].forEach((threshold) => {
        if (percent >= threshold && !trackedScroll.current.has(threshold)) {
          trackedScroll.current.add(threshold)
          controller.track(`scroll_depth_${threshold}`, { area: getAnalyticsArea(pathname) })
        }
      })
    }

    const clickOptions: AddEventListenerOptions = { capture: true, passive: true }
    document.addEventListener("click", onClick, clickOptions)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    const viewport = window.visualViewport
    const onResize = () => {
      if (viewport) {
        controller.track("viewport_resize", {
          area: getAnalyticsArea(pathname),
          width: Math.round(viewport.width),
          height: Math.round(viewport.height),
        })
      }
    }
    viewport?.addEventListener("resize", onResize)

    return () => {
      document.removeEventListener("click", onClick, clickOptions)
      window.removeEventListener("scroll", onScroll)
      viewport?.removeEventListener("resize", onResize)
    }
  }, [consent, controller, pathname])

  function chooseConsent(nextConsent: Exclude<AnalyticsConsent, "undecided">) {
    const saved = saveAnalyticsConsent(nextConsent)
    setStorageWarning(
      saved ? "" : "Your choice applies for this visit, but browser storage is unavailable. You may be asked again next time.",
    )
    setConsent(nextConsent)
    setEditingChoice(false)
  }

  const showChoices = consent === "undecided" || editingChoice

  return (
    <>
      {storageWarning ? (
        <p className="fixed bottom-16 left-4 z-[100] max-w-[calc(100vw-2rem)] rounded-lg border border-amber-300 bg-white px-4 py-3 text-sm text-amber-950 shadow-lg" role="status" aria-live="polite">
          {storageWarning}
        </p>
      ) : null}

      {showChoices ? (
        <section
          className="fixed inset-x-3 bottom-3 z-[99] mx-auto max-w-2xl rounded-xl border border-border bg-white p-4 shadow-xl sm:inset-x-4 sm:bottom-4 sm:p-5"
          role="region"
          aria-label="Analytics privacy choices"
          aria-describedby="analytics-consent-description"
        >
          <h2 className="text-base font-semibold text-brand-navy">Your analytics choice</h2>
          <p id="analytics-consent-description" className="mt-1 text-sm leading-6 text-text-secondary">
            Optional analytics help us understand broad site usage. They stay off unless you choose to allow them. You can change this choice at any time in Privacy settings.
          </p>
          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => chooseConsent("denied")}>
              Keep analytics off
            </Button>
            <Button type="button" onClick={() => chooseConsent("granted")}>
              Accept analytics
            </Button>
          </div>
        </section>
      ) : (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="fixed bottom-3 right-3 z-[99] shadow-md sm:bottom-4 sm:right-4"
          aria-expanded={editingChoice}
          onClick={() => setEditingChoice(true)}
        >
          Privacy settings
        </Button>
      )}
    </>
  )
}
