import { DecisionStatus, Priority, RiskLevel, RuntimeStatus, TaskStatus } from "@/src/domain/common/enums"
import type {
  BusinessHealthItem,
  DecisionCenterItem,
  ExecutiveBriefing,
  ExecutiveKPI,
  ExecutiveQuickAction,
  ExecutiveSummary,
  ExecutiveTimelineItem,
  PriorityActionItem,
} from "@/types"

export function executiveGreeting(date = new Date()): string {
  const hour = date.getHours()
  if (hour < 12) {
    return "Good morning"
  }
  if (hour < 18) {
    return "Good afternoon"
  }
  return "Good evening"
}

export function formatExecutiveDate(date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export function calculateBusinessScore(items: BusinessHealthItem[]): number {
  if (items.length === 0) {
    return 0
  }
  const total = items.reduce((sum, item) => sum + item.score, 0)
  return Math.round(total / items.length)
}

export function createExecutiveSummary(input: {
  organizationName: string
  workspaceName: string
  aiStatus: RuntimeStatus
  todayPriorities: number
  unreadNotifications: number
  runningAgents: number
}): ExecutiveSummary {
  return {
    dateLabel: formatExecutiveDate(),
    greeting: executiveGreeting(),
    organizationName: input.organizationName,
    workspaceName: input.workspaceName,
    aiStatus: input.aiStatus,
    todayPriorities: input.todayPriorities,
    metrics: [
      { id: "m1", label: "Unread Alerts", value: `${input.unreadNotifications}`, delta: "-12%", trend: "down" },
      { id: "m2", label: "Running Agents", value: `${input.runningAgents}`, delta: "+2", trend: "up" },
      { id: "m3", label: "Approvals Due", value: `${input.todayPriorities}`, delta: "+1", trend: "up" },
      { id: "m4", label: "AI Runtime", value: input.aiStatus, delta: "stable", trend: "flat" },
    ],
  }
}

export const mockBusinessHealth: BusinessHealthItem[] = [
  { id: "h1", title: "Revenue Trend", score: 87, subtitle: "Forecast continues above plan", trend: "up", delta: "+8%" },
  { id: "h2", title: "Sales Pipeline", score: 81, subtitle: "Qualified opportunities increasing", trend: "up", delta: "+6%" },
  { id: "h3", title: "Customer Satisfaction", score: 78, subtitle: "Two strategic accounts need follow-up", trend: "down", delta: "-2 pts" },
  { id: "h4", title: "Operational Health", score: 84, subtitle: "Execution cadence remains healthy", trend: "flat", delta: "0" },
  { id: "h5", title: "Automation Success", score: 92, subtitle: "99.1% workflow completion overnight", trend: "up", delta: "+1.4%" },
  { id: "h6", title: "AI Confidence", score: 89, subtitle: "Model confidence holds at enterprise threshold", trend: "up", delta: "+3 pts" },
]

export const mockPriorityActions: PriorityActionItem[] = [
  {
    id: "p1",
    title: "Approve enterprise proposal",
    description: "Northwind expansion proposal requires executive sign-off.",
    priority: Priority.High,
    deadline: "10:30 AM",
    owner: "Ava Chen",
    status: TaskStatus.Todo,
  },
  {
    id: "p2",
    title: "Review customer escalation",
    description: "Helios account escalation flagged by retention agent.",
    priority: Priority.Critical,
    deadline: "11:15 AM",
    owner: "Nina Park",
    status: TaskStatus.InProgress,
  },
  {
    id: "p3",
    title: "Budget approval",
    description: "Q3 automation budget adjustment pending approval.",
    priority: Priority.Medium,
    deadline: "2:00 PM",
    owner: "Finance Ops",
    status: TaskStatus.Todo,
  },
  {
    id: "p4",
    title: "Critical automation warning",
    description: "Invoice workflow retried twice overnight.",
    priority: Priority.High,
    deadline: "4:00 PM",
    owner: "Platform Team",
    status: TaskStatus.Blocked,
  },
]

export const mockExecutiveBriefing: ExecutiveBriefing = {
  headline: "AIOS analysed 1,284 business events overnight.",
  overview: "Three revenue opportunities were detected, two customers require immediate follow-up, and the weekly forecast increased by 8%.",
  highlights: [
    "3 revenue opportunities detected and prioritized for account leadership.",
    "2 strategic customers require immediate follow-up to prevent churn risk.",
    "Revenue forecast increased by 8% after pipeline confidence recalibration.",
  ],
}

export const mockTimeline: ExecutiveTimelineItem[] = [
  { id: "t1", time: "09:00", title: "Leadership sync: growth outlook", kind: "meeting", owner: "Executive Team", status: "upcoming" },
  { id: "t2", time: "09:30", title: "Approve proposal: Northwind expansion", kind: "approval", owner: "Ava Chen", status: "active" },
  { id: "t3", time: "10:15", title: "AI launched churn prevention workflow", kind: "automation", owner: "AI Runtime", status: "completed" },
  { id: "t4", time: "11:00", title: "Customer escalation briefing", kind: "communication", owner: "Success Team", status: "upcoming" },
  { id: "t5", time: "13:30", title: "Task review: enterprise onboarding", kind: "task", owner: "Operations", status: "upcoming" },
  { id: "t6", time: "15:00", title: "AI summary delivered to decision center", kind: "ai", owner: "AI Assistant", status: "completed" },
]

export const mockExecutiveKPIs: ExecutiveKPI[] = [
  { id: "k1", label: "Revenue", value: "$4.8M", target: "$5.0M", delta: "+8.2%", trend: "up" },
  { id: "k2", label: "Pipeline", value: "$12.6M", target: "$11.8M", delta: "+6.4%", trend: "up" },
  { id: "k3", label: "Open Deals", value: "43", target: "40", delta: "+3", trend: "up" },
  { id: "k4", label: "Tasks", value: "126", target: "120", delta: "+4", trend: "up" },
  { id: "k5", label: "Customers", value: "312", target: "305", delta: "+7", trend: "up" },
  { id: "k6", label: "Automation Success", value: "99.1%", target: "98.0%", delta: "+1.1 pts", trend: "up" },
  { id: "k7", label: "Avg Response Time", value: "247ms", target: "280ms", delta: "-33ms", trend: "up" },
  { id: "k8", label: "Knowledge Growth", value: "+42", target: "+30", delta: "+12", trend: "up" },
]

export const mockDecisionCenter: DecisionCenterItem[] = [
  {
    id: "d1",
    title: "Expand enterprise account pod",
    status: DecisionStatus.UnderReview,
    riskLevel: RiskLevel.Medium,
    recommendedAction: "Approve staffing increase by 2 strategic AEs.",
    aiExplanation: "AI confidence is 89% based on pipeline quality and expansion propensity.",
    owner: "Revenue Leadership",
  },
  {
    id: "d2",
    title: "Escalation protocol update",
    status: DecisionStatus.Proposed,
    riskLevel: RiskLevel.High,
    recommendedAction: "Approve immediate protocol update for top-tier accounts.",
    aiExplanation: "Two high ARR accounts show delayed response and sentiment decline.",
    owner: "Customer Success",
  },
]

export const mockQuickActions: ExecutiveQuickAction[] = [
  { id: "q1", title: "New Customer", description: "Create and onboard a new strategic customer profile.", intent: "new-customer" },
  { id: "q2", title: "Create Task", description: "Assign an executive follow-up or approval task.", intent: "create-task" },
  { id: "q3", title: "Launch Agent", description: "Start an AI agent for focused analysis.", intent: "launch-agent" },
  { id: "q4", title: "Run Workflow", description: "Execute an approved operational workflow.", intent: "run-workflow" },
  { id: "q5", title: "Open Memory", description: "Review persistent business memory context.", intent: "open-memory" },
  { id: "q6", title: "Search Company", description: "Search accounts, teams, and opportunities.", intent: "search-company" },
]
