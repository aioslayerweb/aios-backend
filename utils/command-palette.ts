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
    title: "Open Sales Workspace",
    description: "Navigate to Sales workspace",
    group: "navigation",
    type: "navigation",
    href: "/sales",
    shortcut: "G S",
    keywords: ["sales", "pipeline", "revenue"],
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
    href: "/agents",
    shortcut: "G A",
    keywords: ["agents", "automation", "workflows"],
  },
  {
    id: "nav-insights",
    title: "Open Insights",
    description: "Navigate to Insights workspace",
    group: "navigation",
    type: "navigation",
    href: "/insights",
    shortcut: "G I",
    keywords: ["insights", "analysis", "metrics"],
  },
  {
    id: "nav-activity-feed",
    title: "Open Universal Activity Feed",
    description: "Navigate to operational activity timeline",
    group: "navigation",
    type: "navigation",
    href: "/activity",
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
    href: "/settings",
    shortcut: "G ,",
    keywords: ["settings", "preferences", "config"],
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
    id: "cmd-priorities",
    title: "Show Today's Priorities",
    description: "Show priority tasks for today",
    group: "commands",
    type: "search",
    keywords: ["today", "priorities", "tasks", "focus"],
    pinned: true,
  },
  {
    id: "cmd-run-sales-agent",
    title: "Run Sales Agent",
    description: "Start the Sales Agent workflow",
    group: "commands",
    type: "agent",
    keywords: ["sales", "agent", "run", "workflow"],
    pinned: true,
  },
  {
    id: "cmd-search-memory-proposal",
    title: "Search Memory for Proposal",
    description: "Query memory for proposal-related context",
    group: "commands",
    type: "memory",
    keywords: ["memory", "search", "proposal", "context"],
  },
  {
    id: "cmd-open-projects",
    title: "Open Projects",
    description: "Open projects list",
    group: "commands",
    type: "open",
    href: "/app/actions",
    keywords: ["projects", "tasks", "actions"],
  },
  {
    id: "ai-ask",
    title: "Ask AI",
    description: "Open Ask AI prompt flow",
    group: "ai-suggestions",
    type: "ai",
    keywords: ["ask", "ai", "question"],
    pinned: true,
  },
  {
    id: "ai-summarise",
    title: "Summarise",
    description: "Summarise selected business context",
    group: "ai-suggestions",
    type: "ai",
    keywords: ["summarise", "summary", "ai"],
  },
  {
    id: "ai-explain",
    title: "Explain",
    description: "Explain a metric or recommendation",
    group: "ai-suggestions",
    type: "ai",
    keywords: ["explain", "analysis", "ai"],
  },
  {
    id: "ai-generate",
    title: "Generate",
    description: "Generate content or workflow draft",
    group: "ai-suggestions",
    type: "ai",
    keywords: ["generate", "draft", "ai"],
  },
  {
    id: "ai-execute",
    title: "Execute",
    description: "Execute a validated AI action",
    group: "ai-suggestions",
    type: "ai",
    keywords: ["execute", "run", "ai", "action"],
  },
  {
    id: "ai-analyse",
    title: "Analyse",
    description: "Run deeper business analysis",
    group: "ai-suggestions",
    type: "ai",
    keywords: ["analyse", "analysis", "ai", "insight"],
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
    case "suggestions":
      return "Suggestions"
    case "navigation":
      return "Navigation"
    case "entities":
      return "Entities"
    case "commands":
      return "Commands"
    case "ai-suggestions":
      return "AI Suggestions"
    default:
      return "Results"
  }
}
