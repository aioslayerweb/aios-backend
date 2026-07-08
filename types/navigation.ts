export type WorkspaceKey =
  | "home"
  | "executive"
  | "corporate"
  | "sales"
  | "knowledge"
  | "memory"
  | "agents"
  | "governance"
  | "integrations"
  | "decisions"
  | "prompt-os"
  | "workflows"
  | "orchestrator"
  | "planning"
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
    | "governance"
    | "decisions"
    | "prompt"
    | "workflow"
    | "orchestrator"
    | "planning"
    | "insights"
    | "reports"
    | "settings"
}
