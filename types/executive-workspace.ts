import type { DecisionStatus, Priority, RiskLevel, RuntimeStatus, TaskStatus } from "@/src/domain"

export type ExecutiveMetric = {
  id: string
  label: string
  value: string
  delta: string
  trend: "up" | "down" | "flat"
}

export type ExecutiveSummary = {
  dateLabel: string
  greeting: string
  organizationName: string
  workspaceName: string
  aiStatus: RuntimeStatus
  todayPriorities: number
  metrics: ExecutiveMetric[]
}

export type BusinessHealthItem = {
  id: string
  title: string
  score: number
  subtitle: string
  trend: "up" | "down" | "flat"
  delta: string
}

export type PriorityActionItem = {
  id: string
  title: string
  description: string
  priority: Priority
  deadline: string
  owner: string
  status: TaskStatus
}

export type ExecutiveBriefing = {
  headline: string
  overview: string
  highlights: string[]
}

export type ExecutiveTimelineItem = {
  id: string
  time: string
  title: string
  kind: "meeting" | "task" | "approval" | "automation" | "communication" | "ai"
  owner: string
  status: "upcoming" | "active" | "completed"
}

export type ExecutiveKPI = {
  id: string
  label: string
  value: string
  target?: string
  delta: string
  trend: "up" | "down" | "flat"
}

export type DecisionCenterItem = {
  id: string
  title: string
  status: DecisionStatus
  riskLevel: RiskLevel
  recommendedAction: string
  aiExplanation: string
  owner: string
}

export type ExecutiveQuickAction = {
  id: string
  title: string
  description: string
  intent: "new-customer" | "create-task" | "launch-agent" | "run-workflow" | "open-memory" | "search-company"
}

export type ExecutiveWorkspaceState = {
  loading: boolean
  summary: ExecutiveSummary
  health: BusinessHealthItem[]
  priorities: PriorityActionItem[]
  briefing: ExecutiveBriefing
  timeline: ExecutiveTimelineItem[]
  kpis: ExecutiveKPI[]
  decisions: DecisionCenterItem[]
  quickActions: ExecutiveQuickAction[]
  businessScore: number
  lastUpdated: number
}
