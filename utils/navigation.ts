import type { WorkspaceItem, WorkspaceKey } from "@/types"

export const workspaceItems: WorkspaceItem[] = [
  { key: "home", title: "Home", href: "/app", shortcut: "G H", icon: "home" },
  { key: "executive", title: "Executive", href: "/app/executive", shortcut: "G E", icon: "executive" },
  { key: "corporate", title: "Corporate", href: "/app/corporate", shortcut: "G C", icon: "corporate" },
  { key: "sales", title: "Sales", href: "/sales", shortcut: "G S", icon: "sales" },
  { key: "knowledge", title: "Knowledge", href: "/app/knowledge", shortcut: "G K", icon: "knowledge" },
  { key: "memory", title: "Memory", href: "/app/memory", shortcut: "G M", icon: "memory" },
  { key: "agents", title: "Agents", href: "/agents", shortcut: "G A", icon: "agents" },
  { key: "insights", title: "Insights", href: "/insights", shortcut: "G I", icon: "insights" },
  { key: "reports", title: "Reports", href: "/app/reports", shortcut: "G R", icon: "reports" },
  { key: "settings", title: "Settings", href: "/settings", shortcut: "G ,", icon: "settings" },
]

export function getWorkspaceByKey(key: WorkspaceKey): WorkspaceItem | undefined {
  return workspaceItems.find((item) => item.key === key)
}
