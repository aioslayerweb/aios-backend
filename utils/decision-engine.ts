import { DecisionStatus, RiskLevel } from "@/src/domain"
import type {
  BusinessSignal,
  ConfidenceAnalysis,
  DecisionConfidenceLevel,
  DecisionEngineState,
  DecisionOutcome,
  DecisionPriorityBand,
  DecisionPriorityScore,
  DecisionQueueItem,
  DecisionReasoning,
  DecisionTimelineEntry,
  RecommendedAction,
} from "@/types"

export function confidenceLevel(score: number): DecisionConfidenceLevel {
  if (score >= 80) {
    return "high"
  }

  if (score >= 60) {
    return "medium"
  }

  return "low"
}

export function priorityBand(score: number): DecisionPriorityBand {
  if (score >= 90) {
    return "critical"
  }

  if (score >= 76) {
    return "high"
  }

  if (score >= 60) {
    return "medium"
  }

  return "low"
}

function queueItem(input: Omit<DecisionQueueItem, "confidenceLevel" | "priorityBand">): DecisionQueueItem {
  return {
    ...input,
    confidenceLevel: confidenceLevel(input.confidence),
    priorityBand: priorityBand(input.priorityScore),
  }
}

export function createDecisionEngineDefaults(): DecisionEngineState {
  const queue = [
    queueItem({
      id: "decision-customer-escalation",
      title: "Customer escalation",
      category: "Retention",
      status: DecisionStatus.UnderReview,
      priorityScore: 94,
      confidence: 88,
      businessImpact: "$420k ARR at risk if escalation remains unresolved for 24 hours.",
      department: "customer-success",
      owner: "Customer Success Director",
      summary: "A top-tier customer is showing negative support sentiment, delayed response acknowledgement, and workflow backlog pressure.",
      estimatedROI: "12.4x retention leverage",
      dependencies: ["Support triage workflow", "Escalation playbook", "Account context memory"],
      recommendedActionId: "action-escalation-1",
      riskLevel: RiskLevel.Critical,
    }),
    queueItem({
      id: "decision-pipeline-prioritization",
      title: "Pipeline prioritization",
      category: "Revenue",
      status: DecisionStatus.Proposed,
      priorityScore: 86,
      confidence: 82,
      businessImpact: "$1.2M in near-term expansion can accelerate if high-propensity deals are sequenced first.",
      department: "sales",
      owner: "VP Revenue",
      summary: "Deal quality, meeting conversion, and product interest signals indicate a short list of opportunities that should be re-ranked immediately.",
      estimatedROI: "8.1x pipeline efficiency",
      dependencies: ["CRM scoring sync", "AE capacity model"],
      recommendedActionId: "action-pipeline-1",
      riskLevel: RiskLevel.High,
    }),
    queueItem({
      id: "decision-workflow-optimization",
      title: "Workflow optimization",
      category: "Operations",
      status: DecisionStatus.Proposed,
      priorityScore: 78,
      confidence: 74,
      businessImpact: "Cycle time can drop 19% by rerouting a stalled approval branch.",
      department: "operations",
      owner: "Operations Lead",
      summary: "Runtime execution traces show repeated waiting states in the approval branch of a finance onboarding workflow.",
      estimatedROI: "4.2x operational throughput",
      dependencies: ["Workflow Builder node update", "Approval policy review"],
      recommendedActionId: "action-workflow-1",
      riskLevel: RiskLevel.Medium,
    }),
    queueItem({
      id: "decision-knowledge-refresh",
      title: "Knowledge refresh",
      category: "Knowledge",
      status: DecisionStatus.Proposed,
      priorityScore: 68,
      confidence: 71,
      businessImpact: "Decision quality in Prompt OS can improve if stale operating documents are refreshed today.",
      department: "knowledge",
      owner: "Knowledge Operations",
      summary: "Important product rollout and pricing memory has drifted from the latest workflow and support evidence.",
      estimatedROI: "3.6x reasoning reliability",
      dependencies: ["Confluence sync", "Prompt retrieval index"],
      recommendedActionId: "action-knowledge-1",
      riskLevel: RiskLevel.Medium,
    }),
    queueItem({
      id: "decision-revenue-opportunity",
      title: "Revenue opportunity",
      category: "Expansion",
      status: DecisionStatus.UnderReview,
      priorityScore: 91,
      confidence: 84,
      businessImpact: "Usage, meeting, and champion signals support fast-tracking a strategic expansion recommendation.",
      department: "executive",
      owner: "Chief Revenue Officer",
      summary: "A multi-product customer has reached the threshold where executive outreach is likely to unlock expansion this week.",
      estimatedROI: "11.7x expansion potential",
      dependencies: ["Executive briefing", "Account owner alignment"],
      recommendedActionId: "action-revenue-1",
      riskLevel: RiskLevel.High,
    }),
    queueItem({
      id: "decision-resource-allocation",
      title: "Resource allocation",
      category: "Capacity",
      status: DecisionStatus.Proposed,
      priorityScore: 73,
      confidence: 69,
      businessImpact: "Planner and orchestrator signals suggest one agent pod is overloaded while finance review work is accumulating.",
      department: "finance",
      owner: "Chief Operating Officer",
      summary: "AIOS sees uneven agent utilization and recommends rebalancing work between finance and operations agents.",
      estimatedROI: "2.9x queue stability",
      dependencies: ["Orchestrator assignment policy", "Planning dependency graph"],
      recommendedActionId: "action-resource-1",
      riskLevel: RiskLevel.Medium,
    }),
  ]

  const signals: BusinessSignal[] = [
    { id: "signal-1", decisionId: "decision-customer-escalation", source: "support", label: "Sentiment decline", detail: "CSAT dropped 18 points across the last two escalations.", strength: 91, trend: "up", impact: "high" },
    { id: "signal-2", decisionId: "decision-customer-escalation", source: "runtime", label: "Backlog pressure", detail: "Runtime queue depth increased on support approval workflow.", strength: 86, trend: "up", impact: "high" },
    { id: "signal-3", decisionId: "decision-pipeline-prioritization", source: "crm", label: "Opportunity acceleration", detail: "Three late-stage deals show increased buyer activity and meeting density.", strength: 84, trend: "up", impact: "high" },
    { id: "signal-4", decisionId: "decision-pipeline-prioritization", source: "sales", label: "AE capacity compression", detail: "High-scoring opportunities are concentrated in one pod.", strength: 67, trend: "up", impact: "medium" },
    { id: "signal-5", decisionId: "decision-workflow-optimization", source: "workflow", label: "Approval stall", detail: "A finance approval node retried six times in the same branch.", strength: 76, trend: "up", impact: "medium" },
    { id: "signal-6", decisionId: "decision-knowledge-refresh", source: "knowledge", label: "Stale policy memory", detail: "Pricing and packaging memory objects lag behind current playbooks.", strength: 72, trend: "up", impact: "medium" },
    { id: "signal-7", decisionId: "decision-knowledge-refresh", source: "memory", label: "Retrieval mismatch", detail: "Prompt OS is citing outdated launch criteria in recent reasoning traces.", strength: 69, trend: "up", impact: "medium" },
    { id: "signal-8", decisionId: "decision-revenue-opportunity", source: "crm", label: "Expansion propensity", detail: "Account health, product usage, and champion activity all crossed trigger thresholds.", strength: 89, trend: "up", impact: "high" },
    { id: "signal-9", decisionId: "decision-resource-allocation", source: "agent", label: "Agent overload", detail: "Finance review agents are above optimal load while operations has idle capacity.", strength: 74, trend: "up", impact: "medium" },
    { id: "signal-10", decisionId: "decision-resource-allocation", source: "runtime", label: "Queue imbalance", detail: "Execution latency is clustering around finance approval tasks.", strength: 71, trend: "up", impact: "medium" },
  ]

  const scores: DecisionPriorityScore[] = [
    { decisionId: "decision-customer-escalation", businessValue: 96, urgency: 98, risk: 93, confidence: 88, estimatedROI: 82, dependencies: 74, overallPriorityScore: 94 },
    { decisionId: "decision-pipeline-prioritization", businessValue: 91, urgency: 82, risk: 72, confidence: 82, estimatedROI: 88, dependencies: 66, overallPriorityScore: 86 },
    { decisionId: "decision-workflow-optimization", businessValue: 76, urgency: 74, risk: 68, confidence: 74, estimatedROI: 71, dependencies: 58, overallPriorityScore: 78 },
    { decisionId: "decision-knowledge-refresh", businessValue: 72, urgency: 61, risk: 55, confidence: 71, estimatedROI: 63, dependencies: 60, overallPriorityScore: 68 },
    { decisionId: "decision-revenue-opportunity", businessValue: 95, urgency: 85, risk: 78, confidence: 84, estimatedROI: 92, dependencies: 69, overallPriorityScore: 91 },
    { decisionId: "decision-resource-allocation", businessValue: 73, urgency: 70, risk: 67, confidence: 69, estimatedROI: 64, dependencies: 61, overallPriorityScore: 73 },
  ]

  const reasoning: DecisionReasoning[] = [
    {
      decisionId: "decision-customer-escalation",
      evidence: ["Support sentiment dropped across two executive accounts.", "Queue pressure is extending acknowledgement time.", "Memory shows prior churn warning on the same relationship."],
      signalsConsidered: ["Support", "Runtime Engine", "Persistent Memory", "Executive Intelligence Center"],
      businessRationale: "Fast intervention protects high-value recurring revenue and prevents reputation damage with a strategic customer.",
      confidenceExplanation: "Confidence is high because signals align across support, runtime, and historical memory rather than coming from a single noisy source.",
      potentialRisks: ["Escalation without executive context could over-rotate the response.", "If workflow backlog is misclassified, staffing changes could be unnecessary."],
      alternativeOptions: ["Delay action until next support sync.", "Assign a lower-tier review instead of executive escalation."],
    },
    {
      decisionId: "decision-pipeline-prioritization",
      evidence: ["Three opportunities increased stakeholder engagement in 48 hours.", "Planning Engine scored near-term close probability higher than current sequence order."],
      signalsConsidered: ["CRM", "Planning Engine", "Sales activity", "Memory"],
      businessRationale: "Re-prioritizing scarce selling time toward stronger expansion propensity should improve win velocity and forecast confidence.",
      confidenceExplanation: "Confidence remains high but not absolute because rep capacity and approval bottlenecks may still constrain execution.",
      potentialRisks: ["Over-indexing on short-term opportunities can starve earlier-stage pipeline.", "Manager intervention may be required to rebalance ownership."],
      alternativeOptions: ["Maintain current sequence for one more cycle.", "Use only automated nudges instead of manual reprioritization."],
    },
    {
      decisionId: "decision-workflow-optimization",
      evidence: ["Approval node retries repeated in the same path.", "Event Replay indicates one stalled branch pattern recurring this week."],
      signalsConsidered: ["Workflow Builder", "Event Processor", "Event Replay"],
      businessRationale: "Reducing repeat waits improves throughput and lowers executive review fatigue.",
      confidenceExplanation: "Confidence is medium-high because the workflow pattern is consistent, but downstream approval policy is still external to AIOS.",
      potentialRisks: ["Changing routing too early could conflict with finance controls."],
      alternativeOptions: ["Pause the workflow.", "Escalate only failed cases instead of rerouting the branch."],
    },
    {
      decisionId: "decision-knowledge-refresh",
      evidence: ["Prompt OS references stale launch criteria.", "Knowledge sync lag detected between docs and memory objects."],
      signalsConsidered: ["Prompt OS", "Knowledge", "Supabase Memory"],
      businessRationale: "Decision quality improves when the reasoning layer has current operating knowledge.",
      confidenceExplanation: "Confidence is medium because the downstream effect on revenue is indirect but still material for future decisions.",
      potentialRisks: ["Refreshing too broadly may introduce conflicting guidance without governance review."],
      alternativeOptions: ["Refresh only high-traffic memory objects.", "Wait for the next full content synchronization window."],
    },
    {
      decisionId: "decision-revenue-opportunity",
      evidence: ["Champion activity and usage expansion crossed threshold.", "Executive activity history suggests strong response to sponsor outreach."],
      signalsConsidered: ["CRM", "Executive Intelligence Center", "Sales", "Memory"],
      businessRationale: "An executive-led outreach now is likely to accelerate expansion before procurement friction appears.",
      confidenceExplanation: "Confidence is high because behavioral, pipeline, and historical signals all point in the same direction.",
      potentialRisks: ["Premature outreach could disrupt the account team's sequence."],
      alternativeOptions: ["Let the account team continue current motion.", "Run a smaller product workshop before executive outreach."],
    },
    {
      decisionId: "decision-resource-allocation",
      evidence: ["Orchestrator agents show uneven utilization.", "Finance review work is accumulating while operations has idle capacity."],
      signalsConsidered: ["Multi-Agent Orchestrator", "Planning Engine", "Runtime Engine"],
      businessRationale: "Rebalancing work protects SLA performance and keeps high-friction queues from growing.",
      confidenceExplanation: "Confidence is medium because the immediate benefits are clear, but long-term team tradeoffs require validation.",
      potentialRisks: ["Resource moves can degrade parallel priorities if done too aggressively."],
      alternativeOptions: ["Leave capacity unchanged and monitor one more cycle.", "Expand only temporary overflow handling."],
    },
  ]

  const actions: RecommendedAction[] = [
    { id: "action-escalation-1", decisionId: "decision-customer-escalation", title: "Escalate issue and contact customer", type: "contact-customer", expectedImpact: "Reduce churn risk and restore response confidence within 4 hours.", estimatedEffort: "Executive + CS coordination", confidence: 89, requiredApprovals: ["Customer Success Director"], owner: "Customer Success Director", status: "proposed" },
    { id: "action-escalation-2", decisionId: "decision-customer-escalation", title: "Launch support recovery workflow", type: "launch-workflow", expectedImpact: "Accelerate root-cause analysis and executive follow-up tasks.", estimatedEffort: "Low", confidence: 83, requiredApprovals: ["Operations Lead"], owner: "Operations Lead", status: "proposed" },
    { id: "action-pipeline-1", decisionId: "decision-pipeline-prioritization", title: "Re-rank top opportunities", type: "assign-agent", expectedImpact: "Increase close velocity on strongest deals this week.", estimatedEffort: "Sales manager review", confidence: 84, requiredApprovals: ["VP Revenue"], owner: "VP Revenue", status: "proposed" },
    { id: "action-workflow-1", decisionId: "decision-workflow-optimization", title: "Reroute stalled approval branch", type: "launch-workflow", expectedImpact: "Cut waiting-state retries and improve processing time.", estimatedEffort: "Workflow update", confidence: 75, requiredApprovals: ["Finance Operations"], owner: "Operations Lead", status: "proposed" },
    { id: "action-knowledge-1", decisionId: "decision-knowledge-refresh", title: "Update knowledge and memory objects", type: "update-knowledge", expectedImpact: "Increase reasoning accuracy in Prompt OS and executive briefings.", estimatedEffort: "Knowledge sync run", confidence: 72, requiredApprovals: ["Knowledge Operations"], owner: "Knowledge Operations", status: "proposed" },
    { id: "action-revenue-1", decisionId: "decision-revenue-opportunity", title: "Schedule executive sponsor outreach", type: "schedule-meeting", expectedImpact: "Accelerate expansion path and increase strategic account momentum.", estimatedEffort: "Medium", confidence: 86, requiredApprovals: ["Chief Revenue Officer"], owner: "Chief Revenue Officer", status: "proposed" },
    { id: "action-resource-1", decisionId: "decision-resource-allocation", title: "Reassign overloaded review queue", type: "assign-agent", expectedImpact: "Stabilize throughput and reduce latency on finance reviews.", estimatedEffort: "Low", confidence: 70, requiredApprovals: ["Chief Operating Officer"], owner: "Chief Operating Officer", status: "proposed" },
  ]

  const timeline: DecisionTimelineEntry[] = [
    { id: "timeline-1", decisionId: "decision-customer-escalation", label: "Decision created", type: "decision-created", timestamp: Date.now() - 1000 * 60 * 42, description: "High-value customer risk crossed the escalation threshold." },
    { id: "timeline-2", decisionId: "decision-pipeline-prioritization", label: "Signals updated", type: "signals-updated", timestamp: Date.now() - 1000 * 60 * 35, description: "CRM activity and planning signals raised revenue opportunity confidence." },
    { id: "timeline-3", decisionId: "decision-workflow-optimization", label: "Recommendation changed", type: "recommendation-changed", timestamp: Date.now() - 1000 * 60 * 28, description: "Workflow branch reroute became the top recommendation after replay evidence." },
    { id: "timeline-4", decisionId: "decision-knowledge-refresh", label: "Outcome recorded", type: "outcome-recorded", timestamp: Date.now() - 1000 * 60 * 19, description: "Reasoning quality drift was captured as a learning opportunity." },
    { id: "timeline-5", decisionId: "decision-revenue-opportunity", label: "Decision created", type: "decision-created", timestamp: Date.now() - 1000 * 60 * 12, description: "Expansion propensity threshold was exceeded for a strategic account." },
  ]

  const confidence: ConfidenceAnalysis[] = queue.map((item) => ({
    decisionId: item.id,
    score: item.confidence,
    level: item.confidenceLevel,
    explanation:
      item.confidenceLevel === "high"
        ? "Multiple signal classes agree and memory context matches historical patterns."
        : item.confidenceLevel === "medium"
          ? "Signals are directionally aligned, but one or more dependencies still need confirmation."
          : "Important evidence is incomplete or volatile, so human approval should remain mandatory.",
    drivers:
      item.id === "decision-customer-escalation"
        ? ["Support sentiment", "Queue depth", "Prior memory warnings"]
        : item.id === "decision-pipeline-prioritization"
          ? ["CRM activity", "Deal quality", "Planning sequence"]
          : item.id === "decision-workflow-optimization"
            ? ["Replay evidence", "Approval retries", "Execution latency"]
            : item.id === "decision-knowledge-refresh"
              ? ["Retrieval mismatch", "Content drift", "Knowledge sync lag"]
              : item.id === "decision-revenue-opportunity"
                ? ["Expansion propensity", "Executive history", "Champion activity"]
                : ["Agent load", "Queue imbalance", "Planner dependencies"],
  }))

  const outcomes: DecisionOutcome[] = [
    {
      id: "outcome-1",
      decisionId: "decision-customer-escalation",
      title: "Escalation recovery tracking",
      status: "learning",
      businessOutcome: "Waiting for recovery workflow acceptance.",
      executionResult: "No execution yet",
      learningOpportunity: "Track whether faster executive involvement improves retention in similar cases.",
    },
    {
      id: "outcome-2",
      decisionId: "decision-workflow-optimization",
      title: "Workflow latency reduction",
      status: "executed",
      businessOutcome: "Historical test path reduced wait-state accumulation.",
      executionResult: "Architecture ready for controlled rollout",
      learningOpportunity: "Measure false-positive reroutes before enabling broader automation.",
    },
    {
      id: "outcome-3",
      decisionId: "decision-knowledge-refresh",
      title: "Knowledge quality update",
      status: "accepted",
      businessOutcome: "Refresh request prepared for governance review.",
      executionResult: "Queued",
      learningOpportunity: "Measure Prompt OS reasoning lift after refreshed memory ingestion.",
    },
  ]

  return {
    queue,
    signals,
    scores,
    reasoning,
    actions,
    timeline,
    confidence,
    outcomes,
    selectedDecisionId: queue[0]?.id ?? "",
    query: "",
    liveMode: true,
  }
}

export function filterDecisionQueue(queue: DecisionQueueItem[], query: string) {
  if (!query.trim()) {
    return queue
  }

  const normalized = query.trim().toLowerCase()
  return queue.filter((item) =>
    [item.title, item.summary, item.category, item.owner, item.department, item.businessImpact].some((value) => value.toLowerCase().includes(normalized))
  )
}

export function selectDecisionSignals(signals: BusinessSignal[], decisionId: string) {
  return signals.filter((signal) => signal.decisionId === decisionId)
}

export function selectDecisionActions(actions: RecommendedAction[], decisionId: string) {
  return actions.filter((action) => action.decisionId === decisionId)
}

export function decisionSummary(queue: DecisionQueueItem[], confidence: ConfidenceAnalysis[]) {
  const pending = queue.filter((item) => item.status === DecisionStatus.Proposed || item.status === DecisionStatus.UnderReview).length
  const highConfidence = confidence.filter((item) => item.level === "high").length
  return `${pending} pending executive decisions with ${highConfidence} high-confidence recommendations ready for review.`
}