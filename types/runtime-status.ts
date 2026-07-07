export type RuntimeStatusLevel =
  | "healthy"
  | "active"
  | "warning"
  | "offline"
  | "degraded"
  | "error"
  | "synchronizing"
  | "unknown"

export type RuntimeDomainKey =
  | "ai-runtime"
  | "memory"
  | "agents"
  | "knowledge"
  | "automation"
  | "notifications"
  | "search"
  | "supabase"
  | "sync"
  | "background-jobs"
  | "api"
  | "overall-system"

export type RuntimeColorToken =
  | "semantic-success"
  | "semantic-info"
  | "semantic-warning"
  | "semantic-error"
  | "text-muted"

export type RuntimeModuleStatus = {
  key: RuntimeDomainKey
  name: string
  status: RuntimeStatusLevel
  label: string
  icon: string
  colorToken: RuntimeColorToken
  description: string
  timestamp: number
}

export type RuntimeConnectionState = "connected" | "disconnected" | "reconnecting" | "unknown"

export type RuntimeWebsocketState = {
  mode: "idle" | "connecting" | "connected" | "error"
  enabled: boolean
}

export type RuntimeStatusState = {
  overallHealth: RuntimeStatusLevel
  modules: RuntimeModuleStatus[]
  lastUpdated: number
  expanded: boolean
  connectionState: RuntimeConnectionState
  websocketState: RuntimeWebsocketState
}
