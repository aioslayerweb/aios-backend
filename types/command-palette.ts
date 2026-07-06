export type CommandPaletteGroup =
  | "recent"
  | "suggestions"
  | "navigation"
  | "entities"
  | "commands"
  | "ai-suggestions"

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
}

export type CommandSearchResult = {
  item: CommandItem
  score: number
}
