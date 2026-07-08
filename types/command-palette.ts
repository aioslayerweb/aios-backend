export type CommandPaletteGroup =
  | "recent"
  | "favorites"
  | "trending"
  | "frequent"
  | "suggestions"
  | "navigation"
  | "runtime"
  | "memory"
  | "knowledge"
  | "agents"
  | "actions"
  | "system"
  | "entities"
  | "tasks"
  | "customers"
  | "reports"
  | "settings"
  | "executions"
  | "activity"
  | "commands"
  | "ai-suggestions"
  | "ai"

export type CommandType =
  | "navigation"
  | "create"
  | "search"
  | "run"
  | "open"
  | "ai"
  | "memory"
  | "agent"
  | "settings"
  | "runtime"
  | "knowledge"
  | "execution"
  | "activity"
  | "system"

export type CommandExecutionKind =
  | "navigate"
  | "runtime"
  | "agent"
  | "memory"
  | "knowledge"
  | "activity"
  | "execution"
  | "action"
  | "system"
  | "ai"
  | "modal"

export type CommandExecution = {
  kind: CommandExecutionKind
  target: string
  payload?: Record<string, string | number | boolean>
}

export type CommandItem = {
  id: string
  title: string
  description: string
  group: CommandPaletteGroup
  type: CommandType
  keywords: string[]
  href?: string
  shortcut?: string
  pinned?: boolean
  execute?: CommandExecution
}

export type CommandSearchResult = {
  item: CommandItem
  score: number
}

export type CommandHistoryEntry = {
  commandId: string
  usedAt: number
  query: string
}

export type GroupedCommandSection = {
  group: CommandPaletteGroup
  items: CommandItem[]
}
