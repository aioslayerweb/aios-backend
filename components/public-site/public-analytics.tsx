"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    clarity?: (...args: unknown[]) => void
    posthog?: { capture: (event: string, properties?: Record<string, unknown>) => void }
    aiosTrackEvent?: (event: string, properties?: Record<string, unknown>) => void
  }
}

function emit(event: string, properties: Record<string, unknown> = {}) {
  if (typeof window === "undefined") {
    return
  }

  window.gtag?.("event", event, properties)
  window.clarity?.("event", event)
  window.posthog?.capture(event, properties)
}

function inferClickEvent(target: HTMLElement) {
  const explicit = target.closest<HTMLElement>("[data-analytics-event]")?.dataset.analyticsEvent
  if (explicit) {
    return explicit
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

export function PublicAnalytics() {
  const pathname = usePathname()
  const trackedScroll = useRef(new Set<number>())

  useEffect(() => {
    const clickOptions: AddEventListenerOptions = { capture: true, passive: true }
    window.aiosTrackEvent = emit
    emit("page_view", { path: pathname })

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof HTMLElement ? event.target : null
      if (!target) {
        return
      }

      const eventName = inferClickEvent(target)
      if (!eventName) {
        return
      }

      const host = target.closest<HTMLElement>("a[href],button")
      emit(eventName, {
        path: pathname,
        label: host?.textContent?.trim().slice(0, 120),
        href: host?.getAttribute("href"),
      })
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
          emit(`scroll_depth_${threshold}`, { path: pathname })
        }
      })
    }

    document.addEventListener("click", onClick, clickOptions)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    return () => {
      document.removeEventListener("click", onClick, clickOptions)
      window.removeEventListener("scroll", onScroll)
    }
  }, [pathname])

  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) {
      return
    }

    const onResize = () => emit("viewport_resize", { width: Math.round(viewport.width), height: Math.round(viewport.height), path: pathname })
    viewport.addEventListener("resize", onResize)
    return () => viewport.removeEventListener("resize", onResize)
  }, [pathname])

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (!key) {
      return
    }

    let mounted = true

    import("posthog-js").then(({ default: posthog }) => {
      if (!mounted) {
        return
      }

      if (!window.posthog) {
        posthog.init(key, {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com",
          autocapture: false,
          capture_pageview: false,
          persistence: "localStorage+cookie",
        })
        window.posthog = posthog
      }
    })

    return () => {
      mounted = false
    }
  }, [])

  return null
}
