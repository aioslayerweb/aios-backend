import { DecisionStatus, RiskLevel } from "@/src/domain"
import type {
  GovernanceApprovalItem,
  GovernanceAuditTrailEntry,
  GovernanceComplianceItem,
  GovernanceDecisionHistoryItem,
  GovernanceEvidenceEvent,
  GovernancePolicyRule,
  GovernanceReasoningItem,
  GovernanceRiskItem,
  GovernanceState,
  GovernanceSummary,
} from "@/types"

export function createGovernanceDefaults(): GovernanceState {
  const decisions: GovernanceDecisionHistoryItem[] = [
    {
      id: "gov-decision-001",
      timestamp: Date.now() - 1000 * 60 * 58,
      priority: 94,
      confidence: 88,
      status: DecisionStatus.UnderReview,
      relatedWorkflow: "support-recovery-workflow",
      responsibleAgent: "Retention Agent",
      department: "customer-success",
      title: "Customer escalation response",
    },
    {
      id: "gov-decision-002",
      timestamp: Date.now() - 1000 * 60 * 47,
      priority: 91,
      confidence: 84,
      status: DecisionStatus.Proposed,
      relatedWorkflow: "executive-expansion-briefing",
      responsibleAgent: "Revenue Agent",
      department: "executive",
      title: "Revenue opportunity acceleration",
    },
    {
      id: "gov-decision-003",
      timestamp: Date.now() - 1000 * 60 * 39,
      priority: 78,
      confidence: 74,
      status: DecisionStatus.Proposed,
      relatedWorkflow: "finance-approval-reroute",
      responsibleAgent: "Operations Agent",
      department: "operations",
      title: "Workflow approval optimization",
    },
    {
      id: "gov-decision-004",
      timestamp: Date.now() - 1000 * 60 * 26,
      priority: 68,
      confidence: 71,
      status: DecisionStatus.Approved,
      relatedWorkflow: "knowledge-refresh-sync",
      responsibleAgent: "Knowledge Agent",
      department: "knowledge",
      title: "Knowledge refresh governance review",
    },
  ]

  const reasoning: GovernanceReasoningItem[] = [
    {
      decisionId: "gov-decision-001",
      signalsConsidered: ["Support sentiment", "Runtime queue depth", "Persistent memory churn flag"],
      businessObjectives: ["Protect strategic revenue", "Reduce executive risk", "Preserve customer trust"],
      supportingEvidence: ["CSAT decline across two escalations", "Delayed acknowledgement in support workflow", "Historic renewal sensitivity in memory layer"],
      knowledgeReferences: ["Retention playbook", "Enterprise escalation SOP"],
      policiesEvaluated: ["Risk threshold", "Approval required", "Department escalation rule"],
      alternativeActions: ["Wait one cycle", "Delegate to standard queue", "Manual review only"],
      finalRecommendation: "Approve customer escalation recovery workflow and executive outreach.",
      explanation: "AIOS recommends intervention because multiple enterprise signals align around revenue risk and support delay, while the current workflow path is underperforming.",
    },
    {
      decisionId: "gov-decision-002",
      signalsConsidered: ["CRM expansion propensity", "Executive activity history", "Planning engine confidence"],
      businessObjectives: ["Accelerate growth", "Improve forecast quality"],
      supportingEvidence: ["Champion activity increased", "Meeting density rose", "Expansion path scored above threshold"],
      knowledgeReferences: ["Expansion strategy brief", "Account memory graph"],
      policiesEvaluated: ["Revenue threshold", "Executive approval rule"],
      alternativeActions: ["Keep current sales cadence", "Delay executive outreach"],
      finalRecommendation: "Schedule executive sponsor outreach this week.",
      explanation: "AIOS recommends executive outreach because the opportunity meets both behavioral and revenue thresholds while forecast confidence remains strong.",
    },
    {
      decisionId: "gov-decision-003",
      signalsConsidered: ["Workflow retry count", "Replay engine drift", "Operational queue latency"],
      businessObjectives: ["Reduce processing time", "Maintain control compliance"],
      supportingEvidence: ["Approval node retried six times", "Replay detected repeat branch failure"],
      knowledgeReferences: ["Finance approval policy", "Workflow branching guide"],
      policiesEvaluated: ["Financial controls", "Risk threshold"],
      alternativeActions: ["Pause workflow", "Escalate only failures"],
      finalRecommendation: "Reroute the stalled approval branch under controlled review.",
      explanation: "AIOS recommends a controlled reroute because execution evidence shows recurring operational drag while policy boundaries remain clear.",
    },
    {
      decisionId: "gov-decision-004",
      signalsConsidered: ["Prompt retrieval mismatch", "Memory freshness lag", "Knowledge sync status"],
      businessObjectives: ["Improve reasoning quality", "Reduce stale knowledge risk"],
      supportingEvidence: ["Prompt OS cited outdated launch criteria", "Memory objects lag current docs"],
      knowledgeReferences: ["Launch policy", "Pricing governance doc"],
      policiesEvaluated: ["Compliance documentation policy", "Knowledge refresh rule"],
      alternativeActions: ["Refresh only selected objects", "Wait until next sync window"],
      finalRecommendation: "Run a scoped knowledge refresh with policy review.",
      explanation: "AIOS recommends a scoped refresh because explainability and decision quality degrade when knowledge references drift from approved policy.",
    },
  ]

  const evidence: GovernanceEvidenceEvent[] = [
    { id: "e1", decisionId: "gov-decision-001", timestamp: Date.now() - 1000 * 60 * 57, category: "event", title: "Runtime event received", detail: "Support queue latency exceeded target threshold.", source: "Runtime Engine" },
    { id: "e2", decisionId: "gov-decision-001", timestamp: Date.now() - 1000 * 60 * 54, category: "memory", title: "Memory update linked", detail: "Customer churn warning retrieved from persistent memory.", source: "Memory Layer" },
    { id: "e3", decisionId: "gov-decision-001", timestamp: Date.now() - 1000 * 60 * 52, category: "approval", title: "Approval required", detail: "Escalation exceeds strategic account risk threshold.", source: "Policy Engine" },
    { id: "e4", decisionId: "gov-decision-002", timestamp: Date.now() - 1000 * 60 * 44, category: "knowledge", title: "Knowledge retrieval", detail: "Expansion playbook and account memory loaded for reasoning.", source: "Prompt OS" },
    { id: "e5", decisionId: "gov-decision-002", timestamp: Date.now() - 1000 * 60 * 40, category: "workflow", title: "Workflow recommendation prepared", detail: "Executive outreach workflow staged for approval.", source: "Workflow Builder" },
    { id: "e6", decisionId: "gov-decision-003", timestamp: Date.now() - 1000 * 60 * 34, category: "event", title: "Replay evidence added", detail: "Replay engine identified repeat approval branch failure.", source: "Replay Engine" },
    { id: "e7", decisionId: "gov-decision-004", timestamp: Date.now() - 1000 * 60 * 21, category: "outcome", title: "Outcome recorded", detail: "Knowledge refresh accepted for governance review.", source: "Executive Intelligence Center" },
  ]

  const approvals: GovernanceApprovalItem[] = [
    { id: "a1", decisionId: "gov-decision-001", title: "Escalation recovery approval", owner: "Customer Success Director", status: "pending", requiredBy: "within 2 hours", rationale: "Strategic revenue and support-risk threshold exceeded." },
    { id: "a2", decisionId: "gov-decision-002", title: "Executive outreach approval", owner: "Chief Revenue Officer", status: "review", requiredBy: "today", rationale: "Revenue threshold requires executive sign-off." },
    { id: "a3", decisionId: "gov-decision-003", title: "Workflow reroute approval", owner: "Finance Operations", status: "pending", requiredBy: "next review window", rationale: "Financial controls require controlled operational approval." },
    { id: "a4", decisionId: "gov-decision-004", title: "Knowledge refresh approval", owner: "Knowledge Operations", status: "approved", requiredBy: "completed", rationale: "Reasoning quality exception accepted for action." },
  ]

  const policies: GovernancePolicyRule[] = [
    { id: "p1", name: "Revenue Threshold", category: "revenue", status: "active", description: "Executive approval required above strategic revenue opportunity threshold.", threshold: "$250k ARR", scope: "Executive + Sales" },
    { id: "p2", name: "Risk Threshold", category: "risk", status: "active", description: "High-risk customer or operational events require governance visibility.", threshold: "Risk score > 80", scope: "Customer Success + Operations" },
    { id: "p3", name: "Financial Controls", category: "financial", status: "active", description: "Workflow changes affecting finance approvals must remain reviewable.", threshold: "Any approval reroute", scope: "Finance" },
    { id: "p4", name: "Compliance Documentation", category: "compliance", status: "warning", description: "Knowledge references used in AI reasoning must map to approved documentation sources.", threshold: "Approved source coverage 95%", scope: "Knowledge + Compliance" },
    { id: "p5", name: "Department Approval Rule", category: "department", status: "draft", description: "Cross-department escalations may require delegated review routing.", threshold: "2+ departments impacted", scope: "Global" },
  ]

  const auditTrail: GovernanceAuditTrailEntry[] = [
    { id: "log1", timestamp: Date.now() - 1000 * 60 * 56, actor: "Decision Engine", action: "Generated escalation recommendation", reason: "Risk threshold exceeded", source: "Runtime + Memory", result: "success", decisionId: "gov-decision-001" },
    { id: "log2", timestamp: Date.now() - 1000 * 60 * 43, actor: "Prompt OS", action: "Loaded policy-aware knowledge references", reason: "Reasoning request started", source: "Knowledge Retrieval", result: "success", decisionId: "gov-decision-002" },
    { id: "log3", timestamp: Date.now() - 1000 * 60 * 33, actor: "Replay Engine", action: "Flagged repeated branch execution", reason: "Operational anomaly detection", source: "Replay Analysis", result: "warning", decisionId: "gov-decision-003" },
    { id: "log4", timestamp: Date.now() - 1000 * 60 * 22, actor: "Knowledge Operations", action: "Approved scoped refresh", reason: "Stale policy reference detected", source: "Governance Review", result: "review", decisionId: "gov-decision-004" },
  ]

  const compliance: GovernanceComplianceItem[] = [
    { id: "c1", framework: "GDPR", status: "ready", owner: "Privacy Office", summary: "Decision evidence and audit views are structured for inspection and data lineage review.", mappedPolicies: ["Compliance Documentation", "Department Approval Rule"] },
    { id: "c2", framework: "SOC 2", status: "ready", owner: "Security Team", summary: "Approval center, audit trail, and immutable decision history patterns align with control evidence needs.", mappedPolicies: ["Financial Controls", "Risk Threshold"] },
    { id: "c3", framework: "ISO 27001", status: "attention", owner: "Security Governance", summary: "Policy classification and ownership mapping are ready, but signature workflows remain architectural only.", mappedPolicies: ["Compliance Documentation"] },
    { id: "c4", framework: "HIPAA", status: "architecture-only", owner: "Compliance Architecture", summary: "Framework view reserved for future healthcare use cases and policy overlays.", mappedPolicies: ["Department Approval Rule"] },
  ]

  const risk: GovernanceRiskItem[] = [
    { id: "r1", decisionId: "gov-decision-001", title: "Strategic customer escalation", businessRisk: 94, operationalRisk: 78, complianceRisk: 42, confidence: 88, trend: "up", overallRisk: RiskLevel.Critical },
    { id: "r2", decisionId: "gov-decision-002", title: "Expansion opportunity timing", businessRisk: 81, operationalRisk: 54, complianceRisk: 28, confidence: 84, trend: "flat", overallRisk: RiskLevel.High },
    { id: "r3", decisionId: "gov-decision-003", title: "Finance approval reroute", businessRisk: 58, operationalRisk: 73, complianceRisk: 67, confidence: 74, trend: "up", overallRisk: RiskLevel.High },
    { id: "r4", decisionId: "gov-decision-004", title: "Knowledge reference drift", businessRisk: 46, operationalRisk: 52, complianceRisk: 64, confidence: 71, trend: "down", overallRisk: RiskLevel.Medium },
  ]

  return {
    decisions,
    reasoning,
    evidence,
    approvals,
    policies,
    auditTrail,
    compliance,
    risk,
    selectedDecisionId: decisions[0]?.id ?? "",
    query: "",
    complianceView: "all",
    liveMode: true,
  }
}

export function filterGovernanceDecisions(decisions: GovernanceDecisionHistoryItem[], query: string) {
  if (!query.trim()) {
    return decisions
  }

  const normalized = query.trim().toLowerCase()
  return decisions.filter((item) =>
    [item.id, item.title, item.relatedWorkflow, item.responsibleAgent, item.department].some((value) => value.toLowerCase().includes(normalized))
  )
}

export function filterComplianceItems(items: GovernanceComplianceItem[], view: GovernanceState["complianceView"]) {
  if (view === "all") {
    return items
  }

  return items.filter((item) => item.framework === view)
}

export function selectGovernanceReasoning(reasoning: GovernanceReasoningItem[], decisionId: string) {
  return reasoning.find((item) => item.decisionId === decisionId) ?? null
}

export function selectGovernanceEvidence(evidence: GovernanceEvidenceEvent[], decisionId: string) {
  return evidence.filter((item) => item.decisionId === decisionId).sort((left, right) => left.timestamp - right.timestamp)
}

export function selectGovernanceApprovals(approvals: GovernanceApprovalItem[], decisionId: string) {
  return approvals.filter((item) => item.decisionId === decisionId)
}

export function selectGovernanceRisk(risk: GovernanceRiskItem[], decisionId: string) {
  return risk.find((item) => item.decisionId === decisionId) ?? null
}

export function governanceSummary(state: GovernanceState): GovernanceSummary {
  const pendingApprovals = state.approvals.filter((item) => item.status === "pending" || item.status === "review").length
  const activePolicies = state.policies.filter((item) => item.status === "active").length
  const complianceAttention = state.compliance.filter((item) => item.status === "attention").length
  const highRiskDecisions = state.risk.filter((item) => item.overallRisk === RiskLevel.High || item.overallRisk === RiskLevel.Critical).length
  const explainabilityCoverage = Math.round((state.reasoning.length / Math.max(1, state.decisions.length)) * 100)
  const avgConfidence = Math.round(state.decisions.reduce((total, item) => total + item.confidence, 0) / Math.max(1, state.decisions.length))

  return {
    explainabilityCoverage,
    pendingApprovals,
    activePolicies,
    complianceAttention,
    highRiskDecisions,
    confidenceLevel: avgConfidence >= 80 ? "high" : avgConfidence >= 60 ? "medium" : "low",
  }
}