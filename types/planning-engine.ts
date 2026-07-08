export type PlanningGoalPriority = "low" | "medium" | "high" | "critical"

export type PlanningGoal = {
  id: string
  title: string
  progress: number
  confidence: number
  priority: PlanningGoalPriority
  assignedAgents: string[]
  relatedWorkflows: string[]
}

export type PlanningPlanStatus = "draft" | "ready" | "executing" | "monitoring" | "learning" | "completed"

export type PlanningPlan = {
  id: string
  objective: string
  status: PlanningPlanStatus
  progress: number
  estimatedCompletion: string
  dependencies: string[]
  expectedImpact: string
  confidence: number
}

export type PlanningRoadmapStage = {
  id: string
  label: string
  status: PlanningPlanStatus
  timestamp: number
  relatedPlans: string[]
}

export type PlanningDecisionNode = {
  id: string
  title: string
  summary: string
  probability: number
  branchType: "success" | "risk" | "fallback"
  relatedPlanId: string
}

export type PlanningDependency = {
  id: string
  label: string
  type: "task" | "workflow" | "agent" | "knowledge" | "approval" | "external-system"
  status: "blocked" | "ready" | "waiting" | "linked"
  source: string
  target: string
}

export type PlanningPriorityCard = {
  id: string
  title: string
  impact: "high" | "low"
  urgency: "high" | "low"
  description: string
  simulationHint: string
}

export type PlanningAction = {
  id: string
  label: string
  impact: string
  confidence: number
  departments: string[]
  requiredAgents: string[]
}

export type PlanningTimelineEvent = {
  id: string
  label: string
  type: "goal-created" | "plan-updated" | "priority-changed" | "workflow-scheduled" | "agent-assigned" | "decision-revised" | "risk-detected"
  timestamp: number
  description: string
}

export type PlanningSimulation = {
  id: string
  title: string
  scenario: string
  estimatedImpact: string
  confidence: number
  notes: string[]
}

export type PlanningEngineState = {
  goals: PlanningGoal[]
  plans: PlanningPlan[]
  roadmap: PlanningRoadmapStage[]
  decisionTree: PlanningDecisionNode[]
  dependencies: PlanningDependency[]
  priorityMatrix: PlanningPriorityCard[]
  suggestedActions: PlanningAction[]
  timeline: PlanningTimelineEvent[]
  simulation: PlanningSimulation[]
  selectedGoalId: string
  selectedPlanId: string
  selectedDecisionId: string
  selectedSimulationId: string
  query: string
  liveMode: boolean
}
