import express, { Request, Response } from "express"
import { eventStore, type StoredEvent } from "../memory/eventStore"
import { type AIOSEventType } from "../kernel/eventContract"

const router = express.Router()

type EventsResponse = {
  count: number
  events: StoredEvent[]
}

type TypeEventsResponse = {
  type: AIOSEventType
  count: number
  events: StoredEvent[]
}

type ReplayResponse = {
  contextId: string
  count: number
  timeline: StoredEvent[]
}

type TimelineResponse = {
  count: number
  timeline: StoredEvent[]
}

type DebugResponse = {
  summary: {
    contextId: string
    totalEvents: number
    types: AIOSEventType[]
    countsByType: Record<AIOSEventType, number>
    firstEvent: StoredEvent | null
    lastEvent: StoredEvent | null
    spanMs: number
  }
  events: StoredEvent[]
}

type ErrorResponse = {
  error: string
}

const EVENT_TYPES: readonly AIOSEventType[] = [
  "EXECUTION_START",
  "EXECUTION_STEP",
  "EXECUTION_COMPLETE",
  "EXECUTION_ERROR",
  "STATE_TRANSITION",
] as const

function isEventType(value: unknown): value is AIOSEventType {
  return (
    typeof value === "string" &&
    (EVENT_TYPES as readonly string[]).includes(value)
  )
}

function parseContextId(value: unknown):
  | { ok: true; value: string }
  | { ok: false; error: string } {
  if (typeof value !== "string" || value.trim() === "") {
    return {
      ok: false,
      error: "Path parameter 'contextId' must be a non-empty string",
    }
  }

  return {
    ok: true,
    value,
  }
}

function parseEventType(value: unknown):
  | { ok: true; value: AIOSEventType }
  | { ok: false; error: string } {
  if (!isEventType(value)) {
    return {
      ok: false,
      error: "Path parameter 'type' is invalid",
    }
  }

  return {
    ok: true,
    value,
  }
}

function sortByTime(events: StoredEvent[]): StoredEvent[] {
  return [...events].sort((a, b) => a.timestamp - b.timestamp)
}

async function refreshFromDBSafe(): Promise<void> {
  if (!eventStore.isDBAvailable()) {
    return
  }

  try {
    await eventStore.syncFromDB()
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown sync error"
    console.warn(`AIOS replay fallback to memory store: ${message}`)
  }
}

async function loadAllEventsMemoryFirst(): Promise<StoredEvent[]> {
  const memoryEvents = eventStore.getAll()
  if (memoryEvents.length > 0) {
    return sortByTime(memoryEvents)
  }

  await refreshFromDBSafe()
  return sortByTime(eventStore.getAll())
}

async function loadContextEventsMemoryFirst(contextId: string): Promise<StoredEvent[]> {
  const memoryEvents = eventStore.getByContext(contextId)
  if (memoryEvents.length > 0) {
    return sortByTime(memoryEvents)
  }

  if (eventStore.isDBAvailable()) {
    try {
      const dbEvents = await eventStore.loadFromDB(contextId)
      if (dbEvents.length > 0) {
        eventStore.merge(dbEvents)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown load error"
      console.warn(`AIOS replay context fallback to memory store: ${message}`)
    }
  }

  return sortByTime(eventStore.getByContext(contextId))
}

async function loadTypeEventsMemoryFirst(type: AIOSEventType): Promise<StoredEvent[]> {
  const memoryEvents = eventStore.getByType(type)
  if (memoryEvents.length > 0) {
    return sortByTime(memoryEvents)
  }

  await refreshFromDBSafe()
  return sortByTime(eventStore.getByType(type))
}

function buildTypeCounts(events: StoredEvent[]): Record<AIOSEventType, number> {
  const initial: Record<AIOSEventType, number> = {
    EXECUTION_START: 0,
    EXECUTION_STEP: 0,
    EXECUTION_COMPLETE: 0,
    EXECUTION_ERROR: 0,
    STATE_TRANSITION: 0,
  }

  for (const event of events) {
    initial[event.type] += 1
  }

  return initial
}

// =========================
// GET ALL EVENTS
// =========================

router.get(
  "/events",
  async (
    _req: Request,
    res: Response<EventsResponse | ErrorResponse>
  ) => {
    try {
      await refreshFromDBSafe()
      const events = eventStore.getAll()

      return res.status(200).json({
        count: events.length,
        events,
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load events"
      return res.status(500).json({ error: message })
    }
  }
)

// =========================
// FILTER EVENTS BY TYPE
// =========================

router.get(
  "/events/type/:type",
  async (
    req: Request<{ type: string }>,
    res: Response<TypeEventsResponse | ErrorResponse>
  ) => {
    const parsedType = parseEventType(req.params.type)
    if (!parsedType.ok) {
      return res.status(400).json({ error: parsedType.error })
    }

    try {
      const events = await loadTypeEventsMemoryFirst(parsedType.value)
      return res.status(200).json({
        type: parsedType.value,
        count: events.length,
        events,
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load events by type"
      return res.status(500).json({ error: message })
    }
  }
)

// =========================
// REPLAY BY CONTEXT
// =========================

router.get(
  "/replay/:contextId",
  async (
    req: Request<{ contextId: string }>,
    res: Response<ReplayResponse | ErrorResponse>
  ) => {
    const parsedContextId = parseContextId(req.params.contextId)
    if (!parsedContextId.ok) {
      return res.status(400).json({ error: parsedContextId.error })
    }

    try {
      const events = await loadContextEventsMemoryFirst(parsedContextId.value)

      return res.status(200).json({
        contextId: parsedContextId.value,
        count: events.length,
        timeline: events,
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to replay context"
      return res.status(500).json({ error: message })
    }
  }
)

// =========================
// GLOBAL TIMELINE
// =========================

router.get(
  "/timeline",
  async (
    _req: Request,
    res: Response<TimelineResponse | ErrorResponse>
  ) => {
    try {
      const events = await loadAllEventsMemoryFirst()

      return res.status(200).json({
        count: events.length,
        timeline: events,
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load timeline"
      return res.status(500).json({ error: message })
    }
  }
)

// =========================
// DEBUG VIEW
// =========================

router.get(
  "/debug/:contextId",
  async (
    req: Request<{ contextId: string }>,
    res: Response<DebugResponse | ErrorResponse>
  ) => {
    const parsedContextId = parseContextId(req.params.contextId)
    if (!parsedContextId.ok) {
      return res.status(400).json({ error: parsedContextId.error })
    }

    try {
      const events = await loadContextEventsMemoryFirst(parsedContextId.value)

      const typeSet = new Set<AIOSEventType>()
      for (const event of events) {
        typeSet.add(event.type)
      }

      const orderedTypes = EVENT_TYPES.filter((type) => typeSet.has(type))

      const firstEvent = events[0] ?? null
      const lastEvent = events[events.length - 1] ?? null

      const spanMs =
        firstEvent && lastEvent
          ? Math.max(0, lastEvent.timestamp - firstEvent.timestamp)
          : 0

      return res.status(200).json({
        summary: {
          contextId: parsedContextId.value,
          totalEvents: events.length,
          types: orderedTypes,
          countsByType: buildTypeCounts(events),
          firstEvent,
          lastEvent,
          spanMs,
        },
        events,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to debug context"
      return res.status(500).json({ error: message })
    }
  }
)

export default router