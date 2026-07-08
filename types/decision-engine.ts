import type { DecisionStatus, RiskLevel } from "@/src/domain"

export type DecisionDepartment =
  | "executive"
  | "sales"
  | "support"
  | "operations"
  | "finance"
  | "knowledge"
  | "marketing"
  | "product"
  | "customer-success"

export type DecisionSignalSource = "runtime" | "crm" | "workflow" | "memory" | "agent" | "knowledge" | "support" | "sales"

export type DecisionConfidenceLevel = "high" | "medium" | "low"

export type DecisionPriorityBand = "critical" | "high" | "medium" | "low"

export type DecisionOutcomeStatus = "accepted" | "rejected" | "executed" | "learning"

export type DecisionQueueItem = {
  id: string
  title: string
  category: string
  status: DecisionStatus
  priorityScore: number
  priorityBand: DecisionPriorityBand
  confidence: number
  confidenceLevel: DecisionConfidenceLevel
  businessImpact: string
  department: DecisionDepartment
  owner: string
  summary: string
  estimatedROI: string
  dependencies: string[]
  recommendedActionId: string
  riskLevel: RiskLevel
}

export type BusinessSignal = {
  id: string
  decisionId: string
  source: DecisionSignalSource
  label: string
  detail: string
  strength: number
  trend: "up" | "down" | "flat"
  impact: "high" | "medium" | "low"
}

export type DecisionPriorityScore = {
  decisionId: string
  businessValue: number
  urgency: number
  risk: number
  confidence: number
  estimatedROI: number
  dependencies: number
  overallPriorityScore: number
}

export type DecisionReasoning = {
  decisionId: string
  evidence: string[]
  signalsConsidered: string[]
  businessRationale: string
  confidenceExplanation: string
  potentialRisks: string[]
  alternativeOptions: string[]
}

export type RecommendedAction = {
  id: string
  decisionId: string
  title: string
  type: "contact-customer" | "escalate-issue" | "launch-workflow" | "assign-agent" | "update-knowledge" | "schedule-meeting" | "delay-execution" | "approve-automatically"
  expectedImpact: string
  estimatedEffort: string
  confidence: number
  requiredApprovals: string[]
  owner: string
  status: "proposed" | "accepted" | "rejected" | "executing"
}

export type DecisionTimelineEntry = {
  id: string
  decisionId: string
  label: string
  type: "decision-created" | "signals-updated" | "recommendation-changed" | "action-approved" | "workflow-executed" | "outcome-recorded"
  timestamp: number
  description: string
}

export type ConfidenceAnalysis = {
  decisionId: string
  score: number
  level: DecisionConfidenceLevel
  explanation: string
  drivers: string[]
}

export type DecisionOutcome = {
  id: string
  decisionId: string
  title: string
  status: DecisionOutcomeStatus
  businessOutcome: string
  executionResult: string
  learningOpportunity: string
}

export type DecisionEngineState = {
  queue: DecisionQueueItem[]
  signals: BusinessSignal[]
  scores: DecisionPriorityScore[]
  reasoning: DecisionReasoning[]
  actions: RecommendedAction[]
  timeline: DecisionTimelineEntry[]
  confidence: ConfidenceAnalysis[]
  outcomes: DecisionOutcome[]
  selectedDecisionId: string
  query: string
  liveMode: boolean
}