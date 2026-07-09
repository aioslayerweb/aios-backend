import type { DecisionStatus, RiskLevel } from "@/src/domain/common/enums"
import type { DecisionConfidenceLevel, DecisionDepartment } from "@/types/decision-engine"

export type GovernanceDecisionHistoryItem = {
  id: string
  timestamp: number
  priority: number
  confidence: number
  status: DecisionStatus
  relatedWorkflow: string
  responsibleAgent: string
  department: DecisionDepartment
  title: string
}

export type GovernanceReasoningItem = {
  decisionId: string
  signalsConsidered: string[]
  businessObjectives: string[]
  supportingEvidence: string[]
  knowledgeReferences: string[]
  policiesEvaluated: string[]
  alternativeActions: string[]
  finalRecommendation: string
  explanation: string
}

export type GovernanceEvidenceEvent = {
  id: string
  decisionId: string
  timestamp: number
  category: "event" | "memory" | "knowledge" | "workflow" | "approval" | "outcome"
  title: string
  detail: string
  source: string
}

export type GovernanceApprovalAction = "approve" | "reject" | "request-review" | "delegate" | "escalate"

export type GovernanceApprovalItem = {
  id: string
  decisionId: string
  title: string
  owner: string
  status: "pending" | "approved" | "rejected" | "review" | "delegated" | "escalated"
  requiredBy: string
  rationale: string
}

export type GovernancePolicyRule = {
  id: string
  name: string
  category: "revenue" | "risk" | "approval" | "financial" | "compliance" | "department"
  status: "active" | "warning" | "draft"
  description: string
  threshold: string
  scope: string
}

export type GovernanceAuditTrailEntry = {
  id: string
  timestamp: number
  actor: string
  action: string
  reason: string
  source: string
  result: "success" | "warning" | "failed" | "review"
  decisionId: string
}

export type GovernanceComplianceItem = {
  id: string
  framework: "GDPR" | "SOC 2" | "ISO 27001" | "HIPAA"
  status: "ready" | "attention" | "architecture-only"
  owner: string
  summary: string
  mappedPolicies: string[]
}

export type GovernanceRiskItem = {
  id: string
  decisionId: string
  title: string
  businessRisk: number
  operationalRisk: number
  complianceRisk: number
  confidence: number
  trend: "up" | "down" | "flat"
  overallRisk: RiskLevel
}

export type GovernanceState = {
  decisions: GovernanceDecisionHistoryItem[]
  reasoning: GovernanceReasoningItem[]
  evidence: GovernanceEvidenceEvent[]
  approvals: GovernanceApprovalItem[]
  policies: GovernancePolicyRule[]
  auditTrail: GovernanceAuditTrailEntry[]
  compliance: GovernanceComplianceItem[]
  risk: GovernanceRiskItem[]
  selectedDecisionId: string
  query: string
  complianceView: GovernanceComplianceItem["framework"] | "all"
  liveMode: boolean
}

export type GovernanceSummary = {
  explainabilityCoverage: number
  pendingApprovals: number
  activePolicies: number
  complianceAttention: number
  highRiskDecisions: number
  confidenceLevel: DecisionConfidenceLevel
}