import { randomUUID } from "node:crypto"
import { AIOSSystemEvent } from "../kernel/eventContract"
import {
  fetchAIOSEventRows,
  insertAIOSEventRow,
  isSupabaseConfigured,
  type AIOSEventInsertRow,
} from "./supabaseClient"

export type StoredEvent = AIOSSystemEvent & {
  id: string
  storedAt: number
}

type PersistenceMode = "online" | "degraded" | "memory-only"

type PendingWrite = {
  event: StoredEvent
  attempts: number
}

export class EventStore {
  private static readonly MAX_WRITE_ATTEMPTS = 3
  private static readonly RETRY_BASE_DELAY_MS = 250

  private readonly byId = new Map<string, StoredEvent>()
  private readonly byContextId = new Map<string, StoredEvent[]>()
  private readonly writeQueue: PendingWrite[] = []

  private flushTimer: ReturnType<typeof setTimeout> | null = null
  private persistenceMode: PersistenceMode = isSupabaseConfigured()
    ? "online"
    : "memory-only"

  // =========================
  // REQUIRED V3 API
  // =========================

  public add(event: AIOSSystemEvent): StoredEvent {
    const stored: StoredEvent = {
      ...event,
      id: randomUUID(),
      storedAt: Date.now(),
    }

    this.putInMemory(stored)

    // Runtime event path is always non-blocking for DB work.
    this.enqueueWrite(stored)

    return stored
  }

  // Backward compatibility for existing callers.
  public save(event: AIOSSystemEvent): StoredEvent {
    return this.add(event)
  }

  public getAll(): StoredEvent[] {
    return this.sortTimeline(Array.from(this.byId.values()))
  }

  public getByType(type: AIOSSystemEvent["type"]): StoredEvent[] {
    return this.sortTimeline(
      this.getAll().filter((event) => event.type === type)
    )
  }

  public async replay(contextId: string): Promise<StoredEvent[]> {
    const cached = this.getByContext(contextId)

    if (cached.length > 0) {
      return cached
    }

    const loaded = await this.loadFromDB(contextId)
    if (loaded.length > 0) {
      this.replaceContextCache(contextId, loaded)
    }

    return this.sortTimeline(loaded)
  }

  public async saveToDB(event: StoredEvent): Promise<void> {
    const row: AIOSEventInsertRow = {
      id: event.id,
      type: event.type,
      timestamp: event.timestamp,
      context_id: event.contextId,
      payload: event.payload,
    }

    const result = await insertAIOSEventRow(row)
    if (!result.ok) {
      this.persistenceMode = isSupabaseConfigured() ? "degraded" : "memory-only"
      console.warn(
        `AIOS Memory Layer: saveToDB failed; continuing memory-only path (${result.error ?? "unknown error"})`
      )
      return
    }

    this.persistenceMode = "online"
  }

  public async loadFromDB(contextId: string): Promise<StoredEvent[]> {
    if (!isSupabaseConfigured()) {
      this.persistenceMode = "memory-only"
      return []
    }

    const result = await fetchAIOSEventRows({ contextId })
    if (!result.ok) {
      this.persistenceMode = "degraded"
      console.warn(
        `AIOS Memory Layer: loadFromDB failed; using cache fallback (${result.error ?? "unknown error"})`
      )
      return []
    }

    this.persistenceMode = "online"
    return this.mapRowsToStoredEvents(result.data)
  }

  public async loadAllFromDB(): Promise<StoredEvent[]> {
    if (!isSupabaseConfigured()) {
      this.persistenceMode = "memory-only"
      return []
    }

    const result = await fetchAIOSEventRows()
    if (!result.ok) {
      this.persistenceMode = "degraded"
      console.warn(
        `AIOS Memory Layer: loadAllFromDB failed; using cache fallback (${result.error ?? "unknown error"})`
      )
      return []
    }

    this.persistenceMode = "online"
    return this.mapRowsToStoredEvents(result.data)
  }

  public async syncFromDB(contextId?: string): Promise<StoredEvent[]> {
    if (typeof contextId === "string") {
      const loadedByContext = await this.loadFromDB(contextId)

      this.replaceContextCache(contextId, loadedByContext)

      return loadedByContext
    }

    const loadedAll = await this.loadAllFromDB()
    this.resetCache(loadedAll)
    return loadedAll
  }

  // =========================
  // COMPATIBILITY HELPERS
  // =========================

  public isDBAvailable(): boolean {
    return isSupabaseConfigured()
  }

  public getByContext(contextId: string): StoredEvent[] {
    const cached = this.byContextId.get(contextId)
    if (!cached) {
      return []
    }

    return this.sortTimeline([...cached])
  }

  public merge(events: StoredEvent[]): void {
    for (const event of events) {
      this.putInMemory(event)
    }
  }

  // =========================
  // INTERNAL MAPPING LAYER
  // =========================

  private mapRowsToStoredEvents(rows: unknown): StoredEvent[] {
    if (!Array.isArray(rows)) {
      return []
    }

    const mapped: StoredEvent[] = []

    for (const row of rows) {
      const parsed = this.fromRow(row)
      if (parsed) {
        mapped.push(parsed)
      }
    }

    return mapped
  }

  private fromRow(row: unknown): StoredEvent | null {
    if (!this.isRecord(row)) {
      return null
    }

    const event = this.toSystemEvent(row)
    if (!event) {
      return null
    }

    const id = typeof row.id === "string" ? row.id : randomUUID()
    const storedAt = this.toStoredAt(row.created_at)

    return {
      id,
      storedAt,
      ...event,
    }
  }

  private toSystemEvent(row: Record<string, unknown>): AIOSSystemEvent | null {
    const type = row.type
    const timestamp = row.timestamp
    const contextId = row.context_id
    const payload = row.payload

    if (
      typeof type !== "string" ||
      typeof timestamp !== "number" ||
      typeof contextId !== "string" ||
      !this.isRecord(payload)
    ) {
      return null
    }

    switch (type) {
      case "EXECUTION_START":
        if (
          typeof payload.module === "string" &&
          this.isExecutionSource(payload.source)
        ) {
          return {
            type: "EXECUTION_START",
            timestamp,
            contextId,
            payload: {
              module: payload.module,
              source: payload.source,
            },
          }
        }
        return null

      case "EXECUTION_STEP":
        if (
          typeof payload.stepId === "string" &&
          typeof payload.label === "string" &&
          this.isStepStatus(payload.status)
        ) {
          return {
            type: "EXECUTION_STEP",
            timestamp,
            contextId,
            payload: {
              stepId: payload.stepId,
              label: payload.label,
              status: payload.status,
            },
          }
        }
        return null

      case "EXECUTION_COMPLETE":
        if (
          typeof payload.resultSummary === "string" &&
          typeof payload.success === "boolean"
        ) {
          return {
            type: "EXECUTION_COMPLETE",
            timestamp,
            contextId,
            payload: {
              resultSummary: payload.resultSummary,
              success: payload.success,
            },
          }
        }
        return null

      case "EXECUTION_ERROR":
        if (
          typeof payload.errorMessage === "string" &&
          this.isSeverity(payload.severity) &&
          (typeof payload.errorCode === "undefined" ||
            typeof payload.errorCode === "string")
        ) {
          return {
            type: "EXECUTION_ERROR",
            timestamp,
            contextId,
            payload: {
              errorMessage: payload.errorMessage,
              errorCode: payload.errorCode,
              severity: payload.severity,
            },
          }
        }
        return null

      case "STATE_TRANSITION":
        if (
          typeof payload.from === "string" &&
          typeof payload.to === "string" &&
          (typeof payload.reason === "undefined" ||
            typeof payload.reason === "string")
        ) {
          return {
            type: "STATE_TRANSITION",
            timestamp,
            contextId,
            payload: {
              from: payload.from,
              to: payload.to,
              reason: payload.reason,
            },
          }
        }
        return null

      default:
        return null
    }
  }

  private replaceContextCache(contextId: string, events: StoredEvent[]): void {
    const previous = this.byContextId.get(contextId) ?? []
    for (const event of previous) {
      this.byId.delete(event.id)
    }

    this.byContextId.set(contextId, [])

    for (const event of events) {
      this.putInMemory(event)
    }
  }

  private resetCache(events: StoredEvent[]): void {
    this.byId.clear()
    this.byContextId.clear()

    for (const event of events) {
      this.putInMemory(event)
    }
  }

  private putInMemory(event: StoredEvent): void {
    if (this.byId.has(event.id)) {
      return
    }

    this.byId.set(event.id, event)

    const byContext = this.byContextId.get(event.contextId)
    if (byContext) {
      byContext.push(event)
      return
    }

    this.byContextId.set(event.contextId, [event])
  }

  private enqueueWrite(event: StoredEvent): void {
    if (!isSupabaseConfigured()) {
      this.persistenceMode = "memory-only"
      return
    }

    this.writeQueue.push({ event, attempts: 0 })
    this.scheduleFlush(0)
  }

  private scheduleFlush(delayMs: number): void {
    if (this.flushTimer) {
      return
    }

    this.flushTimer = setTimeout(() => {
      this.flushTimer = null
      void this.flushWriteQueue()
    }, delayMs)
  }

  private async flushWriteQueue(): Promise<void> {
    if (!isSupabaseConfigured()) {
      this.persistenceMode = "memory-only"
      this.writeQueue.length = 0
      return
    }

    while (this.writeQueue.length > 0) {
      const pending = this.writeQueue[0]
      const result = await insertAIOSEventRow(this.toInsertRow(pending.event))

      if (result.ok) {
        this.persistenceMode = "online"
        this.writeQueue.shift()
        continue
      }

      pending.attempts += 1
      this.persistenceMode = "degraded"

      const message = result.error ?? "unknown persistence error"

      if (pending.attempts >= EventStore.MAX_WRITE_ATTEMPTS) {
        console.warn(
          `AIOS Memory Layer: dropping event ${pending.event.id} after ${pending.attempts} failed DB attempts (${message})`
        )
        this.writeQueue.shift()
        continue
      }

      console.warn(
        `AIOS Memory Layer: retrying event ${pending.event.id} DB write (attempt ${pending.attempts}) due to ${message}`
      )

      this.writeQueue.shift()
      this.writeQueue.push(pending)

      const backoffMs =
        EventStore.RETRY_BASE_DELAY_MS * Math.pow(2, pending.attempts - 1)
      this.scheduleFlush(backoffMs)
      return
    }
  }

  private toInsertRow(event: StoredEvent): AIOSEventInsertRow {
    return {
      id: event.id,
      type: event.type,
      timestamp: event.timestamp,
      context_id: event.contextId,
      payload: event.payload,
    }
  }

  private sortTimeline(events: StoredEvent[]): StoredEvent[] {
    return events.sort((a, b) => {
      if (a.timestamp === b.timestamp) {
        return a.storedAt - b.storedAt
      }
      return a.timestamp - b.timestamp
    })
  }

  private toStoredAt(createdAt: unknown): number {
    if (typeof createdAt !== "string") {
      return Date.now()
    }

    const parsed = new Date(createdAt).getTime()
    return Number.isFinite(parsed) ? parsed : Date.now()
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null
  }

  private isExecutionSource(
    value: unknown
  ): value is "user" | "system" | "orchestrator" {
    return value === "user" || value === "system" || value === "orchestrator"
  }

  private isStepStatus(
    value: unknown
  ): value is "pending" | "running" | "complete" | "failed" {
    return (
      value === "pending" ||
      value === "running" ||
      value === "complete" ||
      value === "failed"
    )
  }

  private isSeverity(value: unknown): value is "low" | "medium" | "critical" {
    return value === "low" || value === "medium" || value === "critical"
  }
}

export const eventStore = new EventStore()
