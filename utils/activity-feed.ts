import type {
  ActivityCategory,
  ActivityDateFilter,
  ActivityFilter,
  ActivityGroup,
  ActivityGroupKey,
  ActivityItem,
  ActivityPriority,
  ActivityStatus,
  ActivityTimeline,
} from "@/types"

export const activityCategoryOptions: ActivityCategory[] = [
  "ai-runtime",
  "agents",
  "memory",
  "knowledge",
  "crm",
  "customers",
  "projects",
  "tasks",
  "communications",
  "reports",
  "notifications",
  "automations",
  "system-events",
  "plugins",
]

export const activityPriorityOptions: ActivityPriority[] = ["low", "medium", "high", "critical"]

export const activityStatusOptions: ActivityStatus[] = [
  "info",
  "success",
  "warning",
  "error",
  "running",
  "completed",
]

export const activityDateOptions: ActivityDateFilter[] = [
  "all",
  "today",
  "yesterday",
  "week",
  "earlier",
]

export const defaultActivityFilters: ActivityFilter = {
  category: [],
  workspace: [],
  priority: [],
  agent: [],
  date: "all",
  user: [],
  source: [],
  status: [],
  pinned: false,
  unread: false,
  query: "",
}

const minute = 60_000

function ago(minutesAgo: number): number {
  return Date.now() - minutesAgo * minute
}

function id(prefix: string, index: number): string {
  return `${prefix}-${index.toString().padStart(3, "0")}`
}

export function mockActivityFeed(): ActivityItem[] {
  const seed: ActivityItem[] = [
    {
      id: id("act", 1),
      title: "AI detected buying intent",
      summary: "Signal confidence crossed 92% after multi-touch engagement pattern.",
      timestamp: ago(9),
      category: "ai-runtime",
      source: { key: "ai-runtime", label: "AI Runtime", workspace: "Executive" },
      actor: { id: "ai-core", name: "AI Core", kind: "ai" },
      priority: "high",
      pinned: true,
      unread: true,
      metadata: {
        eventType: "AI Decision",
        workspace: "Executive",
        status: "success",
        relatedObjects: [{ type: "opportunity", id: "opp-482", label: "Northwind Expansion" }],
        tags: ["intent", "pipeline", "revenue"],
        details: "Weighted behavior model detected conversion signals in 3 channels.",
      },
      agent: "Revenue Agent",
      user: "Ava Chen",
    },
    {
      id: id("act", 2),
      title: "Priority increased",
      summary: "Opportunity priority changed from medium to high.",
      timestamp: ago(8),
      category: "crm",
      source: { key: "crm", label: "CRM", workspace: "Sales" },
      actor: { id: "agent-priority", name: "Priority Agent", kind: "agent" },
      priority: "high",
      pinned: false,
      unread: true,
      metadata: {
        eventType: "Priority Changed",
        workspace: "Sales",
        status: "running",
        relatedObjects: [{ type: "lead", id: "lead-992", label: "Helios Manufacturing" }],
        tags: ["priority", "sales"],
      },
      agent: "Priority Agent",
      user: "Ava Chen",
    },
    {
      id: id("act", 3),
      title: "Suggested response generated",
      summary: "AI composed a personalized follow-up draft for enterprise buyer.",
      timestamp: ago(7),
      category: "communications",
      source: { key: "communications", label: "Communications", workspace: "Sales" },
      actor: { id: "ai-comms", name: "AI Comms", kind: "ai" },
      priority: "medium",
      pinned: false,
      unread: true,
      metadata: {
        eventType: "AI Decision",
        workspace: "Sales",
        status: "completed",
        relatedObjects: [{ type: "email", id: "mail-1932", label: "Follow-up Draft" }],
        tags: ["email", "draft"],
      },
      agent: "Comms Agent",
      user: "Ava Chen",
    },
    {
      id: id("act", 4),
      title: "CRM updated",
      summary: "Timeline and account fields synced from activity processor.",
      timestamp: ago(5),
      category: "crm",
      source: { key: "crm", label: "CRM", workspace: "Corporate" },
      actor: { id: "sync-bot", name: "Sync Bot", kind: "service" },
      priority: "medium",
      pinned: false,
      unread: false,
      metadata: {
        eventType: "Customer Updated",
        workspace: "Corporate",
        status: "success",
        relatedObjects: [{ type: "customer", id: "cust-19", label: "Northwind" }],
        tags: ["sync", "crm"],
      },
      user: "System",
    },
    {
      id: id("act", 5),
      title: "Task assigned",
      summary: "Outbound follow-up task assigned to account executive.",
      timestamp: ago(4),
      category: "tasks",
      source: { key: "tasks", label: "Tasks", workspace: "Sales" },
      actor: { id: "task-router", name: "Task Router", kind: "service" },
      priority: "high",
      pinned: false,
      unread: true,
      metadata: {
        eventType: "Task Created",
        workspace: "Sales",
        status: "running",
        relatedObjects: [{ type: "task", id: "task-745", label: "Call CFO" }],
        tags: ["task", "assignment"],
      },
      user: "Nina Park",
    },
    {
      id: id("act", 6),
      title: "Manager notified",
      summary: "Sales manager notified with confidence notes and risk score.",
      timestamp: ago(2),
      category: "notifications",
      source: { key: "notifications", label: "Notification Center", workspace: "Executive" },
      actor: { id: "system-notify", name: "System Notifications", kind: "system" },
      priority: "medium",
      pinned: false,
      unread: true,
      metadata: {
        eventType: "Warning",
        workspace: "Executive",
        status: "info",
        relatedObjects: [{ type: "notification", id: "notif-311", label: "Manager Alert" }],
        tags: ["manager", "alert"],
      },
      user: "Executive",
    },
    {
      id: id("act", 7),
      title: "Opportunity created",
      summary: "AIOS created opportunity from validated intent and CRM evidence.",
      timestamp: ago(1),
      category: "projects",
      source: { key: "projects", label: "Projects", workspace: "Sales" },
      actor: { id: "oppty-agent", name: "Pipeline Agent", kind: "agent" },
      priority: "critical",
      pinned: true,
      unread: true,
      metadata: {
        eventType: "Lead Created",
        workspace: "Sales",
        status: "success",
        relatedObjects: [{ type: "opportunity", id: "opp-482", label: "Northwind Expansion" }],
        tags: ["opportunity", "sales", "pipeline"],
        replayToken: "replay-opp-482",
      },
      agent: "Pipeline Agent",
      user: "Nina Park",
    },
  ]

  const additional: ActivityItem[] = [
    {
      id: id("act", 8),
      title: "Memory stored from onboarding call",
      summary: "Customer objection patterns and procurement timeline persisted.",
      timestamp: ago(94),
      category: "memory",
      source: { key: "memory", label: "Memory", workspace: "Knowledge" },
      actor: { id: "memory-engine", name: "Memory Engine", kind: "service" },
      priority: "medium",
      pinned: false,
      unread: false,
      metadata: {
        eventType: "Memory Stored",
        workspace: "Knowledge",
        status: "success",
        relatedObjects: [{ type: "memory", id: "mem-112", label: "Northwind Objections" }],
        tags: ["memory", "context"],
      },
      user: "Mira Stone",
    },
    {
      id: id("act", 9),
      title: "Agent Started: Churn Sentinel",
      summary: "Health-monitor workflow launched for top 20 accounts.",
      timestamp: ago(140),
      category: "agents",
      source: { key: "agents", label: "Agents", workspace: "Executive" },
      actor: { id: "agent-orchestrator", name: "Agent Orchestrator", kind: "system" },
      priority: "high",
      pinned: false,
      unread: false,
      metadata: {
        eventType: "Agent Started",
        workspace: "Executive",
        status: "running",
        relatedObjects: [{ type: "agent", id: "agent-15", label: "Churn Sentinel" }],
        tags: ["agent", "monitoring"],
      },
      agent: "Churn Sentinel",
      user: "Executive",
    },
    {
      id: id("act", 10),
      title: "Agent Finished: Renewal Optimizer",
      summary: "Proposed pricing adjustments delivered with confidence matrix.",
      timestamp: ago(210),
      category: "agents",
      source: { key: "agents", label: "Agents", workspace: "Executive" },
      actor: { id: "renewal-agent", name: "Renewal Optimizer", kind: "agent" },
      priority: "medium",
      pinned: false,
      unread: false,
      metadata: {
        eventType: "Agent Finished",
        workspace: "Executive",
        status: "completed",
        relatedObjects: [{ type: "brief", id: "brief-72", label: "Renewal Strategy Brief" }],
        tags: ["agent", "renewal"],
      },
      agent: "Renewal Optimizer",
      user: "Ava Chen",
    },
    {
      id: id("act", 11),
      title: "Report generated: Executive daily brief",
      summary: "Daily cross-functional summary generated and distributed.",
      timestamp: ago(820),
      category: "reports",
      source: { key: "reports", label: "Reports", workspace: "Executive" },
      actor: { id: "report-engine", name: "Report Engine", kind: "service" },
      priority: "low",
      pinned: false,
      unread: false,
      metadata: {
        eventType: "Report Generated",
        workspace: "Executive",
        status: "success",
        relatedObjects: [{ type: "report", id: "rep-202", label: "Executive Daily Brief" }],
        tags: ["report", "briefing"],
      },
      user: "Executive",
    },
    {
      id: id("act", 12),
      title: "Knowledge graph updated",
      summary: "Merged duplicate concepts and refreshed confidence edges.",
      timestamp: ago(1540),
      category: "knowledge",
      source: { key: "knowledge", label: "Knowledge", workspace: "Knowledge" },
      actor: { id: "knowledge-agent", name: "Knowledge Agent", kind: "agent" },
      priority: "medium",
      pinned: false,
      unread: false,
      metadata: {
        eventType: "Knowledge Updated",
        workspace: "Knowledge",
        status: "success",
        relatedObjects: [{ type: "graph", id: "kg-10", label: "Sales Signals Ontology" }],
        tags: ["knowledge", "ontology"],
      },
      agent: "Knowledge Agent",
      user: "Mira Stone",
    },
    {
      id: id("act", 13),
      title: "Automation executed: invoice follow-up",
      summary: "Workflow sent reminders for overdue enterprise invoices.",
      timestamp: ago(3000),
      category: "automations",
      source: { key: "automations", label: "Automations", workspace: "Corporate" },
      actor: { id: "workflow-runner", name: "Workflow Runner", kind: "service" },
      priority: "medium",
      pinned: false,
      unread: false,
      metadata: {
        eventType: "Automation Executed",
        workspace: "Corporate",
        status: "completed",
        relatedObjects: [{ type: "workflow", id: "wf-209", label: "Invoice Follow-up" }],
        tags: ["automation", "finance"],
      },
      user: "Ops Lead",
    },
    {
      id: id("act", 14),
      title: "System connected to Supabase",
      summary: "Connection restored after transient network interruption.",
      timestamp: ago(4300),
      category: "system-events",
      source: { key: "system", label: "System", workspace: "Platform" },
      actor: { id: "runtime-monitor", name: "Runtime Monitor", kind: "system" },
      priority: "high",
      pinned: false,
      unread: false,
      metadata: {
        eventType: "System Connected",
        workspace: "Platform",
        status: "success",
        relatedObjects: [{ type: "connection", id: "supabase", label: "Supabase Primary" }],
        tags: ["system", "connectivity"],
      },
      user: "System",
    },
    {
      id: id("act", 15),
      title: "Warning: memory freshness behind target",
      summary: "Memory sync lag exceeded configured threshold for 4 minutes.",
      timestamp: ago(5300),
      category: "memory",
      source: { key: "memory", label: "Memory", workspace: "Knowledge" },
      actor: { id: "memory-watchdog", name: "Memory Watchdog", kind: "service" },
      priority: "critical",
      pinned: true,
      unread: false,
      metadata: {
        eventType: "Warning",
        workspace: "Knowledge",
        status: "warning",
        relatedObjects: [{ type: "memory", id: "mem-health", label: "Memory Health" }],
        tags: ["warning", "memory"],
      },
      user: "System",
    },
    {
      id: id("act", 16),
      title: "Error: email processor timeout",
      summary: "Comms queue retried automatically after transient provider timeout.",
      timestamp: ago(6100),
      category: "communications",
      source: { key: "communications", label: "Communications", workspace: "Sales" },
      actor: { id: "email-processor", name: "Email Processor", kind: "service" },
      priority: "high",
      pinned: false,
      unread: false,
      metadata: {
        eventType: "Error",
        workspace: "Sales",
        status: "error",
        relatedObjects: [{ type: "queue", id: "mail-q", label: "Outbound Queue" }],
        tags: ["error", "communications"],
      },
      user: "System",
    },
  ]

  return [...seed, ...additional].sort((left, right) => right.timestamp - left.timestamp)
}

export function activityLevelTone(status: ActivityStatus): "info" | "success" | "warning" | "error" {
  if (status === "error") {
    return "error"
  }

  if (status === "warning") {
    return "warning"
  }

  if (status === "success" || status === "completed") {
    return "success"
  }

  return "info"
}

function dateFilterMatch(timestamp: number, date: ActivityDateFilter): boolean {
  if (date === "all") {
    return true
  }

  const now = new Date()
  const eventDate = new Date(timestamp)

  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const yesterdayStart = dayStart - 24 * 60 * 60 * 1000
  const weekStart = dayStart - 7 * 24 * 60 * 60 * 1000

  if (date === "today") {
    return timestamp >= dayStart
  }

  if (date === "yesterday") {
    return timestamp >= yesterdayStart && timestamp < dayStart
  }

  if (date === "week") {
    return timestamp >= weekStart && timestamp < yesterdayStart
  }

  return timestamp < weekStart
}

function includesValue(collection: string[], value?: string): boolean {
  if (collection.length === 0) {
    return true
  }

  if (!value) {
    return false
  }

  return collection.includes(value)
}

export function applyActivityFilters(items: ActivityItem[], filters: ActivityFilter): ActivityItem[] {
  const query = filters.query.trim().toLowerCase()

  return items.filter((item) => {
    if (filters.category.length > 0 && !filters.category.includes(item.category)) {
      return false
    }

    if (!includesValue(filters.workspace, item.metadata.workspace)) {
      return false
    }

    if (filters.priority.length > 0 && !filters.priority.includes(item.priority)) {
      return false
    }

    if (!includesValue(filters.agent, item.agent)) {
      return false
    }

    if (!dateFilterMatch(item.timestamp, filters.date)) {
      return false
    }

    if (!includesValue(filters.user, item.user)) {
      return false
    }

    if (filters.source.length > 0 && !filters.source.includes(item.source.key)) {
      return false
    }

    if (filters.status.length > 0 && !filters.status.includes(item.metadata.status)) {
      return false
    }

    if (filters.pinned && !item.pinned) {
      return false
    }

    if (filters.unread && !item.unread) {
      return false
    }

    if (!query) {
      return true
    }

    const haystacks = [
      item.title,
      item.summary,
      item.source.label,
      item.actor.name,
      item.metadata.eventType,
      item.metadata.details ?? "",
      item.metadata.tags.join(" "),
      item.metadata.relatedObjects.map((value) => value.label).join(" "),
    ]

    return haystacks.some((value) => value.toLowerCase().includes(query))
  })
}

export function groupActivitiesByTime(items: ActivityItem[]): ActivityGroup[] {
  const now = new Date()
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const yesterdayStart = dayStart - 24 * 60 * 60 * 1000
  const weekStart = dayStart - 7 * 24 * 60 * 60 * 1000

  const buckets: Record<ActivityGroupKey, ActivityItem[]> = {
    today: [],
    yesterday: [],
    "this-week": [],
    earlier: [],
  }

  for (const item of items) {
    if (item.timestamp >= dayStart) {
      buckets.today.push(item)
      continue
    }

    if (item.timestamp >= yesterdayStart) {
      buckets.yesterday.push(item)
      continue
    }

    if (item.timestamp >= weekStart) {
      buckets["this-week"].push(item)
      continue
    }

    buckets.earlier.push(item)
  }

  const groups: ActivityGroup[] = [
    {
      key: "today",
      label: "Today",
      items: buckets.today,
      count: buckets.today.length,
      startTimestamp: dayStart,
      endTimestamp: Date.now(),
    },
    {
      key: "yesterday",
      label: "Yesterday",
      items: buckets.yesterday,
      count: buckets.yesterday.length,
      startTimestamp: yesterdayStart,
      endTimestamp: dayStart,
    },
    {
      key: "this-week",
      label: "This Week",
      items: buckets["this-week"],
      count: buckets["this-week"].length,
      startTimestamp: weekStart,
      endTimestamp: yesterdayStart,
    },
    {
      key: "earlier",
      label: "Earlier",
      items: buckets.earlier,
      count: buckets.earlier.length,
      startTimestamp: 0,
      endTimestamp: weekStart,
    },
  ]

  return groups.filter((group) => group.count > 0)
}

export function buildActivityTimeline(allItems: ActivityItem[], filteredItems: ActivityItem[]): ActivityTimeline {
  return {
    groups: groupActivitiesByTime(filteredItems),
    total: allItems.length,
    filtered: filteredItems.length,
  }
}

export function formatActivityTime(timestamp: number): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp))
}

export function formatActivityDate(timestamp: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp))
}
