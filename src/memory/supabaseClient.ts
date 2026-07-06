import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

export const AIOS_EVENTS_TABLE = "aios_events" as const

export type PersistenceMode = "online" | "degraded" | "memory-only"

export type AIOSEventRow = {
  id: string
  type: string
  timestamp: number
  context_id: string
  payload: unknown
  created_at?: string
}

export type AIOSEventInsertRow = {
  id: string
  type: string
  timestamp: number
  context_id: string
  payload: unknown
}

export type AIOSEventRecord = {
  id: string
  type: string
  timestamp: number
  contextId: string
  payload: unknown
  createdAt?: string
}

export type EventRowFilters = {
  contextId?: string
  type?: string
}

export type PersistenceResult<T> = {
  ok: boolean
  data: T
  error?: string
}

type AiosSupabaseClient = SupabaseClient

export const AIOS_EVENTS_TABLE_MODEL = {
  table: AIOS_EVENTS_TABLE,
  fields: {
    id: "uuid primary key",
    type: "text",
    timestamp: "bigint",
    context_id: "text",
    payload: "jsonb",
    created_at: "timestamp default now()",
  },
} as const

let cachedClient: AiosSupabaseClient | null = null
let warnedMissingConfig = false
let persistenceMode: PersistenceMode = "memory-only"

function setPersistenceMode(mode: PersistenceMode): void {
  persistenceMode = mode
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

function errorMessage(value: unknown, fallback: string): string {
  return value instanceof Error ? value.message : fallback
}

export function getPersistenceMode(): PersistenceMode {
  return persistenceMode
}

export function isSupabaseConfigured(): boolean {
  return isNonEmptyString(supabaseUrl) && isNonEmptyString(supabaseAnonKey)
}

export function toAIOSEventInsertRow(record: AIOSEventRecord): AIOSEventInsertRow {
  return {
    id: record.id,
    type: record.type,
    timestamp: record.timestamp,
    context_id: record.contextId,
    payload: record.payload,
  }
}

export function toAIOSEventRecord(row: AIOSEventRow): AIOSEventRecord {
  return {
    id: row.id,
    type: row.type,
    timestamp: row.timestamp,
    contextId: row.context_id,
    payload: row.payload,
    createdAt: row.created_at,
  }
}

export function getSupabaseClient(): AiosSupabaseClient | null {
  if (cachedClient) {
    if (persistenceMode !== "online") {
      setPersistenceMode("online")
    }
    return cachedClient
  }

  if (!isSupabaseConfigured()) {
    if (!warnedMissingConfig) {
      warnedMissingConfig = true
      console.warn(
        "[AIOS Persistence] Supabase config missing; running in memory-only mode"
      )
    }
    setPersistenceMode("memory-only")
    return null
  }

  try {
    cachedClient = createClient(
      supabaseUrl as string,
      supabaseAnonKey as string,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    )
    setPersistenceMode("online")
    return cachedClient
  } catch (error) {
    console.warn(
      `[AIOS Persistence] Supabase initialization failed; fallback active (${errorMessage(
        error,
        "unknown initialization error"
      )})`
    )
    setPersistenceMode("degraded")
    cachedClient = null
    return null
  }
}

export async function insertAIOSEventRow(
  row: AIOSEventInsertRow
): Promise<PersistenceResult<null>> {
  const client = getSupabaseClient()
  if (!client) {
    return {
      ok: false,
      data: null,
      error: "Supabase client unavailable",
    }
  }

  try {
    const { error } = await client.from(AIOS_EVENTS_TABLE).insert(row)

    if (error) {
      setPersistenceMode("degraded")
      return {
        ok: false,
        data: null,
        error: error.message,
      }
    }

    setPersistenceMode("online")
    return {
      ok: true,
      data: null,
    }
  } catch (error) {
    setPersistenceMode("degraded")
    return {
      ok: false,
      data: null,
      error: errorMessage(error, "unknown insert error"),
    }
  }
}

export async function fetchAIOSEventRows(
  filters: EventRowFilters = {}
): Promise<PersistenceResult<AIOSEventRow[]>> {
  const client = getSupabaseClient()
  if (!client) {
    return {
      ok: false,
      data: [],
      error: "Supabase client unavailable",
    }
  }

  try {
    let query = client
      .from(AIOS_EVENTS_TABLE)
      .select("id, type, timestamp, context_id, payload, created_at")

    if (isNonEmptyString(filters.contextId)) {
      query = query.eq("context_id", filters.contextId)
    }

    if (isNonEmptyString(filters.type)) {
      query = query.eq("type", filters.type)
    }

    const { data, error } = await query.order("timestamp", { ascending: true })

    if (error) {
      setPersistenceMode("degraded")
      return {
        ok: false,
        data: [],
        error: error.message,
      }
    }

    const rows = Array.isArray(data) ? data : []
    setPersistenceMode("online")
    return {
      ok: true,
      data: rows,
    }
  } catch (error) {
    setPersistenceMode("degraded")
    return {
      ok: false,
      data: [],
      error: errorMessage(error, "unknown fetch error"),
    }
  }
}

export async function isSupabaseReady(): Promise<boolean> {
  const client = getSupabaseClient()
  if (!client) {
    return false
  }

  try {
    const { error } = await client.from(AIOS_EVENTS_TABLE).select("id").limit(1)
    if (error) {
      setPersistenceMode("degraded")
      return false
    }

    setPersistenceMode("online")
    return true
  } catch {
    setPersistenceMode("degraded")
    return false
  }
}

export function requireSupabaseClient(): AiosSupabaseClient {
  const client = getSupabaseClient()

  if (!client) {
    throw new Error("[AIOS Persistence] Supabase client not initialized")
  }

  return client
}