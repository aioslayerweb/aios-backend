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
  { key: "mcp", title: "MCP Platform", href: "/app/mcp", shortcut: "G X", icon: "mcp" },
  { key: "mcp-registry", title: "MCP Registry", href: "/app/mcp#registry", shortcut: "M R", icon: "mcp-registry" },
  { key: "mcp-tools", title: "MCP Tools", href: "/app/mcp#tools", shortcut: "M T", icon: "mcp-tools" },
  { key: "mcp-resources", title: "MCP Resources", href: "/app/mcp#resources", shortcut: "M S", icon: "mcp-resources" },
  { key: "mcp-prompts", title: "MCP Prompts", href: "/app/mcp#prompts", shortcut: "M P", icon: "mcp-prompts" },
  { key: "mcp-health", title: "MCP Health", href: "/app/mcp#health", shortcut: "M H", icon: "mcp-health" },
  { key: "mcp-gateway", title: "MCP Gateway", href: "/app/mcp#gateway", shortcut: "M G", icon: "mcp-gateway" },
  { key: "security", title: "Security", href: "/app/security", shortcut: "G Y", icon: "security" },
  { key: "organizations", title: "Organizations", href: "/app/security#organizations", shortcut: "S O", icon: "organizations" },
  { key: "users", title: "Users", href: "/app/security#users", shortcut: "S U", icon: "users" },
  { key: "teams", title: "Teams", href: "/app/security#teams", shortcut: "S T", icon: "teams" },
  { key: "roles", title: "Roles", href: "/app/security#roles", shortcut: "S R", icon: "roles" },
  { key: "permissions", title: "Permissions", href: "/app/security#permissions", shortcut: "S P", icon: "permissions" },
  { key: "audit", title: "Audit", href: "/app/security#audit", shortcut: "S A", icon: "audit" },
  { key: "api-keys", title: "API Keys", href: "/app/security#api-keys", shortcut: "S K", icon: "api-keys" },
  { key: "settings", title: "Settings", href: "/settings", shortcut: "G ,", icon: "settings" },
]

export function getWorkspaceByKey(key: WorkspaceKey): WorkspaceItem | undefined {
  return workspaceItems.find((item) => item.key === key)
}
