import type {
  AgentStatus,
  AIQuickAction,
  AISuggestion,
  CurrentContext,
  ExecutionEvent,
  MemoryEntry,
} from "@/types"

export const AI_PANEL_MIN_WIDTH = 320
export const AI_PANEL_MAX_WIDTH = 560
export const AI_PANEL_DEFAULT_WIDTH = 400

export const mockCurrentContext: CurrentContext = {
  workspace: "Executive",
  customer: "Acme Ltd",
  company: "Acme Holding Group",
  task: "Quarterly revenue risk review",
  workflow: "Executive Insight Briefing",
}

export const mockSuggestions: AISuggestion[] = [
  {
    id: "sug-1",
    title: "Revenue Risk Detected",
    summary: "Pipeline conversion dipped 8% this week. Prioritize enterprise deals over 120k.",
    priority: "high",
    type: "warning",
  },
  {
    id: "sug-2",
    title: "Automate Weekly Brief",
    summary: "Auto-generate Monday executive brief using current memory and report feeds.",
    priority: "medium",
    type: "automation",
  },
  {
    id: "sug-3",
    title: "Cross-Sell Opportunity",
    summary: "Three accounts show product expansion signal based on support and usage trends.",
    priority: "medium",
    type: "insight",
  },
]

export const mockAgentStatuses: AgentStatus[] = [
  {
    id: "agent-sales",
    name: "Sales Agent",
    status: "running",
    progress: 62,
    step: "Evaluating opportunity momentum",
  },
  {
    id: "agent-memory",
    name: "Memory Curator",
    status: "complete",
    progress: 100,
    step: "Memory digest generated",
  },
  {
    id: "agent-report",
    name: "Report Synthesizer",
    status: "idle",
    progress: 0,
    step: "Awaiting trigger",
  },
]

export const mockMemoryEntries: MemoryEntry[] = [
  {
    id: "mem-1",
    title: "Q3 Proposal Strategy",
    summary: "Executive focus on reducing discount leakage in enterprise renewals.",
    pinned: true,
    timestamp: Date.now() - 1000 * 60 * 25,
  },
  {
    id: "mem-2",
    title: "Acme Health Snapshot",
    summary: "Customer satisfaction improved, but implementation timeline slipped by 4 days.",
    pinned: false,
    timestamp: Date.now() - 1000 * 60 * 75,
  },
  {
    id: "mem-3",
    title: "Board Narrative Notes",
    summary: "Need stronger outcome framing for AI-led automation savings.",
    pinned: true,
    timestamp: Date.now() - 1000 * 60 * 180,
  },
]

export const mockExecutionEvents: ExecutionEvent[] = [
  {
    id: "evt-1",
    label: "Load workspace context",
    status: "complete",
    timestamp: Date.now() - 1000 * 60 * 8,
  },
  {
    id: "evt-2",
    label: "Compute priority actions",
    status: "running",
    timestamp: Date.now() - 1000 * 60 * 3,
  },
  {
    id: "evt-3",
    label: "Publish executive summary",
    status: "queued",
    timestamp: Date.now() + 1000 * 60,
  },
]

export const aiQuickActions: AIQuickAction[] = [
  { id: "qa-summarise", label: "Summarise", intent: "summarise" },
  { id: "qa-generate", label: "Generate", intent: "generate" },
  { id: "qa-analyse", label: "Analyse", intent: "analyse" },
  { id: "qa-create-task", label: "Create Task", intent: "create-task" },
  { id: "qa-create-workflow", label: "Create Workflow", intent: "create-workflow" },
  { id: "qa-search-memory", label: "Search Memory", intent: "search-memory" },
  { id: "qa-run-agent", label: "Run Agent", intent: "run-agent" },
]

export function clampPanelWidth(value: number): number {
  return Math.min(AI_PANEL_MAX_WIDTH, Math.max(AI_PANEL_MIN_WIDTH, value))
}

export function formatRelativeTime(timestamp: number): string {
  const deltaMs = Math.max(0, Date.now() - timestamp)
  const deltaMin = Math.floor(deltaMs / 60000)

  if (deltaMin < 1) {
    return "just now"
  }
  if (deltaMin < 60) {
    return `${deltaMin}m ago`
  }

  const deltaHours = Math.floor(deltaMin / 60)
  if (deltaHours < 24) {
    return `${deltaHours}h ago`
  }

  const deltaDays = Math.floor(deltaHours / 24)
  return `${deltaDays}d ago`
}
