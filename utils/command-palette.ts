import type { CommandItem, CommandSearchResult } from "@/types"

export const defaultCommandItems: CommandItem[] = [
  {
    id: "nav-home",
    title: "Open Home",
    description: "Navigate to AIOS Home workspace",
    group: "navigation",
    type: "navigation",
    href: "/app",
    shortcut: "G H",
    keywords: ["home", "dashboard", "workspace"],
  },
  {
    id: "nav-executive",
    title: "Open Executive Dashboard",
    description: "Navigate to Executive workspace",
    group: "navigation",
    type: "navigation",
    href: "/app/executive",
    shortcut: "G E",
    keywords: ["executive", "dashboard", "leadership"],
  },
  {
    id: "nav-corporate",
    title: "Open Corporate Workspace",
    description: "Navigate to Corporate workspace",
    group: "navigation",
    type: "navigation",
    href: "/app/corporate",
    shortcut: "G C",
    keywords: ["corporate", "operations", "company"],
  },
  {
    id: "nav-sales",
    title: "Open Command Center",
    description: "Navigate to Command Center workspace",
    group: "navigation",
    type: "navigation",
    href: "/app/commands",
    shortcut: "G C",
    keywords: ["command", "operations", "workspace", "control"],
  },
  {
    id: "nav-intelligence",
    title: "Open Intelligence Center",
    description: "Navigate to Intelligence Center workspace",
    group: "navigation",
    type: "navigation",
    href: "/app/intelligence",
    shortcut: "G I",
    keywords: ["intelligence", "signals", "analytics"],
  },
  {
    id: "nav-integrations",
    title: "Open Integrations",
    description: "Navigate to Integrations workspace",
    group: "navigation",
    type: "navigation",
    href: "/app/integrations",
    shortcut: "G N",
    keywords: ["integrations", "connectors", "systems"],
  },
  {
    id: "nav-governance",
    title: "Open Governance",
    description: "Navigate to Governance workspace",
    group: "navigation",
    type: "navigation",
    href: "/app/governance",
    shortcut: "G V",
    keywords: ["governance", "policy", "risk"],
  },
  {
    id: "nav-prompt-os",
    title: "Open Prompt OS",
    description: "Navigate to Prompt OS workspace",
    group: "navigation",
    type: "navigation",
    href: "/app/prompt-os",
    shortcut: "G P",
    keywords: ["prompt", "prompt os", "templates"],
  },
  {
    id: "nav-decisions",
    title: "Open Decision Center",
    description: "Navigate to Decision Center workspace",
    group: "navigation",
    type: "navigation",
    href: "/app/decisions",
    shortcut: "G D",
    keywords: ["decision", "recommendation", "approvals"],
  },
  {
    id: "nav-knowledge",
    title: "Open Knowledge",
    description: "Navigate to Knowledge workspace",
    group: "navigation",
    type: "navigation",
    href: "/app/knowledge",
    shortcut: "G K",
    keywords: ["knowledge", "documents", "research"],
  },
  {
    id: "nav-memory",
    title: "Open Memory",
    description: "Navigate to Memory workspace",
    group: "navigation",
    type: "navigation",
    href: "/app/memory",
    shortcut: "G M",
    keywords: ["memory", "timeline", "history"],
  },
  {
    id: "nav-agents",
    title: "Open Agents",
    description: "Navigate to Agents workspace",
    group: "navigation",
    type: "navigation",
    href: "/app/agents",
    shortcut: "G A",
    keywords: ["agents", "automation", "workflows"],
    execute: { kind: "navigate", target: "/app/agents" },
  },
  {
    id: "nav-workflows",
    title: "Open Workflow Builder",
    description: "Navigate to Workflow Builder orchestration workspace",
    group: "navigation",
    type: "navigation",
    href: "/app/workflows",
    shortcut: "G W",
    keywords: ["workflow", "builder", "orchestration", "automation"],
    execute: { kind: "navigate", target: "/app/workflows" },
  },
  {
    id: "nav-orchestrator",
    title: "Open Multi-Agent Orchestrator",
    description: "Navigate to the multi-agent orchestration workspace",
    group: "navigation",
    type: "navigation",
    href: "/app/orchestrator",
    shortcut: "G O",
    keywords: ["orchestrator", "agents", "network", "runtime"],
    execute: { kind: "navigate", target: "/app/orchestrator" },
  },
  {
    id: "nav-planning",
    title: "Open Autonomous Planning Engine",
    description: "Navigate to the strategic planning workspace",
    group: "navigation",
    type: "navigation",
    href: "/app/planning",
    shortcut: "G L",
    keywords: ["planning", "strategy", "roadmap", "priority"],
    execute: { kind: "navigate", target: "/app/planning" },
  },
  {
    id: "nav-insights",
    title: "Open Activity",
    description: "Navigate to Activity workspace",
    group: "navigation",
    type: "navigation",
    href: "/app/activity",
    shortcut: "G T",
    keywords: ["activity", "timeline", "events"],
  },
  {
    id: "nav-activity-feed",
    title: "Open Universal Activity Feed",
    description: "Navigate to operational activity timeline",
    group: "navigation",
    type: "navigation",
    href: "/app/activity",
    shortcut: "G T",
    keywords: ["activity", "timeline", "history", "events", "feed"],
  },
  {
    id: "nav-reports",
    title: "Open Reports",
    description: "Navigate to Reports workspace",
    group: "navigation",
    type: "navigation",
    href: "/app/reports",
    shortcut: "G R",
    keywords: ["reports", "exports", "reporting"],
  },
  {
    id: "nav-settings",
    title: "Open Settings",
    description: "Navigate to Settings workspace",
    group: "navigation",
    type: "settings",
    href: "/app/settings",
    shortcut: "G ,",
    keywords: ["settings", "preferences", "config"],
    execute: { kind: "navigate", target: "/app/settings" },
  },
  {
    id: "nav-security",
    title: "Open Security",
    description: "Navigate to enterprise security and tenancy controls",
    group: "navigation",
    type: "navigation",
    href: "/app/security",
    shortcut: "G Y",
    keywords: ["security", "rbac", "tenant", "audit"],
    execute: { kind: "navigate", target: "/app/security" },
  },
  {
    id: "nav-mcp",
    title: "Open MCP Platform",
    description: "Navigate to Enterprise MCP host/server/gateway/registry foundation",
    group: "navigation",
    type: "navigation",
    href: "/app/mcp",
    shortcut: "G X",
    keywords: ["mcp", "gateway", "registry", "tools", "resources", "prompts"],
    execute: { kind: "navigate", target: "/app/mcp" },
  },
  {
    id: "nav-security-users",
    title: "Open Security Users",
    description: "Navigate to users in enterprise security workspace",
    group: "navigation",
    type: "navigation",
    href: "/app/security#users",
    shortcut: "S U",
    keywords: ["security", "users", "identity", "rbac"],
    execute: { kind: "navigate", target: "/app/security#users" },
  },
  {
    id: "nav-security-roles",
    title: "Open Security Roles",
    description: "Navigate to role and permission governance",
    group: "navigation",
    type: "navigation",
    href: "/app/security#roles",
    shortcut: "S R",
    keywords: ["security", "roles", "permissions", "authorization"],
    execute: { kind: "navigate", target: "/app/security#roles" },
  },
  {
    id: "nav-security-audit",
    title: "Open Security Audit",
    description: "Navigate to audit logs and compliance evidence",
    group: "navigation",
    type: "navigation",
    href: "/app/security#audit",
    shortcut: "S A",
    keywords: ["security", "audit", "compliance", "events"],
    execute: { kind: "navigate", target: "/app/security#audit" },
  },
  {
    id: "runtime-restart",
    title: "Restart Runtime",
    description: "Simulate runtime restart and module refresh",
    group: "runtime",
    type: "runtime",
    shortcut: "⌘ 1",
    keywords: ["runtime", "restart", "modules", "refresh"],
    execute: { kind: "runtime", target: "restart" },
  },
  {
    id: "runtime-pause",
    title: "Pause Runtime",
    description: "Pause non-critical runtime processing",
    group: "runtime",
    type: "runtime",
    shortcut: "⌘ 2",
    keywords: ["runtime", "pause", "queue"],
    execute: { kind: "runtime", target: "pause" },
  },
  {
    id: "runtime-resume",
    title: "Resume Runtime",
    description: "Resume runtime processing and synchronization",
    group: "runtime",
    type: "runtime",
    shortcut: "⌘ 3",
    keywords: ["runtime", "resume", "queue"],
    execute: { kind: "runtime", target: "resume" },
  },
  {
    id: "runtime-replay",
    title: "Replay Events",
    description: "Open activity replay perspective",
    group: "runtime",
    type: "execution",
    keywords: ["events", "replay", "timeline", "runtime"],
    execute: { kind: "execution", target: "replay-events" },
  },
  {
    id: "runtime-inspect-queue",
    title: "Inspect Queue",
    description: "Open runtime queue and execution state",
    group: "executions",
    type: "execution",
    keywords: ["queue", "inspect", "execution", "tasks"],
    execute: { kind: "execution", target: "inspect-queue" },
  },
  {
    id: "memory-search",
    title: "Search Memory",
    description: "Find memory entries, sessions, and context snapshots",
    group: "memory",
    type: "memory",
    keywords: ["memory", "search", "session", "history"],
    execute: { kind: "memory", target: "search" },
  },
  {
    id: "memory-recent",
    title: "Recent Memory",
    description: "Review recent memory updates",
    group: "memory",
    type: "memory",
    keywords: ["memory", "recent", "updates"],
    execute: { kind: "memory", target: "recent" },
  },
  {
    id: "memory-pinned",
    title: "Pinned Memory",
    description: "Review pinned long-term memory objects",
    group: "memory",
    type: "memory",
    keywords: ["memory", "pinned", "long-term"],
    execute: { kind: "memory", target: "pinned" },
  },
  {
    id: "knowledge-search",
    title: "Search Knowledge",
    description: "Search knowledge references and documents",
    group: "knowledge",
    type: "knowledge",
    keywords: ["knowledge", "documents", "search", "references"],
    execute: { kind: "knowledge", target: "search" },
  },
  {
    id: "knowledge-recent",
    title: "Recent Documents",
    description: "Open recent indexed knowledge documents",
    group: "knowledge",
    type: "knowledge",
    keywords: ["knowledge", "recent", "documents"],
    execute: { kind: "knowledge", target: "recent-documents" },
  },
  {
    id: "knowledge-pinned",
    title: "Pinned Documents",
    description: "Open pinned knowledge references",
    group: "knowledge",
    type: "knowledge",
    keywords: ["knowledge", "pinned", "documents"],
    execute: { kind: "knowledge", target: "pinned-documents" },
  },
  {
    id: "agent-launch-sales",
    title: "Launch Sales Agent",
    description: "Start Sales Agent execution",
    group: "agents",
    type: "agent",
    keywords: ["agent", "sales", "launch", "run"],
    execute: { kind: "agent", target: "launch-sales" },
  },
  {
    id: "agent-launch-executive",
    title: "Launch Executive Agent",
    description: "Start Executive Agent execution",
    group: "agents",
    type: "agent",
    keywords: ["agent", "executive", "launch", "run"],
    execute: { kind: "agent", target: "launch-executive" },
  },
  {
    id: "agent-launch-knowledge",
    title: "Launch Knowledge Agent",
    description: "Start Knowledge Agent execution",
    group: "agents",
    type: "agent",
    keywords: ["agent", "knowledge", "launch", "run"],
    execute: { kind: "agent", target: "launch-knowledge" },
  },
  {
    id: "agent-launch-operations",
    title: "Launch Operations Agent",
    description: "Start Operations Agent execution",
    group: "agents",
    type: "agent",
    keywords: ["agent", "operations", "launch", "run"],
    execute: { kind: "agent", target: "launch-operations" },
  },
  {
    id: "agent-launch-marketing",
    title: "Launch Marketing Agent",
    description: "Start Marketing Agent execution",
    group: "agents",
    type: "agent",
    keywords: ["agent", "marketing", "launch", "run"],
    execute: { kind: "agent", target: "launch-marketing" },
  },
  {
    id: "agent-pause",
    title: "Pause Agent",
    description: "Pause selected agent execution",
    group: "agents",
    type: "agent",
    keywords: ["agent", "pause"],
    execute: { kind: "agent", target: "pause" },
  },
  {
    id: "agent-restart",
    title: "Restart Agent",
    description: "Restart selected agent execution",
    group: "agents",
    type: "agent",
    keywords: ["agent", "restart"],
    execute: { kind: "agent", target: "restart" },
  },
  {
    id: "agent-inspect",
    title: "Inspect Agent",
    description: "Open selected agent workspace",
    group: "agents",
    type: "agent",
    keywords: ["agent", "inspect", "workspace"],
    execute: { kind: "navigate", target: "/app/agents" },
  },
  {
    id: "action-create-task",
    title: "Create Task",
    description: "Create a new operational task",
    group: "actions",
    type: "create",
    keywords: ["create", "task", "action"],
    execute: { kind: "action", target: "create-task" },
  },
  {
    id: "action-create-customer",
    title: "Create Customer",
    description: "Create a new customer record",
    group: "actions",
    type: "create",
    keywords: ["create", "customer", "account"],
    execute: { kind: "action", target: "create-customer" },
  },
  {
    id: "action-import-knowledge",
    title: "Import Knowledge",
    description: "Import documents into knowledge base",
    group: "actions",
    type: "create",
    keywords: ["import", "knowledge", "documents"],
    execute: { kind: "action", target: "import-knowledge" },
  },
  {
    id: "action-generate-report",
    title: "Generate Report",
    description: "Generate an executive report",
    group: "reports",
    type: "create",
    keywords: ["generate", "report", "executive"],
    execute: { kind: "action", target: "generate-report" },
  },
  {
    id: "action-run-workflow",
    title: "Run Workflow",
    description: "Run an approved autonomous workflow",
    group: "actions",
    type: "run",
    keywords: ["run", "workflow", "automation"],
    execute: { kind: "action", target: "run-workflow" },
  },
  {
    id: "action-create-workflow",
    title: "Create Workflow",
    description: "Open Workflow Builder and start a new workflow draft",
    group: "actions",
    type: "create",
    keywords: ["create", "workflow", "builder", "automation"],
    execute: { kind: "action", target: "create-workflow" },
  },
  {
    id: "sys-theme",
    title: "Theme",
    description: "Open theme controls",
    group: "system",
    type: "system",
    keywords: ["theme", "appearance"],
    execute: { kind: "system", target: "theme" },
  },
  {
    id: "sys-preferences",
    title: "Preferences",
    description: "Open user preferences",
    group: "settings",
    type: "settings",
    keywords: ["preferences", "settings"],
    execute: { kind: "navigate", target: "/app/settings" },
  },
  {
    id: "sys-logs",
    title: "Logs",
    description: "Open diagnostics logs",
    group: "system",
    type: "system",
    keywords: ["logs", "diagnostics", "developer"],
    execute: { kind: "system", target: "logs" },
  },
  {
    id: "sys-diagnostics",
    title: "Diagnostics",
    description: "Run diagnostics across runtime modules",
    group: "system",
    type: "system",
    keywords: ["diagnostics", "health", "runtime"],
    execute: { kind: "system", target: "diagnostics" },
  },
  {
    id: "entity-acme",
    title: "Go to Acme Ltd",
    description: "Open customer profile: Acme Ltd",
    group: "entities",
    type: "open",
    href: "/app/customers",
    keywords: ["acme", "customer", "company", "account"],
  },
  {
    id: "entity-globex",
    title: "Go to Globex Corp",
    description: "Open company profile: Globex Corp",
    group: "entities",
    type: "open",
    href: "/app/customers",
    keywords: ["globex", "company", "customer", "account"],
  },
  {
    id: "activity-open",
    title: "Open Activity",
    description: "Open universal live activity feed",
    group: "activity",
    type: "activity",
    href: "/app/activity",
    keywords: ["activity", "events", "recent activity"],
    execute: { kind: "navigate", target: "/app/activity" },
  },
  {
    id: "task-open",
    title: "Open Tasks",
    description: "Inspect active and queued tasks",
    group: "tasks",
    type: "open",
    href: "/app/actions",
    keywords: ["tasks", "queue", "actions"],
    execute: { kind: "navigate", target: "/app/actions" },
  },
  {
    id: "customer-open",
    title: "Open Customers",
    description: "Inspect customer workspace and accounts",
    group: "customers",
    type: "open",
    href: "/app/customers",
    keywords: ["customers", "accounts", "companies"],
    execute: { kind: "navigate", target: "/app/customers" },
  },
  {
    id: "report-open",
    title: "Open Reports",
    description: "Open reporting workspace",
    group: "reports",
    type: "open",
    href: "/app/reports",
    keywords: ["reports", "reporting", "exports"],
    execute: { kind: "navigate", target: "/app/reports" },
  },
  {
    id: "ai-summarize-activity",
    title: "Summarize today's activity",
    description: "Generate AI summary from live activity feed",
    group: "ai",
    type: "ai",
    keywords: ["summarize", "activity", "ai"],
    pinned: true,
    execute: { kind: "ai", target: "summarize-activity" },
  },
  {
    id: "ai-explain-execution",
    title: "Explain latest execution",
    description: "Explain most recent runtime execution",
    group: "ai",
    type: "ai",
    keywords: ["explain", "latest", "execution", "ai"],
    execute: { kind: "ai", target: "explain-execution" },
  },
  {
    id: "ai-find-customer-risk",
    title: "Find customer risk",
    description: "Analyze accounts for churn and expansion risk",
    group: "ai",
    type: "ai",
    keywords: ["find", "customer", "risk", "ai"],
    execute: { kind: "ai", target: "find-customer-risk" },
  },
  {
    id: "ai-search-company-knowledge",
    title: "Search company knowledge",
    description: "Retrieve contextual references from knowledge base",
    group: "ai",
    type: "ai",
    keywords: ["search", "company", "knowledge", "ai"],
    execute: { kind: "ai", target: "search-company-knowledge" },
  },
  {
    id: "ai-generate-executive-report",
    title: "Generate executive report",
    description: "Generate AI-based executive operations report",
    group: "ai",
    type: "ai",
    keywords: ["generate", "executive", "report", "ai"],
    execute: { kind: "ai", target: "generate-executive-report" },
  },
  {
    id: "ai-analyze-sales-pipeline",
    title: "Analyze sales pipeline",
    description: "Analyze opportunity momentum and conversion risk",
    group: "ai",
    type: "ai",
    keywords: ["analyze", "sales", "pipeline", "ai"],
    execute: { kind: "ai", target: "analyze-sales-pipeline" },
  },
  {
    id: "trend-agent-workspace",
    title: "Trending: Open Agent Workspace",
    description: "Popular action this hour",
    group: "trending",
    type: "navigation",
    href: "/app/agents",
    keywords: ["trending", "agents", "workspace"],
    execute: { kind: "navigate", target: "/app/agents" },
  },
  {
    id: "trend-runtime-panel",
    title: "Trending: Inspect Runtime",
    description: "Popular runtime operation",
    group: "trending",
    type: "runtime",
    keywords: ["trending", "runtime", "status"],
    execute: { kind: "runtime", target: "inspect" },
  },
]

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

function scoreMatch(item: CommandItem, query: string): number {
  if (!query) {
    return item.pinned ? 18 : 10
  }

  const normalizedQuery = normalize(query)
  const normalizedTitle = normalize(item.title)
  const normalizedDescription = normalize(item.description)
  const keywords = item.keywords.map(normalize)

  if (normalizedTitle === normalizedQuery) {
    return 120
  }

  let score = 0

  if (normalizedTitle.includes(normalizedQuery)) {
    score += 70
  }

  if (normalizedDescription.includes(normalizedQuery)) {
    score += 35
  }

  if (keywords.some((keyword) => keyword.includes(normalizedQuery))) {
    score += 45
  }

  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean)
  for (const token of queryTokens) {
    if (normalizedTitle.includes(token)) {
      score += 18
    }
    if (normalizedDescription.includes(token)) {
      score += 8
    }
    if (keywords.some((keyword) => keyword.includes(token))) {
      score += 12
    }
  }

  if (isFuzzySubsequence(normalizedQuery, normalizedTitle)) {
    score += 26
  }

  if (isFuzzySubsequence(normalizedQuery, item.keywords.join(" ").toLowerCase())) {
    score += 18
  }

  if (item.pinned) {
    score += 5
  }

  return score
}

export function searchCommandItems(items: CommandItem[], query: string): CommandSearchResult[] {
  return items
    .map((item) => ({ item, score: scoreMatch(item, query) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
}

export function toGroupLabel(group: CommandItem["group"]): string {
  switch (group) {
    case "recent":
      return "Recent"
    case "favorites":
      return "Favorites"
    case "trending":
      return "Trending"
    case "frequent":
      return "Frequently Used"
    case "suggestions":
      return "Suggestions"
    case "navigation":
      return "Navigation"
    case "runtime":
      return "Runtime"
    case "memory":
      return "Memory"
    case "knowledge":
      return "Knowledge"
    case "agents":
      return "Agents"
    case "actions":
      return "Actions"
    case "system":
      return "System"
    case "entities":
      return "Entities"
    case "tasks":
      return "Tasks"
    case "customers":
      return "Customers"
    case "reports":
      return "Reports"
    case "settings":
      return "Settings"
    case "executions":
      return "Executions"
    case "activity":
      return "Recent Activity"
    case "commands":
      return "Commands"
    case "ai":
      return "AI Commands"
    case "ai-suggestions":
      return "AI Suggestions"
    default:
      return "Results"
  }
}

function isFuzzySubsequence(query: string, target: string): boolean {
  if (!query) {
    return true
  }

  let qIndex = 0
  for (let tIndex = 0; tIndex < target.length; tIndex += 1) {
    if (query[qIndex] === target[tIndex]) {
      qIndex += 1
    }
    if (qIndex === query.length) {
      return true
    }
  }

  return false
}

export function getHighlightParts(text: string, query: string): Array<{ text: string; match: boolean }> {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return [{ text, match: false }]
  }

  const normalizedText = text.toLowerCase()
  const index = normalizedText.indexOf(normalizedQuery)

  if (index === -1) {
    return [{ text, match: false }]
  }

  const before = text.slice(0, index)
  const match = text.slice(index, index + normalizedQuery.length)
  const after = text.slice(index + normalizedQuery.length)

  return [
    ...(before ? [{ text: before, match: false }] : []),
    { text: match, match: true },
    ...(after ? [{ text: after, match: false }] : []),
  ]
}
