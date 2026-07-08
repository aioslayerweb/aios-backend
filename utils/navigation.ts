import type { WorkspaceItem, WorkspaceKey } from "@/types"

export const workspaceItems: WorkspaceItem[] = [
  { key: "home", title: "Home", href: "/app", shortcut: "G H", icon: "home" },
  { key: "executive", title: "Executive", href: "/app/executive", shortcut: "G E", icon: "executive" },
  { key: "corporate", title: "Corporate", href: "/app/corporate", shortcut: "G C", icon: "corporate" },
  { key: "sales", title: "Sales", href: "/sales", shortcut: "G S", icon: "sales" },
  { key: "knowledge", title: "Knowledge", href: "/app/knowledge", shortcut: "G K", icon: "knowledge" },
  { key: "memory", title: "Memory", href: "/app/memory", shortcut: "G M", icon: "memory" },
  { key: "agents", title: "Agents", href: "/app/agents", shortcut: "G A", icon: "agents" },
  { key: "governance", title: "Governance", href: "/app/governance", shortcut: "G V", icon: "governance" },
  { key: "decisions", title: "Decisions", href: "/app/decisions", shortcut: "G D", icon: "decisions" },
  { key: "integrations", title: "Integrations", href: "/app/integrations", shortcut: "G N", icon: "workflow" },
  { key: "prompt-os", title: "Prompt OS", href: "/app/prompt-os", shortcut: "G P", icon: "prompt" },
  { key: "workflows", title: "Workflows", href: "/app/workflows", shortcut: "G W", icon: "workflow" },
  { key: "orchestrator", title: "Orchestrator", href: "/app/orchestrator", shortcut: "G O", icon: "orchestrator" },
  { key: "planning", title: "Planning", href: "/app/planning", shortcut: "G L", icon: "planning" },
  { key: "insights", title: "Insights", href: "/insights", shortcut: "G I", icon: "insights" },
  { key: "reports", title: "Reports", href: "/app/reports", shortcut: "G R", icon: "reports" },
  { key: "settings", title: "Settings", href: "/settings", shortcut: "G ,", icon: "settings" },
]

export function getWorkspaceByKey(key: WorkspaceKey): WorkspaceItem | undefined {
  return workspaceItems.find((item) => item.key === key)
}
