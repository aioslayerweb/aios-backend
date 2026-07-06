import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export type BrowserSupabaseClient = SupabaseClient

let cachedClient: BrowserSupabaseClient | null = null

export function isSupabaseBrowserConfigured(): boolean {
  return typeof supabaseUrl === "string" && typeof supabaseAnonKey === "string"
}

export function getBrowserSupabaseClient(): BrowserSupabaseClient | null {
  if (cachedClient) {
    return cachedClient
  }

  if (!isSupabaseBrowserConfigured()) {
    return null
  }

  cachedClient = createClient(supabaseUrl as string, supabaseAnonKey as string, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

  return cachedClient
}

// Backward compatibility for existing callers.
export const supabase = getBrowserSupabaseClient()

export type Database = {
  public: {
    Tables: {
      kpi_metrics: {
        Row: {
          id: string
          metric_name: string
          value: number
          change_percent: number
          period: string
          created_at: string
        }
        Insert: {
          id?: string
          metric_name: string
          value: number
          change_percent: number
          period: string
          created_at?: string
        }
      }
      ai_insights: {
        Row: {
          id: string
          title: string
          body: string
          action_label: string
          action_type: string
          priority: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          body: string
          action_label: string
          action_type: string
          priority?: string
          is_active?: boolean
          created_at?: string
        }
      }
    }
  }
}
