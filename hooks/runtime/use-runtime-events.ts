"use client"

import { useEffect, useState } from "react"
import type { RuntimeBackendEvent } from "@/lib/runtime/runtime-types"
import { pollRuntimeTimeline } from "@/lib/runtime/runtime-events"

export function useRuntimeEvents(intervalMs = 3500) {
  const [events, setEvents] = useState<RuntimeBackendEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let dispose: (() => void) | undefined
    let active = true

    dispose = pollRuntimeTimeline((nextEvents) => {
      if (!active) {
        return
      }

      setEvents(nextEvents)
      setLoading(false)
      setError(null)
    }, (catchError) => {
      if (!active) {
        return
      }

      setEvents([])
      setError(
        catchError instanceof Error ? catchError.message : "Unable to load runtime events",
      )
      setLoading(false)
    }, intervalMs)

    return () => {
      active = false
      dispose?.()
    }
  }, [intervalMs])

  return { events, loading, error }
}
