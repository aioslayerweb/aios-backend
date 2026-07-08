import type {
  OrchestratorAgentNode,
  OrchestratorCommunicationMessage,
  OrchestratorDepartment,
  OrchestratorExecutionItem,
  OrchestratorExecutionStatus,
  OrchestratorFilterState,
  OrchestratorMemorySync,
  OrchestratorMetric,
  OrchestratorState,
  OrchestratorTimelineEvent,
} from "@/types"

const departmentCatalog: Array<{
  id: string
  name: string
  department: OrchestratorDepartment
  status: OrchestratorAgentNode["status"]
  currentTask: string
  confidence: number
  memoryUsage: number
  eventsProcessed: number
  lastAction: string
  cpu: number
  latencyMs: number
  availability: number
  heartbeat: string
  x: number
  y: number
}> = [
  { id: "executive-agent", name: "Executive Agent", department: "executive", status: "coordinating", currentTask: "Synthesizing leadership recommendations", confidence: 94, memoryUsage: 42, eventsProcessed: 128, lastAction: "Approved recommendation", cpu: 22, latencyMs: 84, availability: 99, heartbeat: "2s ago", x: 140, y: 90 },
  { id: "sales-agent", name: "Sales Agent", department: "sales", status: "running", currentTask: "Qualifying expansion opportunities", confidence: 88, memoryUsage: 51, eventsProcessed: 174, lastAction: "Refined pipeline score", cpu: 31, latencyMs: 96, availability: 97, heartbeat: "1s ago", x: 360, y: 40 },
  { id: "support-agent", name: "Support Agent", department: "support", status: "waiting", currentTask: "Triaging customer escalations", confidence: 85, memoryUsage: 38, eventsProcessed: 96, lastAction: "Escalated incident", cpu: 26, latencyMs: 112, availability: 95, heartbeat: "3s ago", x: 580, y: 110 },
  { id: "operations-agent", name: "Operations Agent", department: "operations", status: "coordinating", currentTask: "Coordinating execution pipeline", confidence: 91, memoryUsage: 46, eventsProcessed: 203, lastAction: "Merged workflow branch", cpu: 29, latencyMs: 88, availability: 98, heartbeat: "2s ago", x: 260, y: 230 },
  { id: "finance-agent", name: "Finance Agent", department: "finance", status: "thinking", currentTask: "Monitoring forecast variance", confidence: 89, memoryUsage: 33, eventsProcessed: 110, lastAction: "Updated forecast", cpu: 24, latencyMs: 104, availability: 96, heartbeat: "2s ago", x: 500, y: 250 },
  { id: "knowledge-agent", name: "Knowledge Agent", department: "knowledge", status: "running", currentTask: "Indexing references and memory", confidence: 97, memoryUsage: 58, eventsProcessed: 245, lastAction: "Stored knowledge signal", cpu: 18, latencyMs: 72, availability: 100, heartbeat: "1s ago", x: 740, y: 80 },
  { id: "research-agent", name: "Research Agent", department: "research", status: "idle", currentTask: "Exploring external evidence", confidence: 86, memoryUsage: 31, eventsProcessed: 88, lastAction: "Retrieved source material", cpu: 21, latencyMs: 118, availability: 94, heartbeat: "4s ago", x: 920, y: 220 },
  { id: "marketing-agent", name: "Marketing Agent", department: "marketing", status: "waiting", currentTask: "Orchestrating campaign actions", confidence: 84, memoryUsage: 36, eventsProcessed: 102, lastAction: "Queued outreach branch", cpu: 25, latencyMs: 109, availability: 95, heartbeat: "2s ago", x: 1120, y: 120 },
  { id: "memory-agent", name: "Memory Agent", department: "memory", status: "running", currentTask: "Synchronizing shared context", confidence: 98, memoryUsage: 66, eventsProcessed: 266, lastAction: "Committed replay event", cpu: 17, latencyMs: 68, availability: 100, heartbeat: "1s ago", x: 1220, y: 280 },
  { id: "planner-agent", name: "Planner Agent", department: "planner", status: "coordinating", currentTask: "Constructing execution routes", confidence: 93, memoryUsage: 44, eventsProcessed: 151, lastAction: "Replanned dependency chain", cpu: 23, latencyMs: 91, availability: 99, heartbeat: "2s ago", x: 980, y: 360 },
]

const executionCatalog: OrchestratorExecutionItem[] = [
  { id: "exec-lead-qualification", title: "Lead qualification", workflow: "Lead Qualification", status: "running", ownerAgentId: "sales-agent", priority: "high", runtimeProgress: 68, estimatedMinutes: 14, dependencies: ["Knowledge Agent", "Planner Agent"], retryCount: 0, updatedAt: Date.now() - 12000 },
  { id: "exec-support-triage", title: "Customer support", workflow: "Customer Support", status: "waiting", ownerAgentId: "support-agent", priority: "high", runtimeProgress: 31, estimatedMinutes: 18, dependencies: ["Memory Agent", "Executive Agent"], retryCount: 1, updatedAt: Date.now() - 8000 },
  { id: "exec-email-processing", title: "Email processing", workflow: "Email Processing", status: "queued", ownerAgentId: "operations-agent", priority: "medium", runtimeProgress: 12, estimatedMinutes: 9, dependencies: ["Planner Agent"], retryCount: 0, updatedAt: Date.now() - 43000 },
  { id: "exec-crm-update", title: "CRM update", workflow: "CRM Update", status: "review", ownerAgentId: "sales-agent", priority: "medium", runtimeProgress: 84, estimatedMinutes: 7, dependencies: ["Executive Agent", "Knowledge Agent"], retryCount: 0, updatedAt: Date.now() - 36000 },
  { id: "exec-invoice", title: "Invoice generation", workflow: "Invoice Approval", status: "completed", ownerAgentId: "finance-agent", priority: "critical", runtimeProgress: 100, estimatedMinutes: 22, dependencies: ["Executive Agent"], retryCount: 0, updatedAt: Date.now() - 61000 },
  { id: "exec-knowledge-index", title: "Knowledge indexing", workflow: "Knowledge Import", status: "running", ownerAgentId: "knowledge-agent", priority: "medium", runtimeProgress: 76, estimatedMinutes: 11, dependencies: ["Memory Agent"], retryCount: 0, updatedAt: Date.now() - 19000 },
  { id: "exec-meeting", title: "Meeting preparation", workflow: "Meeting Preparation", status: "waiting", ownerAgentId: "executive-agent", priority: "high", runtimeProgress: 55, estimatedMinutes: 12, dependencies: ["Research Agent", "Planner Agent"], retryCount: 0, updatedAt: Date.now() - 24000 },
  { id: "exec-document", title: "Document analysis", workflow: "Document Analysis", status: "failed", ownerAgentId: "research-agent", priority: "high", runtimeProgress: 43, estimatedMinutes: 16, dependencies: ["Knowledge Agent"], retryCount: 2, updatedAt: Date.now() - 7000 },
]

const messageCatalog = [
  { from: "Sales Agent", to: "Knowledge Agent", message: "Requested customer profile for priority account." },
  { from: "Knowledge Agent", to: "Sales Agent", message: "Returned reference bundle and recent notes." },
  { from: "Executive Agent", to: "Operations Agent", message: "Approved recommendation and requested execution." },
  { from: "Finance Agent", to: "Planner Agent", message: "Updated forecast variance and suggested reroute." },
  { from: "Planner Agent", to: "Memory Agent", message: "Created workflow branch and synced context." },
]

const timelineCatalog: Array<Pick<OrchestratorTimelineEvent, "label" | "description" | "type">> = [
  { label: "Workflow started", description: "Execution plan entered orchestration lane.", type: "workflow-started" },
  { label: "Agent assigned", description: "Ownership moved to the best-fit agent.", type: "agent-assigned" },
  { label: "Decision made", description: "Conditional routing resolved based on confidence.", type: "decision-made" },
  { label: "Memory updated", description: "Shared memory persisted for future retrieval.", type: "memory-updated" },
  { label: "Execution completed", description: "Workflow reached a stable terminal outcome.", type: "execution-completed" },
  { label: "Error detected", description: "A task hit an exception and entered recovery.", type: "error-detected" },
  { label: "Recovery initiated", description: "Fallback branch resumed processing.", type: "recovery-initiated" },
]

const memoryCatalog: OrchestratorMemorySync[] = [
  { id: "mem-sync-1", label: "Context synchronization", status: "syncing", timestamp: Date.now() - 19000, detail: "Cross-agent context propagation in progress." },
  { id: "mem-sync-2", label: "Knowledge updates", status: "complete", timestamp: Date.now() - 42000, detail: "Knowledge layer received new business signals." },
  { id: "mem-sync-3", label: "Replay events", status: "syncing", timestamp: Date.now() - 11000, detail: "Event replay stream appended to shared history." },
  { id: "mem-sync-4", label: "Memory persistence", status: "lagging", timestamp: Date.now() - 16000, detail: "Long-term persistence awaiting compaction." },
  { id: "mem-sync-5", label: "Supabase sync status", status: "complete", timestamp: Date.now() - 7000, detail: "Supabase channel healthy and up to date." },
]

export function createOrchestratorDefaultState(): OrchestratorState {
  return {
    agents: departmentCatalog.map((agent) => ({ ...agent })),
    executions: executionCatalog.map((item) => ({ ...item })),
    messages: messageCatalog.map((message, index) => ({
      id: `msg-${index + 1}`,
      from: message.from,
      to: message.to,
      message: message.message,
      timestamp: Date.now() - index * 7000,
      status: index === 0 ? "processing" : index === 1 ? "received" : "sent",
    })),
    timeline: timelineCatalog.map((item, index) => ({
      id: `timeline-${index + 1}`,
      label: item.label,
      description: item.description,
      type: item.type,
      timestamp: Date.now() - index * 9000,
    })),
    health: [
      { id: "health-cpu", label: "CPU Usage", value: 68, suffix: "%" },
      { id: "health-memory", label: "Memory Usage", value: 72, suffix: "%" },
      { id: "health-latency", label: "Latency", value: 94, suffix: "ms" },
      { id: "health-availability", label: "Availability", value: 99, suffix: "%" },
      { id: "health-error", label: "Error Rate", value: 2, suffix: "%" },
    ],
    memorySync: memoryCatalog.map((item) => ({ ...item })),
    metrics: [
      { id: "metric-completed", label: "Tasks Completed", value: 148, delta: 12 },
      { id: "metric-average", label: "Average Execution Time", value: 9, suffix: "m", delta: -2 },
      { id: "metric-success", label: "Success Rate", value: 96, suffix: "%", delta: 3 },
      { id: "metric-running", label: "Running Agents", value: 6, delta: 1 },
      { id: "metric-memory", label: "Memory Operations", value: 482, delta: 24 },
      { id: "metric-throughput", label: "Runtime Throughput", value: 31, suffix: "/m", delta: 4 },
    ],
    filters: {
      agent: "all",
      status: "all",
      priority: "all",
      workflow: "",
      department: "all",
      time: "all",
      query: "",
    },
    selectedAgentId: "executive-agent",
    selectedExecutionId: "exec-lead-qualification",
    liveMode: true,
  }
}

export function filterOrchestratorExecutions(items: OrchestratorExecutionItem[], filters: OrchestratorFilterState): OrchestratorExecutionItem[] {
  const query = filters.query.trim().toLowerCase()
  return items.filter((item) => {
    if (query) {
      const blob = `${item.title} ${item.workflow} ${item.dependencies.join(" ")} ${item.ownerAgentId}`.toLowerCase()
      if (!blob.includes(query)) {
        return false
      }
    }

    if (filters.priority !== "all" && item.priority !== filters.priority) {
      return false
    }

    if (filters.workflow && !item.workflow.toLowerCase().includes(filters.workflow.toLowerCase())) {
      return false
    }

    if (filters.agent !== "all" && item.ownerAgentId !== filters.agent) {
      return false
    }

    if (filters.status !== "all" && item.status !== filters.status) {
      return false
    }

    return true
  })
}

export function filterOrchestratorAgents(items: OrchestratorAgentNode[], filters: OrchestratorFilterState): OrchestratorAgentNode[] {
  const query = filters.query.trim().toLowerCase()
  return items.filter((item) => {
    if (query) {
      const blob = `${item.name} ${item.currentTask} ${item.lastAction} ${item.department}`.toLowerCase()
      if (!blob.includes(query)) {
        return false
      }
    }

    if (filters.department !== "all" && item.department !== filters.department) {
      return false
    }

    if (filters.status !== "all" && item.status !== filters.status) {
      return false
    }

    if (filters.agent !== "all" && item.id !== filters.agent) {
      return false
    }

    return true
  })
}

export function createOrchestratorMessageStream(previous: OrchestratorCommunicationMessage[]): OrchestratorCommunicationMessage[] {
  const index = previous.length % messageCatalog.length
  const message = messageCatalog[index]
  return [
    {
      id: `msg-${Date.now()}`,
      from: message.from,
      to: message.to,
      message: message.message,
      timestamp: Date.now(),
      status: "sent" as const,
    },
    ...previous,
  ].slice(0, 24)
}

export function createOrchestratorTimelineEvent(previous: OrchestratorTimelineEvent[]): OrchestratorTimelineEvent[] {
  const index = previous.length % timelineCatalog.length
  const item = timelineCatalog[index]
  return [
    {
      id: `timeline-${Date.now()}`,
      label: item.label,
      description: item.description,
      type: item.type,
      timestamp: Date.now(),
    },
    ...previous,
  ].slice(0, 28)
}

export function advanceOrchestratorExecutions(previous: OrchestratorExecutionItem[]): OrchestratorExecutionItem[] {
  return previous.map((item, index) => {
    const nextProgress = Math.min(100, item.runtimeProgress + (item.status === "running" ? 6 : item.status === "waiting" ? 2 : 0))
    const nextStatus: OrchestratorExecutionStatus =
      nextProgress >= 100
        ? "completed"
        : item.status === "queued" && index % 2 === 0
          ? "running"
          : item.status === "running" && nextProgress < 50
            ? "waiting"
            : item.status === "waiting" && nextProgress > 45
              ? "running"
              : item.status

    return {
      ...item,
      status: nextStatus,
      runtimeProgress: nextProgress,
      retryCount: item.status === "failed" ? item.retryCount + 1 : item.retryCount,
      updatedAt: Date.now(),
    }
  })
}

export function advanceOrchestratorAgents(previous: OrchestratorAgentNode[]): OrchestratorAgentNode[] {
  return previous.map((agent, index) => ({
    ...agent,
    status:
      agent.status === "failed"
        ? "coordinating"
        : agent.status === "idle"
          ? (index % 3 === 0 ? "thinking" : "coordinating")
          : agent.status === "thinking"
            ? "coordinating"
            : agent.status === "coordinating"
              ? "running"
              : agent.status === "running"
                ? (index % 4 === 0 ? "waiting" : "running")
                : agent.status === "waiting"
                  ? "completed"
                  : "completed",
    confidence: Math.min(99, agent.confidence + (index % 2 === 0 ? 1 : 0)),
    memoryUsage: Math.min(100, agent.memoryUsage + 1),
    eventsProcessed: agent.eventsProcessed + 2,
    lastAction: index % 2 === 0 ? "Processed new signal" : "Coordinated with peer agent",
    cpu: Math.max(12, Math.min(92, agent.cpu + (index % 2 === 0 ? 2 : -1))),
    latencyMs: Math.max(44, Math.min(180, agent.latencyMs + (index % 2 === 0 ? -3 : 2))),
    availability: agent.status === "failed" ? 91 : Math.min(100, agent.availability + 1),
    heartbeat: "just now",
  }))
}

export function buildOrchestratorMetrics(agents: OrchestratorAgentNode[], executions: OrchestratorExecutionItem[], memorySync: OrchestratorMemorySync[]): OrchestratorMetric[] {
  const completed = executions.filter((item) => item.status === "completed").length
  const running = agents.filter((item) => item.status === "running" || item.status === "coordinating").length
  const memoryOps = memorySync.length * 104
  const throughput = Math.max(12, Math.round((completed + running) * 2.3))

  return [
    { id: "metric-completed", label: "Tasks Completed", value: completed * 14 + 16, delta: completed },
    { id: "metric-average", label: "Average Execution Time", value: 9, suffix: "m", delta: -1 },
    { id: "metric-success", label: "Success Rate", value: 94, suffix: "%", delta: 2 },
    { id: "metric-running", label: "Running Agents", value: running, delta: 1 },
    { id: "metric-memory", label: "Memory Operations", value: memoryOps, delta: 18 },
    { id: "metric-throughput", label: "Runtime Throughput", value: throughput, suffix: "/m", delta: 3 },
  ]
}

export function buildOrchestratorHealth(agents: OrchestratorAgentNode[]): OrchestratorMetric[] {
  const averageCpu = Math.round(agents.reduce((sum, item) => sum + item.cpu, 0) / agents.length)
  const averageMemory = Math.round(agents.reduce((sum, item) => sum + item.memoryUsage, 0) / agents.length)
  const averageLatency = Math.round(agents.reduce((sum, item) => sum + item.latencyMs, 0) / agents.length)
  const availability = Math.round(agents.reduce((sum, item) => sum + item.availability, 0) / agents.length)
  const errorRate = Math.max(1, Math.round(100 - availability) / 2)

  return [
    { id: "health-cpu", label: "CPU Usage", value: averageCpu, suffix: "%" },
    { id: "health-memory", label: "Memory Usage", value: averageMemory, suffix: "%" },
    { id: "health-latency", label: "Latency", value: averageLatency, suffix: "ms" },
    { id: "health-availability", label: "Availability", value: availability, suffix: "%" },
    { id: "health-error", label: "Error Rate", value: errorRate, suffix: "%" },
  ]
}

export function buildOrchestratorMemorySync(previous: OrchestratorMemorySync[]): OrchestratorMemorySync[] {
  const next = previous.map((item, index) => ({
    ...item,
    status: item.status === "lagging" ? "syncing" : item.status,
    timestamp: Date.now() - index * 4000,
  }))

  return [
    {
      id: `mem-sync-${Date.now()}`,
      label: "Shared memory synchronization",
      status: "syncing" as const,
      timestamp: Date.now(),
      detail: "Agent context, replay data, and workflow memory are propagating.",
    },
    ...next,
  ].slice(0, 8)
}

export function buildOrchestratorTimelineSeed(): OrchestratorTimelineEvent[] {
  return timelineCatalog.map((item, index) => ({
    id: `timeline-seed-${index + 1}`,
    label: item.label,
    description: item.description,
    type: item.type,
    timestamp: Date.now() - index * 9000,
  }))
}
