import type {
  AgentCardItem,
  AgentCollaborationHop,
  AgentDepartment,
  AgentEventRecord,
  AgentQueueTask,
  AgentWorkspaceFilters,
  AgentWorkspaceMetrics,
  DecisionRecord,
  MemoryRecord,
  QueueTaskStatus,
  ReasoningStage,
  ToolRecord,
} from "@/types"

const AGENT_BLUEPRINTS: Array<Pick<AgentCardItem, "id" | "name" | "avatar" | "department" | "objective" | "contextSummary" | "activeTools">> = [
  {
    id: "sales-agent",
    name: "Sales Agent",
    avatar: "SA",
    department: "sales",
    objective: "Identify and progress enterprise expansion opportunities.",
    contextSummary: "North America enterprise pipeline and expansion intent signals.",
    activeTools: ["CRM", "Email", "Calendar", "Knowledge Base"],
  },
  {
    id: "executive-agent",
    name: "Executive Agent",
    avatar: "EA",
    department: "executive",
    objective: "Generate executive-ready recommendations and briefings.",
    contextSummary: "Weekly board priorities and operational risk exposure.",
    activeTools: ["Knowledge Base", "Supabase", "API Gateway"],
  },
  {
    id: "operations-agent",
    name: "Operations Agent",
    avatar: "OA",
    department: "operations",
    objective: "Execute approved workflows and monitor delivery reliability.",
    contextSummary: "Workflow throughput and automation recovery pathways.",
    activeTools: ["API Gateway", "Filesystem", "Supabase"],
  },
  {
    id: "knowledge-agent",
    name: "Knowledge Agent",
    avatar: "KA",
    department: "knowledge",
    objective: "Continuously enrich retrieval quality for all agents.",
    contextSummary: "Knowledge graph freshness and semantic retrieval quality.",
    activeTools: ["Knowledge Base", "Web Search", "Supabase"],
  },
  {
    id: "support-agent",
    name: "Support Agent",
    avatar: "SU",
    department: "support",
    objective: "Prioritize escalations and reduce customer response risk.",
    contextSummary: "Customer escalations and sentiment variance across channels.",
    activeTools: ["Email", "Slack", "CRM"],
  },
  {
    id: "marketing-agent",
    name: "Marketing Agent",
    avatar: "MA",
    department: "marketing",
    objective: "Optimize campaign targeting and conversion efficiency.",
    contextSummary: "Campaign attribution and funnel friction indicators.",
    activeTools: ["CRM", "Web Search", "Supabase"],
  },
  {
    id: "finance-agent",
    name: "Finance Agent",
    avatar: "FA",
    department: "finance",
    objective: "Flag revenue risk and improve forecast confidence.",
    contextSummary: "Revenue variance, spend anomalies, and margin movement.",
    activeTools: ["Supabase", "API Gateway", "Knowledge Base"],
  },
  {
    id: "hr-agent",
    name: "HR Agent",
    avatar: "HR",
    department: "hr",
    objective: "Monitor organizational health and talent risk.",
    contextSummary: "Hiring velocity, retention risk, and team workload balance.",
    activeTools: ["Calendar", "Slack", "Knowledge Base"],
  },
  {
    id: "custom-agent",
    name: "Custom Agent",
    avatar: "CA",
    department: "custom",
    objective: "Execute custom workflows orchestrated by executive teams.",
    contextSummary: "User-defined operational automations and approval checkpoints.",
    activeTools: ["Filesystem", "API Gateway", "Web Search"],
  },
]

const TASK_VERBS = [
  "Evaluating",
  "Classifying",
  "Synchronizing",
  "Planning",
  "Validating",
  "Executing",
  "Monitoring",
]

const TASK_OBJECTS = [
  "enterprise opportunities",
  "memory snapshots",
  "workflow retries",
  "board priorities",
  "risk escalations",
  "knowledge references",
  "customer intents",
]

export const defaultAgentWorkspaceFilters: AgentWorkspaceFilters = {
  statuses: [],
  departments: [],
  confidenceMin: 0,
  onlyRunning: false,
  showCompleted: true,
  showFailed: true,
  priority: [],
  query: "",
}

export function createInitialAgents(): AgentCardItem[] {
  return AGENT_BLUEPRINTS.map((item, index) => ({
    ...item,
    status: index % 3 === 0 ? "running" : index % 5 === 0 ? "waiting" : "idle",
    currentTask: `${TASK_VERBS[index % TASK_VERBS.length]} ${TASK_OBJECTS[index % TASK_OBJECTS.length]}`,
    confidence: 78 + (index % 6) * 3,
    health: 74 + (index % 5) * 4,
    recentActivity: "Synchronized with runtime signal stream",
    unreadNotifications: index % 4,
    memoryUsage: 28 + index * 4,
    etaMinutes: 6 + index * 2,
  }))
}

export function createInitialReasoningTimeline(now = Date.now()): ReasoningStage[] {
  return [
    { id: "r1", label: "Received request", status: "completed", timestamp: now - 16000 },
    { id: "r2", label: "Loaded memory", status: "completed", timestamp: now - 14000 },
    { id: "r3", label: "Retrieved knowledge", status: "completed", timestamp: now - 12000 },
    { id: "r4", label: "Generated plan", status: "current", timestamp: now - 9000 },
    { id: "r5", label: "Validated", status: "pending", timestamp: now - 5000 },
    { id: "r6", label: "Executed", status: "pending", timestamp: now - 2000 },
    { id: "r7", label: "Stored memory", status: "pending", timestamp: now - 1000 },
    { id: "r8", label: "Completed", status: "pending", timestamp: now },
  ]
}

const QUEUE_COLUMNS: QueueTaskStatus[] = ["queued", "running", "waiting", "retrying", "failed", "completed"]

export function createInitialTasks(agentId: string): AgentQueueTask[] {
  const base = Date.now()
  return Array.from({ length: 14 }, (_, index) => ({
    id: `task-${agentId}-${index + 1}`,
    title: `Task ${index + 1}: ${TASK_OBJECTS[index % TASK_OBJECTS.length]}`,
    priority: index % 6 === 0 ? "critical" : index % 4 === 0 ? "high" : index % 3 === 0 ? "medium" : "low",
    status: QUEUE_COLUMNS[index % QUEUE_COLUMNS.length],
    updatedAt: base - index * 1800,
    ownerAgentId: agentId,
  }))
}

export function createInitialMemories(agentId: string): MemoryRecord[] {
  const now = Date.now()
  return [
    {
      id: `mem-${agentId}-1`,
      lane: "working",
      title: "Working memory: active opportunity cluster",
      summary: "Top 12 accounts prioritized by expansion confidence and urgency.",
      confidence: 86,
      source: "CRM",
      updatedAt: now - 6000,
    },
    {
      id: `mem-${agentId}-2`,
      lane: "long-term",
      title: "Long-term memory: executive preference profile",
      summary: "Preference for risk-adjusted recommendations before escalation.",
      confidence: 90,
      source: "Knowledge Base",
      updatedAt: now - 21000,
    },
    {
      id: `mem-${agentId}-3`,
      lane: "session",
      title: "Session memory: current objective framing",
      summary: "Focus on reducing decision latency across sales and operations.",
      confidence: 84,
      source: "Executive Workspace",
      updatedAt: now - 3200,
    },
    {
      id: `mem-${agentId}-4`,
      lane: "knowledge",
      title: "Knowledge references: policy constraints",
      summary: "Loaded relevant compliance and approval constraints.",
      confidence: 88,
      source: "Knowledge Graph",
      updatedAt: now - 11400,
    },
  ]
}

export function createInitialTools(): ToolRecord[] {
  const base: ToolRecord[] = [
    { id: "tool-crm", name: "CRM", status: "connected", latencyMs: 112, lastAction: "Synced account records" },
    { id: "tool-calendar", name: "Calendar", status: "connected", latencyMs: 84, lastAction: "Scheduled leadership review" },
    { id: "tool-email", name: "Email", status: "executing", latencyMs: 140, lastAction: "Classified inbound thread" },
    { id: "tool-slack", name: "Slack", status: "connected", latencyMs: 96, lastAction: "Posted team escalation" },
    { id: "tool-supabase", name: "Supabase", status: "connected", latencyMs: 78, lastAction: "Persisted runtime signal" },
    { id: "tool-knowledge", name: "Knowledge Base", status: "executing", latencyMs: 126, lastAction: "Retrieved playbook references" },
    { id: "tool-web", name: "Web Search", status: "connected", latencyMs: 220, lastAction: "Fetched market update" },
    { id: "tool-filesystem", name: "Filesystem", status: "connected", latencyMs: 66, lastAction: "Updated operational artifact" },
    { id: "tool-api", name: "API Gateway", status: "connected", latencyMs: 104, lastAction: "Triggered workflow endpoint" },
  ]

  return base
}

export function createInitialDecisions(agentId: string): DecisionRecord[] {
  const now = Date.now()
  return [
    {
      id: `dec-${agentId}-1`,
      title: "Customer classified as Enterprise",
      reason: "High expansion intent and contract growth probability",
      confidence: 91,
      timestamp: now - 5800,
      explanation: "The account crossed expansion thresholds in usage growth, stakeholder engagement, and budget allocation.",
    },
    {
      id: `dec-${agentId}-2`,
      title: "Priority elevated",
      reason: "Escalation risk exceeded policy threshold",
      confidence: 87,
      timestamp: now - 10500,
      explanation: "Support signal severity and delayed response indicators triggered automated priority escalation.",
    },
    {
      id: `dec-${agentId}-3`,
      title: "Revenue risk detected",
      reason: "Forecast variance and churn probability increased",
      confidence: 82,
      timestamp: now - 16300,
      explanation: "Forecast confidence dropped due to pipeline slippage and regional demand volatility.",
    },
  ]
}

export function createInitialEvents(agentId: string): AgentEventRecord[] {
  const now = Date.now()
  return [
    {
      id: `evt-${agentId}-1`,
      type: "thinking",
      title: "Agent reasoning",
      summary: "Correlating live runtime signals with objective constraints.",
      timestamp: now - 3900,
      agentId,
    },
    {
      id: `evt-${agentId}-2`,
      type: "memory-updated",
      title: "Memory updated",
      summary: "Session memory refreshed from latest executive signals.",
      timestamp: now - 6900,
      agentId,
    },
    {
      id: `evt-${agentId}-3`,
      type: "tool-executed",
      title: "Tool executed",
      summary: "CRM tool query executed successfully.",
      timestamp: now - 9800,
      agentId,
    },
  ]
}

export function createInitialCollaboration(): AgentCollaborationHop[] {
  return [
    { id: "c1", from: "Sales Agent", to: "Knowledge Agent", action: "Requests account context", status: "completed" },
    { id: "c2", from: "Knowledge Agent", to: "Executive Agent", action: "Supplies risk evidence", status: "active" },
    { id: "c3", from: "Executive Agent", to: "Operations Agent", action: "Approves response workflow", status: "pending" },
    { id: "c4", from: "Operations Agent", to: "Sales Agent", action: "Executes approved sequence", status: "pending" },
  ]
}

export function rotateReasoningStages(timeline: ReasoningStage[]): ReasoningStage[] {
  const currentIndex = timeline.findIndex((item) => item.status === "current")
  const nextIndex = currentIndex === -1 ? 0 : Math.min(timeline.length - 1, currentIndex + 1)

  return timeline.map((item, index) => {
    if (index < nextIndex) {
      return { ...item, status: "completed" }
    }

    if (index === nextIndex) {
      return { ...item, status: "current", timestamp: Date.now() }
    }

    return { ...item, status: "pending" }
  })
}

function shiftTaskStatus(status: QueueTaskStatus): QueueTaskStatus {
  const index = QUEUE_COLUMNS.indexOf(status)
  const next = (index + 1) % QUEUE_COLUMNS.length
  return QUEUE_COLUMNS[next]
}

export function cycleQueueTasks(tasks: AgentQueueTask[]): AgentQueueTask[] {
  return tasks.map((task) => {
    if (Math.random() < 0.4) {
      return task
    }

    return {
      ...task,
      status: shiftTaskStatus(task.status),
      updatedAt: Date.now(),
    }
  })
}

export function mutateAgents(agents: AgentCardItem[]): AgentCardItem[] {
  return agents.map((agent) => {
    const confidence = clamp(agent.confidence + randomDelta(3), 60, 98)
    const health = clamp(agent.health + randomDelta(4), 52, 99)
    const running = Math.random() > 0.45
    const status: AgentCardItem["status"] = running ? "running" : health < 64 ? "failed" : "waiting"

    return {
      ...agent,
      status,
      confidence,
      health,
      currentTask: `${TASK_VERBS[Math.floor(Math.random() * TASK_VERBS.length)]} ${TASK_OBJECTS[Math.floor(Math.random() * TASK_OBJECTS.length)]}`,
      recentActivity: status === "running" ? "Processing live objective" : status === "failed" ? "Retry required on recent task" : "Awaiting upstream dependency",
      unreadNotifications: clamp(agent.unreadNotifications + randomDelta(1), 0, 9),
      memoryUsage: clamp(agent.memoryUsage + randomDelta(3), 18, 92),
      etaMinutes: clamp(agent.etaMinutes + randomDelta(2), 2, 32),
    }
  })
}

export function mutateTools(tools: ToolRecord[]): ToolRecord[] {
  const statuses: ToolRecord["status"][] = ["connected", "executing", "connected", "disconnected", "error"]

  return tools.map((tool) => ({
    ...tool,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    latencyMs: clamp(tool.latencyMs + randomDelta(22), 44, 420),
  }))
}

export function appendDecision(decisions: DecisionRecord[], agentName: string): DecisionRecord[] {
  const id = `dec-${Date.now()}`
  const next: DecisionRecord = {
    id,
    title: `${agentName} updated decision priority`,
    reason: "Dynamic operational context changed",
    confidence: clamp(80 + randomDelta(6), 64, 98),
    timestamp: Date.now(),
    explanation: "Incoming signals altered expected outcome, so the decision policy reprioritized active execution.",
  }

  return [next, ...decisions].slice(0, 20)
}

export function appendEvent(events: AgentEventRecord[], agentId: string): AgentEventRecord[] {
  const types: AgentEventRecord["type"][] = ["thinking", "memory-updated", "task-completed", "decision-stored", "tool-executed"]
  const type = types[Math.floor(Math.random() * types.length)]

  const next: AgentEventRecord = {
    id: `evt-${Date.now()}`,
    type,
    title:
      type === "thinking"
        ? "Agent thinking"
        : type === "memory-updated"
          ? "Memory updated"
          : type === "task-completed"
            ? "Task completed"
            : type === "decision-stored"
              ? "Decision stored"
              : "Tool executed",
    summary: "Live runtime event synchronized in Agent Workspace.",
    timestamp: Date.now(),
    agentId,
  }

  return [next, ...events].slice(0, 120)
}

export function deriveMetrics(
  agents: AgentCardItem[],
  tasks: AgentQueueTask[],
  events: AgentEventRecord[],
  health: number,
  latencyMs: number
): AgentWorkspaceMetrics {
  const runningAgents = agents.filter((item) => item.status === "running").length
  const queuedTasks = tasks.filter((item) => item.status === "queued" || item.status === "waiting" || item.status === "retrying").length
  const averageConfidence =
    agents.length > 0
      ? Math.round(agents.reduce((sum, item) => sum + item.confidence, 0) / agents.length)
      : 0

  return {
    runningAgents,
    queuedTasks,
    averageConfidence,
    runtimeHealth: health,
    eventsPerSecond: Math.max(1, Math.min(24, Math.round(events.length / 20))),
    memorySizeMb: Math.round(agents.reduce((sum, item) => sum + item.memoryUsage, 0) * 1.6),
    latencyMs,
  }
}

export function filterAgents(agents: AgentCardItem[], filters: AgentWorkspaceFilters): AgentCardItem[] {
  const query = filters.query.trim().toLowerCase()

  return agents.filter((agent) => {
    if (filters.statuses.length > 0 && !filters.statuses.includes(agent.status)) {
      return false
    }

    if (filters.departments.length > 0 && !filters.departments.includes(agent.department)) {
      return false
    }

    if (filters.confidenceMin > 0 && agent.confidence < filters.confidenceMin) {
      return false
    }

    if (filters.onlyRunning && agent.status !== "running") {
      return false
    }

    if (!filters.showCompleted && agent.status === "completed") {
      return false
    }

    if (!filters.showFailed && agent.status === "failed") {
      return false
    }

    if (query.length > 0) {
      const haystack = `${agent.name} ${agent.currentTask} ${agent.recentActivity}`.toLowerCase()
      if (!haystack.includes(query)) {
        return false
      }
    }

    return true
  })
}

export function filterTasks(tasks: AgentQueueTask[], priorities: AgentWorkspaceFilters["priority"]): AgentQueueTask[] {
  if (priorities.length === 0) {
    return tasks
  }

  return tasks.filter((item) => priorities.includes(item.priority))
}

function randomDelta(span: number): number {
  return Math.round((Math.random() * 2 - 1) * span)
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function departmentLabel(value: AgentDepartment): string {
  return value.replace("-", " ")
}
