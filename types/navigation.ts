export type WorkspaceKey =
  | "home"
  | "executive"
  | "corporate"
  | "sales"
  | "knowledge"
  | "memory"
  | "agents"
  | "insights"
  | "reports"
  | "settings"

export type WorkspaceItem = {
  key: WorkspaceKey
  title: string
  href: string
  shortcut: string
  icon:
    | "home"
    | "executive"
    | "corporate"
    | "sales"
    | "knowledge"
    | "memory"
    | "agents"
    | "insights"
    | "reports"
    | "settings"
}
