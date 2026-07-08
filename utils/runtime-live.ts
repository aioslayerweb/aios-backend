import type {
  ExecutionQueueItem,
  LiveAgent,
  MemoryUpdate,
  RuntimeEvent,
  RuntimeEventKind,
  RuntimeHealth,
} from "@/types"

const eventCatalog: Array<{
  kind: RuntimeEventKind
  title: string
  summary: string
  priority: RuntimeEvent["priority"]
  category: RuntimeEvent["category"]
}> = [
  {
    kind: "memory-updated",
    title: "Memory updated",
    summary: "Working memory synchronized with latest executive context.",
    priority: "medium",
    category: "memory",
  },
  {
    kind: "agent-executing",
    title: "Agent executing",
    summary: "Sales Agent moved to qualification reasoning stage.",
    priority: "medium",
    category: "agents",
  },
  {
    kind: "email-classified",
    title: "Email classified",
    summary: "New customer email classified as expansion opportunity.",
    priority: "low",
    category: "communications",
  },
  {
    kind: "priority-changed",
    title: "Priority changed",
    summary: "Enterprise escalation moved to high priority.",
    priority: "high",
    category: "tasks",
  },
  {
    kind: "task-completed",
    title: "Task completed",
    summary: "Executive approval task completed by operations lead.",
    priority: "medium",
    category: "tasks",
  },
  {
    kind: "crm-synchronized",
    title: "CRM synchronized",
    summary: "Pipeline and contact records synchronized successfully.",
    priority: "low",
    category: "crm",
  },
  {
    kind: "calendar-updated",
    title: "Calendar updated",
    summary: "New approval meeting added to executive timeline.",
    priority: "medium",
    category: "communications",
  },
  {
    kind: "knowledge-indexed",
    title: "Knowledge indexed",
    summary: "New briefing notes indexed into knowledge graph.",
    priority: "medium",
    category: "knowledge",
  },
  {
    kind: "decision-made",
    title: "Decision made",
    summary: "Budget reallocation approved for automation initiatives.",
    priority: "high",
    category: "system-events",
  },
  {
    kind: "execution-failed",
    title: "Execution failed",
    summary: "Workflow execution failed on external dependency timeout.",
    priority: "critical",
    category: "automations",
  },
  {
    kind: "execution-retried",
    title: "Execution retried",
    summary: "Failed execution retried and moved to running state.",
    priority: "high",
    category: "automations",
  },
]

export function getRuntimeTemplate(step: number) {
  return eventCatalog[step % eventCatalog.length]
}

export function createRuntimeEvent(step: number): RuntimeEvent {
  const template = getRuntimeTemplate(step)
  return {
    id: `rt-${Date.now()}-${step}`,
    kind: template.kind,
    title: template.title,
    summary: template.summary,
    timestamp: Date.now(),
    priority: template.priority,
    category: template.category,
  }
}

export function createInitialAgents(): LiveAgent[] {
  return [
    {
      id: "sales-agent",
      name: "Sales Agent",
      status: "running",
      currentTask: "Scoring expansion accounts",
      confidence: 86,
      reasoningStage: "Pattern correlation",
      progress: 44,
      etaSeconds: 210,
      recentActions: ["Loaded CRM signals", "Clustered account intent"],
    },
    {
      id: "executive-agent",
      name: "Executive Agent",
      status: "running",
      currentTask: "Generating leadership brief",
      confidence: 91,
      reasoningStage: "Narrative synthesis",
      progress: 58,
      etaSeconds: 160,
      recentActions: ["Compared weekly deltas", "Mapped risk posture"],
    },
    {
      id: "knowledge-agent",
      name: "Knowledge Agent",
      status: "idle",
      currentTask: "Awaiting indexing event",
      confidence: 88,
      reasoningStage: "Standby",
      progress: 0,
      etaSeconds: 0,
      recentActions: ["Last run completed"],
    },
    {
      id: "support-agent",
      name: "Support Agent",
      status: "running",
      currentTask: "Classifying escalations",
      confidence: 83,
      reasoningStage: "Intent classification",
      progress: 33,
      etaSeconds: 280,
      recentActions: ["Pulled ticket context", "Detected sentiment shift"],
    },
    {
      id: "operations-agent",
      name: "Operations Agent",
      status: "complete",
      currentTask: "Workflow audit completed",
      confidence: 89,
      reasoningStage: "Completed",
      progress: 100,
      etaSeconds: 0,
      recentActions: ["Validated execution graph", "Published report"],
    },
    {
      id: "finance-agent",
      name: "Finance Agent",
      status: "running",
      currentTask: "Forecast variance analysis",
      confidence: 84,
      reasoningStage: "Variance attribution",
      progress: 41,
      etaSeconds: 240,
      recentActions: ["Ingested spend data", "Detected variance hotspots"],
    },
  ]
}

export function createInitialExecutions(): ExecutionQueueItem[] {
  const now = Date.now()
  return [
    { id: "ex-1", label: "Executive briefing pipeline", status: "running", updatedAt: now },
    { id: "ex-2", label: "CRM nightly sync", status: "completed", updatedAt: now - 15_000 },
    { id: "ex-3", label: "Knowledge indexing batch", status: "queued", updatedAt: now - 9_000 },
    { id: "ex-4", label: "Customer risk scoring", status: "waiting", updatedAt: now - 4_000 },
    { id: "ex-5", label: "Automation recovery run", status: "retrying", updatedAt: now - 2_000 },
  ]
}

export function createInitialMemoryUpdates(): MemoryUpdate[] {
  return [
    {
      id: "mem-u1",
      title: "Session memory refreshed",
      lane: "session",
      summary: "Executive context updated with morning priorities.",
      timestamp: Date.now() - 20_000,
    },
    {
      id: "mem-u2",
      title: "Knowledge insertion",
      lane: "knowledge",
      summary: "Board prep notes indexed to long-term memory.",
      timestamp: Date.now() - 46_000,
    },
  ]
}

export function createInitialHealth(): RuntimeHealth {
  return {
    cpu: 42,
    memory: 58,
    aiConfidence: 88,
    executionSpeed: 92,
    queueHealth: 84,
    database: 95,
    supabase: 94,
    vectorSearch: 90,
    knowledgeIndex: 86,
    connection: 96,
    latencyMs: 182,
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function jitter(value: number, delta: number, min: number, max: number): number {
  const next = value + (Math.random() * 2 - 1) * delta
  return Math.round(clamp(next, min, max))
}

export function mutateHealth(prev: RuntimeHealth): RuntimeHealth {
  return {
    cpu: jitter(prev.cpu, 4, 18, 88),
    memory: jitter(prev.memory, 3, 25, 92),
    aiConfidence: jitter(prev.aiConfidence, 2, 70, 98),
    executionSpeed: jitter(prev.executionSpeed, 2, 70, 99),
    queueHealth: jitter(prev.queueHealth, 3, 60, 98),
    database: jitter(prev.database, 2, 75, 99),
    supabase: jitter(prev.supabase, 2, 74, 99),
    vectorSearch: jitter(prev.vectorSearch, 2, 68, 98),
    knowledgeIndex: jitter(prev.knowledgeIndex, 3, 65, 97),
    connection: jitter(prev.connection, 2, 75, 99),
    latencyMs: jitter(prev.latencyMs, 15, 90, 420),
  }
}

const stages = [
  "Signal ingest",
  "Context retrieval",
  "Reasoning",
  "Validation",
  "Synthesis",
  "Dispatch",
]

export function mutateAgents(prev: LiveAgent[]): LiveAgent[] {
  return prev.map((agent) => {
    const shouldRun = agent.status === "running" || Math.random() > 0.72
    if (!shouldRun) {
      return {
        ...agent,
        status: "idle",
        progress: 0,
        etaSeconds: 0,
        reasoningStage: "Standby",
      }
    }

    const nextProgress = agent.status === "running" ? Math.min(100, agent.progress + Math.ceil(Math.random() * 14)) : Math.ceil(Math.random() * 20)
    const completed = nextProgress >= 100

    return {
      ...agent,
      status: completed ? "complete" : "running",
      progress: completed ? 100 : nextProgress,
      confidence: jitter(agent.confidence, 2, 65, 98),
      reasoningStage: completed ? "Completed" : stages[Math.floor(Math.random() * stages.length)],
      etaSeconds: completed ? 0 : Math.max(25, agent.etaSeconds - Math.ceil(Math.random() * 35) + 20),
      recentActions: [
        `${new Date().toLocaleTimeString()} updated ${stages[Math.floor(Math.random() * stages.length)]}`,
        ...agent.recentActions,
      ].slice(0, 4),
    }
  })
}

const executionStatuses: ExecutionQueueItem["status"][] = ["queued", "running", "waiting", "completed", "failed", "retrying"]

export function mutateExecutions(prev: ExecutionQueueItem[]): ExecutionQueueItem[] {
  return prev.map((item, index) => {
    const nextStatus = executionStatuses[(executionStatuses.indexOf(item.status) + (Math.random() > 0.55 ? 1 : 0)) % executionStatuses.length]
    return {
      ...item,
      status: index === 0 ? "running" : nextStatus,
      updatedAt: Date.now(),
    }
  })
}

export function createMemoryUpdateFromEvent(event: RuntimeEvent): MemoryUpdate {
  return {
    id: `mem-${event.id}`,
    title: event.title,
    lane: event.kind === "knowledge-indexed" ? "knowledge" : event.kind === "memory-updated" ? "working" : "session",
    summary: event.summary,
    timestamp: event.timestamp,
  }
}
