import type {
  PlanningAction,
  PlanningDecisionNode,
  PlanningDependency,
  PlanningEngineState,
  PlanningGoal,
  PlanningPlan,
  PlanningPlanStatus,
  PlanningPriorityCard,
  PlanningRoadmapStage,
  PlanningSimulation,
  PlanningTimelineEvent,
} from "@/types"

const goalCatalog: PlanningGoal[] = [
  { id: "goal-revenue", title: "Increase revenue", progress: 64, confidence: 89, priority: "critical", assignedAgents: ["Sales Agent", "Executive Agent", "Planner Agent"], relatedWorkflows: ["Lead Qualification", "Sales Follow-up"] },
  { id: "goal-response", title: "Reduce response time", progress: 71, confidence: 93, priority: "high", assignedAgents: ["Support Agent", "Operations Agent"], relatedWorkflows: ["Customer Support", "Email Processing"] },
  { id: "goal-retention", title: "Improve retention", progress: 59, confidence: 87, priority: "high", assignedAgents: ["Support Agent", "Knowledge Agent", "Executive Agent"], relatedWorkflows: ["Customer Onboarding", "Risk Monitoring"] },
  { id: "goal-automation", title: "Automate workflows", progress: 78, confidence: 92, priority: "medium", assignedAgents: ["Operations Agent", "Planner Agent"], relatedWorkflows: ["Weekly Reports", "Knowledge Import"] },
  { id: "goal-cost", title: "Reduce operating costs", progress: 41, confidence: 85, priority: "medium", assignedAgents: ["Finance Agent", "Operations Agent"], relatedWorkflows: ["Invoice Approval", "Risk Monitoring"] },
  { id: "goal-knowledge", title: "Improve knowledge quality", progress: 83, confidence: 97, priority: "medium", assignedAgents: ["Knowledge Agent", "Memory Agent"], relatedWorkflows: ["Knowledge Import", "Executive Briefing"] },
]

const planCatalog: PlanningPlan[] = [
  { id: "plan-1", objective: "Launch customer campaign", status: "executing", progress: 72, estimatedCompletion: "Today 16:40", dependencies: ["Sales pipeline scoring", "Approvals"], expectedImpact: "Increase conversion velocity and rep capacity", confidence: 91 },
  { id: "plan-2", objective: "Escalate opportunity", status: "ready", progress: 49, estimatedCompletion: "Today 17:15", dependencies: ["Executive review", "Knowledge context"], expectedImpact: "Preserve high-value deal momentum", confidence: 88 },
  { id: "plan-3", objective: "Delay workflow", status: "monitoring", progress: 33, estimatedCompletion: "Tomorrow 08:30", dependencies: ["Risk validation", "External system status"], expectedImpact: "Avoid cost during unstable conditions", confidence: 82 },
  { id: "plan-4", objective: "Reassign agent", status: "draft", progress: 21, estimatedCompletion: "Today 15:50", dependencies: ["Availability", "Department load"], expectedImpact: "Balance execution load and reduce latency", confidence: 84 },
  { id: "plan-5", objective: "Request approval", status: "learning", progress: 61, estimatedCompletion: "Today 18:10", dependencies: ["Policy review", "Owner sign-off"], expectedImpact: "Unlock controlled automation path", confidence: 90 },
  { id: "plan-6", objective: "Update knowledge base", status: "completed", progress: 100, estimatedCompletion: "Done", dependencies: ["Replay events", "Supabase sync"], expectedImpact: "Improve future retrieval quality", confidence: 96 },
]

const roadmapCatalog: Array<Pick<PlanningRoadmapStage, "label" | "relatedPlans" | "status">> = [
  { label: "Planned", relatedPlans: ["Launch customer campaign", "Reassign agent"], status: "draft" },
  { label: "Ready", relatedPlans: ["Escalate opportunity", "Request approval"], status: "ready" },
  { label: "Executing", relatedPlans: ["Launch customer campaign"], status: "executing" },
  { label: "Monitoring", relatedPlans: ["Delay workflow"], status: "monitoring" },
  { label: "Learning", relatedPlans: ["Request approval"], status: "learning" },
  { label: "Completed", relatedPlans: ["Update knowledge base"], status: "completed" },
]

const decisionCatalog: PlanningDecisionNode[] = [
  { id: "decision-1", title: "High priority?", summary: "If the objective is urgent, route to Executive and Sales coordination.", probability: 86, branchType: "success", relatedPlanId: "plan-1" },
  { id: "decision-2", title: "Confidence above threshold?", summary: "If confidence falls below threshold, add a fallback review loop.", probability: 78, branchType: "risk", relatedPlanId: "plan-2" },
  { id: "decision-3", title: "Dependency available?", summary: "If dependent systems are unavailable, delay and retry with a wait branch.", probability: 71, branchType: "fallback", relatedPlanId: "plan-3" },
  { id: "decision-4", title: "Approval required?", summary: "If policy requires sign-off, block execution until the owner approves.", probability: 91, branchType: "success", relatedPlanId: "plan-5" },
]

const dependencyCatalog: PlanningDependency[] = [
  { id: "dep-1", label: "Lead qualification workflow", type: "workflow", status: "linked", source: "Planning Engine", target: "Workflow Builder" },
  { id: "dep-2", label: "Sales Agent", type: "agent", status: "linked", source: "Planning Engine", target: "Multi-Agent Orchestrator" },
  { id: "dep-3", label: "Executive approval", type: "approval", status: "waiting", source: "Planning Engine", target: "Executive Intelligence Center" },
  { id: "dep-4", label: "Knowledge replay", type: "knowledge", status: "ready", source: "Event Replay", target: "Memory Layer" },
  { id: "dep-5", label: "Runtime execution", type: "external-system", status: "ready", source: "Planning Engine", target: "Runtime Engine" },
  { id: "dep-6", label: "Business rules engine", type: "external-system", status: "blocked", source: "Planning Engine", target: "Policy Layer" },
]

const actionsCatalog: PlanningAction[] = [
  { id: "action-1", label: "Launch customer campaign", impact: "Accelerates conversion by prioritizing high-fit opportunities.", confidence: 91, departments: ["sales", "marketing"], requiredAgents: ["Sales Agent", "Marketing Agent"] },
  { id: "action-2", label: "Escalate opportunity", impact: "Pulls executive attention to high-value deals and risks.", confidence: 88, departments: ["sales", "executive"], requiredAgents: ["Executive Agent", "Sales Agent"] },
  { id: "action-3", label: "Delay workflow", impact: "Reduces risk while upstream dependency stabilizes.", confidence: 83, departments: ["operations", "finance"], requiredAgents: ["Operations Agent", "Finance Agent"] },
  { id: "action-4", label: "Reassign agent", impact: "Redistributes load to improve throughput and responsiveness.", confidence: 85, departments: ["operations", "support"], requiredAgents: ["Operations Agent", "Planner Agent"] },
  { id: "action-5", label: "Request approval", impact: "Unlocks controlled execution for policy-sensitive plans.", confidence: 90, departments: ["executive", "operations"], requiredAgents: ["Executive Agent"] },
  { id: "action-6", label: "Update knowledge base", impact: "Improves future planning quality and retrieval precision.", confidence: 97, departments: ["knowledge", "memory"], requiredAgents: ["Knowledge Agent", "Memory Agent"] },
]

const simulationCatalog: PlanningSimulation[] = [
  { id: "sim-sales", title: "If we hire another salesperson", scenario: "Increase sales capacity", estimatedImpact: "+12% pipeline coverage and +8% plan throughput", confidence: 87, notes: ["Faster follow-up", "Improved deal progression", "Higher planning load balance"] },
  { id: "sim-demand", title: "If customer demand increases", scenario: "Scale support and execution", estimatedImpact: "+18% support queue load, +9% revenue upside", confidence: 84, notes: ["More agent assignments", "Tighter prioritization", "Higher memory sync rate"] },
  { id: "sim-support", title: "If support tickets double", scenario: "Protect response time", estimatedImpact: "Need +2 support agents or +1 workflow automation path", confidence: 82, notes: ["Escalation branch required", "Delay noncritical workflows"] },
  { id: "sim-revenue", title: "If revenue decreases", scenario: "Protect margin and retention", estimatedImpact: "Shift priority toward retention and cost control", confidence: 89, notes: ["Escalate executive review", "Rebalance roadmap impact"] },
]

const timelineCatalog: PlanningTimelineEvent[] = [
  { id: "timeline-1", label: "Goal created", type: "goal-created", timestamp: Date.now() - 86000, description: "A strategic objective entered the planning brain." },
  { id: "timeline-2", label: "Plan updated", type: "plan-updated", timestamp: Date.now() - 74000, description: "Plan priorities were recalculated from runtime and memory signals." },
  { id: "timeline-3", label: "Priority changed", type: "priority-changed", timestamp: Date.now() - 63000, description: "Urgency changed based on business risk." },
  { id: "timeline-4", label: "Workflow scheduled", type: "workflow-scheduled", timestamp: Date.now() - 52000, description: "A workflow was aligned to the plan." },
  { id: "timeline-5", label: "Agent assigned", type: "agent-assigned", timestamp: Date.now() - 42000, description: "Ownership moved to the best-fit agent." },
  { id: "timeline-6", label: "Decision revised", type: "decision-revised", timestamp: Date.now() - 31000, description: "The decision tree learned from new signals." },
  { id: "timeline-7", label: "Risk detected", type: "risk-detected", timestamp: Date.now() - 18000, description: "A new risk branch was surfaced for attention." },
]

function createRoadmap(): PlanningRoadmapStage[] {
  return roadmapCatalog.map((item, index) => ({
    id: `roadmap-${index + 1}`,
    label: item.label,
    status: item.status,
    timestamp: Date.now() - index * 8000,
    relatedPlans: item.relatedPlans,
  }))
}

export function createPlanningEngineDefaults(): PlanningEngineState {
  return {
    goals: goalCatalog,
    plans: planCatalog,
    roadmap: createRoadmap(),
    decisionTree: decisionCatalog,
    dependencies: dependencyCatalog,
    priorityMatrix: [
      { id: "pm-1", title: "High Impact / High Urgency", impact: "high", urgency: "high", description: "Do now", simulationHint: "Protect revenue and risk-sensitive tasks." },
      { id: "pm-2", title: "High Impact / Low Urgency", impact: "high", urgency: "low", description: "Schedule", simulationHint: "Plan into next execution window." },
      { id: "pm-3", title: "Low Impact / High Urgency", impact: "low", urgency: "high", description: "Delegate", simulationHint: "Route to agent with least impact on strategic work." },
      { id: "pm-4", title: "Low Impact / Low Urgency", impact: "low", urgency: "low", description: "Defer", simulationHint: "Keep in backlog unless conditions change." },
    ],
    suggestedActions: actionsCatalog,
    timeline: timelineCatalog,
    simulation: simulationCatalog,
    selectedGoalId: goalCatalog[0]?.id ?? "",
    selectedPlanId: planCatalog[0]?.id ?? "",
    selectedDecisionId: decisionCatalog[0]?.id ?? "",
    selectedSimulationId: simulationCatalog[0]?.id ?? "",
    query: "",
    liveMode: true,
  }
}

export function filterPlanningGoals(goals: PlanningGoal[], query: string): PlanningGoal[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return goals
  }

  return goals.filter((goal) => `${goal.title} ${goal.relatedWorkflows.join(" ")} ${goal.assignedAgents.join(" ")}`.toLowerCase().includes(normalized))
}

export function filterExecutionPlans(plans: PlanningPlan[], query: string): PlanningPlan[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return plans
  }

  return plans.filter((plan) => `${plan.objective} ${plan.dependencies.join(" ")} ${plan.expectedImpact}`.toLowerCase().includes(normalized))
}

export function advancePlanningTimeline(previous: PlanningTimelineEvent[]): PlanningTimelineEvent[] {
  const next = timelineCatalog[previous.length % timelineCatalog.length]
  return [
    {
      id: `timeline-${Date.now()}`,
      label: next.label,
      type: next.type,
      timestamp: Date.now(),
      description: next.description,
    },
    ...previous,
  ].slice(0, 24)
}

export function cyclePlanningRoadmap(previous: PlanningRoadmapStage[]): PlanningRoadmapStage[] {
  return previous.map((stage, index) => {
    const nextStatus: PlanningPlanStatus =
      stage.status === "draft"
        ? "ready"
        : stage.status === "ready"
          ? "executing"
          : stage.status === "executing"
            ? "monitoring"
            : stage.status === "monitoring"
              ? "learning"
              : stage.status === "learning"
                ? "completed"
                : index % 2 === 0
                  ? "learning"
                  : "completed"

    return { ...stage, status: nextStatus, timestamp: Date.now() }
  })
}

export function movePriorityFocus(matrix: PlanningPriorityCard[], selectedTitle: string): PlanningPriorityCard[] {
  return matrix.map((card) => ({
    ...card,
    description: card.title === selectedTitle ? "Current focus" : card.description,
  }))
}

export function buildPlanningSummary(goals: PlanningGoal[], plans: PlanningPlan[]): string {
  const highestPriority = goals.find((goal) => goal.priority === "critical") ?? goals[0]
  const activePlan = plans.find((plan) => plan.status === "executing") ?? plans[0]
  return `${highestPriority?.title ?? "Strategic objectives"} is prioritized while ${activePlan?.objective ?? "active plans"} remains under active evaluation.`
}
