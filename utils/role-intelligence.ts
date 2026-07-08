import type {
  RoleAgent,
  RoleCategory,
  RoleDashboardState,
  RoleId,
  RoleProfile,
  RoleSnapshot,
} from "@/types"

type CategoryTemplate = Omit<RoleProfile, "id" | "label" | "category" | "department" | "homeSummary">

const executiveTemplate: CategoryTemplate = {
  responsibilities: ["Set enterprise direction", "Translate signals into board decisions", "Balance risk and growth"],
  primaryObjectives: ["Protect company health", "Accelerate strategic growth", "Maintain board readiness"],
  decisionAuthority: "Enterprise strategy, major investments, and executive prioritization.",
  approvalLimits: ["Company-wide initiatives", "Capital allocation guidance", "Board-facing decisions"],
  reportingStructure: "Board, owners, and executive leadership",
  preferredWorkflows: ["Board briefing", "Strategic review", "Executive decision log"],
  relevantAgents: ["Executive Assistant", "Planning Agent", "Governance Agent"],
  criticalSignals: ["company health", "strategic risk", "growth trajectory", "board readiness"],
  currentPriorities: ["Company health", "Strategic risk review", "Growth planning"],
  pendingDecisions: ["Investment priorities", "Leadership focus", "Board narrative"],
  searchPriorities: ["board summary", "strategic risk", "executive decisions"],
}

const revenueTemplate: CategoryTemplate = {
  responsibilities: ["Protect pipeline quality", "Coach revenue execution", "Resolve deal friction"],
  primaryObjectives: ["Increase revenue velocity", "Improve forecast confidence", "Keep deals moving"],
  decisionAuthority: "Pipeline prioritization, deal escalation, and revenue operating cadence.",
  approvalLimits: ["Deal escalations", "Discount review", "Revenue actions"],
  reportingStructure: "Commercial leadership and revenue operations",
  preferredWorkflows: ["Pipeline review", "Deal escalation", "Forecast refresh"],
  relevantAgents: ["Sales Agent", "Executive Assistant", "Planning Agent"],
  criticalSignals: ["pipeline coverage", "forecast risk", "deal velocity", "rep activity"],
  currentPriorities: ["Pipeline hygiene", "Forecast confidence", "Stalled deal recovery"],
  pendingDecisions: ["Top opportunities", "Escalation decisions", "Forecast adjustments"],
  searchPriorities: ["pipeline", "forecast", "deals", "rep activity"],
}

const marketingTemplate: CategoryTemplate = {
  responsibilities: ["Shape demand generation", "Align campaign focus", "Protect brand signal"],
  primaryObjectives: ["Drive qualified demand", "Improve campaign conversion", "Raise content coverage"],
  decisionAuthority: "Campaign strategy, messaging priorities, and demand generation focus.",
  approvalLimits: ["Campaign launches", "Content priorities", "Channel mix shifts"],
  reportingStructure: "Commercial leadership and growth operations",
  preferredWorkflows: ["Campaign planning", "Content review", "Lead quality analysis"],
  relevantAgents: ["Marketing Agent", "Knowledge Agent", "Planning Agent"],
  criticalSignals: ["campaign performance", "conversion quality", "content coverage", "brand reach"],
  currentPriorities: ["Demand generation", "Campaign optimization", "Content quality"],
  pendingDecisions: ["Campaign investment", "Channel focus", "Message positioning"],
  searchPriorities: ["campaign performance", "content coverage", "lead quality"],
}

const operationsTemplate: CategoryTemplate = {
  responsibilities: ["Remove bottlenecks", "Improve execution reliability", "Stabilize delivery"],
  primaryObjectives: ["Increase throughput", "Reduce friction", "Protect service levels"],
  decisionAuthority: "Operational sequencing, workflow health, and execution prioritization.",
  approvalLimits: ["Workflow changes", "Escalation routing", "Operational prioritization"],
  reportingStructure: "Operations leadership and process owners",
  preferredWorkflows: ["Bottleneck review", "Execution planning", "Escalation handling"],
  relevantAgents: ["Workflow Agent", "Operations Agent", "Planning Agent"],
  criticalSignals: ["workflow health", "bottlenecks", "throughput", "SLA pressure"],
  currentPriorities: ["Execution health", "Bottleneck removal", "Workflow reliability"],
  pendingDecisions: ["Process changes", "Escalation decisions", "Capacity alignment"],
  searchPriorities: ["bottlenecks", "workflow health", "execution priorities"],
}

const financeTemplate: CategoryTemplate = {
  responsibilities: ["Protect cash flow", "Govern approvals", "Maintain forecast discipline"],
  primaryObjectives: ["Improve forecast accuracy", "Preserve liquidity", "Control spending"],
  decisionAuthority: "Budget governance, approvals, cash planning, and financial controls.",
  approvalLimits: ["Budget requests", "Payment approvals", "Forecast adjustments"],
  reportingStructure: "Finance leadership and executive governance",
  preferredWorkflows: ["Cash review", "Approval routing", "Quarterly forecast"],
  relevantAgents: ["Finance Agent", "Executive Assistant", "Workflow Agent"],
  criticalSignals: ["cash flow", "forecast confidence", "approval load", "spend variance"],
  currentPriorities: ["Cash visibility", "Budget discipline", "Approval queue health"],
  pendingDecisions: ["Funding needs", "Approval backlog", "Forecast revisions"],
  searchPriorities: ["cash flow", "forecast", "approvals", "spend"],
}

const supportTemplate: CategoryTemplate = {
  responsibilities: ["Protect customer experience", "Resolve escalations", "Lift knowledge coverage"],
  primaryObjectives: ["Reduce response risk", "Improve SLA health", "Increase satisfaction"],
  decisionAuthority: "Escalation routing, support prioritization, and knowledge maintenance.",
  approvalLimits: ["Escalation changes", "Customer follow-up routing", "Knowledge updates"],
  reportingStructure: "Customer experience and service leadership",
  preferredWorkflows: ["Escalation review", "SLA monitoring", "Knowledge refresh"],
  relevantAgents: ["Support Agent", "Knowledge Agent", "Workflow Agent"],
  criticalSignals: ["SLA", "escalations", "customer satisfaction", "knowledge coverage"],
  currentPriorities: ["Escalation response", "SLA protection", "Knowledge hygiene"],
  pendingDecisions: ["Priority cases", "Customer follow-up", "Knowledge gaps"],
  searchPriorities: ["escalations", "SLA", "customer satisfaction", "knowledge coverage"],
}

const peopleTemplate: CategoryTemplate = {
  responsibilities: ["Align capacity to demand", "Protect manager effectiveness", "Support role clarity"],
  primaryObjectives: ["Increase organizational readiness", "Improve hiring velocity", "Lower people risk"],
  decisionAuthority: "Hiring priorities, team health, and organizational planning.",
  approvalLimits: ["Hiring plans", "Org changes", "Manager workflows"],
  reportingStructure: "People leadership and executive leadership",
  preferredWorkflows: ["Hiring review", "Org health review", "Capacity planning"],
  relevantAgents: ["Planning Agent", "Executive Assistant", "Knowledge Agent"],
  criticalSignals: ["capacity", "manager coverage", "attrition risk", "hiring flow"],
  currentPriorities: ["Capacity planning", "Org clarity", "Manager support"],
  pendingDecisions: ["Hiring approvals", "Team changes", "Org health actions"],
  searchPriorities: ["capacity", "hiring", "manager coverage"],
}

const deliveryTemplate: CategoryTemplate = {
  responsibilities: ["Track delivery health", "Protect milestones", "Manage dependency risk"],
  primaryObjectives: ["Hit milestones", "Reduce blocked work", "Improve predictability"],
  decisionAuthority: "Project sequencing, milestone focus, and delivery risk escalation.",
  approvalLimits: ["Milestone sequencing", "Dependency changes", "Delivery escalations"],
  reportingStructure: "Program leadership and delivery management",
  preferredWorkflows: ["Milestone review", "Risk review", "Dependency planning"],
  relevantAgents: ["Workflow Agent", "Planning Agent", "Knowledge Agent"],
  criticalSignals: ["milestone risk", "dependency load", "capacity", "delivery predictability"],
  currentPriorities: ["Milestone health", "Dependency removal", "Delivery predictability"],
  pendingDecisions: ["Sequencing", "Risk mitigation", "Resource tradeoffs"],
  searchPriorities: ["milestones", "dependencies", "delivery risk"],
}

const individualTemplate: CategoryTemplate = {
  responsibilities: ["Stay focused", "Complete assigned work", "Surface blockers early"],
  primaryObjectives: ["Maintain clarity", "Reduce context switching", "Close today’s work"],
  decisionAuthority: "Task execution, local prioritization, and blocker escalation.",
  approvalLimits: ["Task sequencing", "Self-service workflows", "Blocker escalations"],
  reportingStructure: "Team lead and immediate manager",
  preferredWorkflows: ["Daily focus planning", "Task completion", "Blocker escalation"],
  relevantAgents: ["Workflow Agent", "Knowledge Agent", "Executive Assistant"],
  criticalSignals: ["focus time", "task load", "blockers", "context pressure"],
  currentPriorities: ["Today’s focus", "Open tasks", "Blocker removal"],
  pendingDecisions: ["What to complete next", "What to escalate", "What to defer"],
  searchPriorities: ["tasks", "priorities", "blockers"],
}

const administrationTemplate: CategoryTemplate = {
  responsibilities: ["Protect system access", "Maintain policy coverage", "Keep governance visible"],
  primaryObjectives: ["Strengthen security posture", "Preserve audit readiness", "Reduce admin risk"],
  decisionAuthority: "System access, policy controls, and administrative governance.",
  approvalLimits: ["Access changes", "Policy changes", "Integration controls"],
  reportingStructure: "Platform operations and governance",
  preferredWorkflows: ["Access review", "Policy audit", "System health check"],
  relevantAgents: ["Knowledge Agent", "Workflow Agent", "Executive Assistant"],
  criticalSignals: ["audit coverage", "policy adherence", "system health", "access risk"],
  currentPriorities: ["Audit readiness", "Access governance", "System stability"],
  pendingDecisions: ["Policy updates", "Access review", "Integration controls"],
  searchPriorities: ["audit", "policy", "access", "system health"],
}

const customTemplate: CategoryTemplate = {
  responsibilities: ["Adapt to unique operating needs", "Surface the right decision context", "Respect local workflows"],
  primaryObjectives: ["Enable tailored intelligence", "Support specialized reporting", "Keep future extensibility open"],
  decisionAuthority: "Configured per organization or team.",
  approvalLimits: ["Configurable by admin", "Inherited from the parent role"],
  reportingStructure: "Configured per deployment",
  preferredWorkflows: ["Custom briefing", "Role-specific review", "Tailored workflow"],
  relevantAgents: ["Executive Assistant", "Workflow Agent", "Knowledge Agent"],
  criticalSignals: ["local priorities", "specialized workflows", "configured approvals", "role evolution"],
  currentPriorities: ["Role configuration", "Specialized workflows", "Local decision support"],
  pendingDecisions: ["Template overrides", "Role-specific KPIs", "Workflow mapping"],
  searchPriorities: ["custom role", "configured workflows", "specialized KPIs"],
}

function createRoleProfile(
  id: RoleId,
  label: string,
  category: RoleCategory,
  department: string,
  overrides?: Partial<RoleProfile>
): RoleProfile {
  const template =
    category === "executive"
      ? executiveTemplate
      : category === "revenue"
        ? revenueTemplate
        : category === "marketing"
          ? marketingTemplate
          : category === "operations"
            ? operationsTemplate
            : category === "finance"
              ? financeTemplate
              : category === "support"
                ? supportTemplate
                : category === "people"
                  ? peopleTemplate
                  : category === "delivery"
                    ? deliveryTemplate
                    : category === "individual"
                      ? individualTemplate
                      : category === "administration"
                        ? administrationTemplate
                        : customTemplate

  return {
    id,
    label,
    category,
    department,
    responsibilities: overrides?.responsibilities ?? template.responsibilities,
    primaryObjectives: overrides?.primaryObjectives ?? template.primaryObjectives,
    decisionAuthority: overrides?.decisionAuthority ?? template.decisionAuthority,
    approvalLimits: overrides?.approvalLimits ?? template.approvalLimits,
    reportingStructure: overrides?.reportingStructure ?? template.reportingStructure,
    preferredWorkflows: overrides?.preferredWorkflows ?? template.preferredWorkflows,
    relevantAgents: overrides?.relevantAgents ?? template.relevantAgents,
    criticalSignals: overrides?.criticalSignals ?? template.criticalSignals,
    homeSummary: overrides?.homeSummary ?? `${label} intelligence for ${department.toLowerCase()} decisions.`,
    currentPriorities: overrides?.currentPriorities ?? template.currentPriorities,
    pendingDecisions: overrides?.pendingDecisions ?? template.pendingDecisions,
    searchPriorities: overrides?.searchPriorities ?? template.searchPriorities,
  }
}

export const roleProfiles = {
  ceo: createRoleProfile("ceo", "CEO", "executive", "Executive Leadership", {
    homeSummary: "Company health, strategic risks, board summary, and the decisions that shape growth.",
  }),
  coo: createRoleProfile("coo", "COO", "operations", "Operations", {
    homeSummary: "Operational execution, bottlenecks, workflow health, and delivery reliability.",
  }),
  cfo: createRoleProfile("cfo", "CFO", "finance", "Finance", {
    homeSummary: "Financial KPIs, cash flow visibility, forecast confidence, and approvals.",
  }),
  cto: createRoleProfile("cto", "CTO", "administration", "Technology", {
    homeSummary: "Infrastructure health, deployment cadence, engineering velocity, and risk control.",
    relevantAgents: ["Workflow Agent", "Knowledge Agent", "Executive Assistant"],
    criticalSignals: ["system health", "deployments", "engineering velocity", "incident pressure"],
  }),
  cmo: createRoleProfile("cmo", "CMO", "marketing", "Marketing", {
    homeSummary: "Demand generation, campaign performance, market signal, and content coverage.",
  }),
  cro: createRoleProfile("cro", "CRO", "revenue", "Revenue", {
    homeSummary: "Pipeline coverage, forecast confidence, deal momentum, and revenue risk.",
  }),
  chro: createRoleProfile("chro", "CHRO", "people", "People", {
    homeSummary: "Organizational capacity, hiring flow, manager coverage, and retention risk.",
  }),
  "sales-director": createRoleProfile("sales-director", "Sales Director", "revenue", "Sales"),
  "sales-manager": createRoleProfile("sales-manager", "Sales Manager", "revenue", "Sales"),
  "account-executive": createRoleProfile("account-executive", "Account Executive", "revenue", "Sales"),
  "marketing-director": createRoleProfile("marketing-director", "Marketing Director", "marketing", "Marketing"),
  "marketing-manager": createRoleProfile("marketing-manager", "Marketing Manager", "marketing", "Marketing"),
  "operations-director": createRoleProfile("operations-director", "Operations Director", "operations", "Operations"),
  "operations-manager": createRoleProfile("operations-manager", "Operations Manager", "operations", "Operations"),
  "customer-success": createRoleProfile("customer-success", "Customer Success", "support", "Customer Success"),
  "support-manager": createRoleProfile("support-manager", "Support Manager", "support", "Support"),
  "finance-manager": createRoleProfile("finance-manager", "Finance Manager", "finance", "Finance"),
  "project-manager": createRoleProfile("project-manager", "Project Manager", "delivery", "Delivery"),
  "team-lead": createRoleProfile("team-lead", "Team Lead", "delivery", "Delivery"),
  "individual-contributor": createRoleProfile("individual-contributor", "Individual Contributor", "individual", "Team"),
  "system-administrator": createRoleProfile("system-administrator", "System Administrator", "administration", "Platform"),
  "custom-role": createRoleProfile("custom-role", "Custom Role", "custom", "Custom"),
} satisfies Record<RoleId, RoleProfile>

export const rolePreviewRoles: RoleId[] = ["ceo", "coo", "sales-director", "support-manager", "finance-manager", "marketing-director"]

export const roleOrder: RoleId[] = [
  "ceo",
  "coo",
  "cfo",
  "cto",
  "cmo",
  "cro",
  "chro",
  "sales-director",
  "sales-manager",
  "account-executive",
  "marketing-director",
  "marketing-manager",
  "operations-director",
  "operations-manager",
  "customer-success",
  "support-manager",
  "finance-manager",
  "project-manager",
  "team-lead",
  "individual-contributor",
  "system-administrator",
  "custom-role",
]

export function createRoleIntelligenceDefaults() {
  return {
    currentRoleId: "ceo" as RoleId,
    previewRoleId: null as RoleId | null,
    simulationEnabled: false,
  }
}

function formatPercentage(value: number) {
  return `${Math.round(value)}%`
}

function buildExecutiveState(role: RoleProfile, snapshot: RoleSnapshot): RoleDashboardState {
  return {
    headline: `${role.label} intelligence`,
    subheadline: "Company health, strategic risk, and board-ready decisions.",
    summaryPoints: [
      `Runtime is processing ${snapshot.runtimeEventCount} active signals with ${snapshot.runtimeRunningAgents} running agents.`,
      snapshot.decisionSummary,
      snapshot.promptPreview ? `Prompt OS is focused on ${snapshot.promptPreview.slice(0, 72)}.` : "Prompt OS is ready for executive framing.",
    ],
    kpis: [
      { label: "Company Health", value: formatPercentage(92 - Math.min(snapshot.runtimeQueueDepth, 6)), change: snapshot.runtimeQueueDepth > 10 ? "-2 pts" : "+1 pt", detail: "Balanced across the active executive stack", tone: snapshot.runtimeQueueDepth > 10 ? "warning" : "positive" },
      { label: "Board Readiness", value: formatPercentage(snapshot.explainabilityCoverage), change: snapshot.explainabilityCoverage > 90 ? "+3 pts" : "+1 pt", detail: "Governance coverage for board narrative", tone: snapshot.explainabilityCoverage > 90 ? "positive" : "neutral" },
      { label: "Strategic Risk", value: snapshot.complianceAttention > 0 ? "Elevated" : "Contained", change: snapshot.complianceAttention > 0 ? "+1 watch" : "Steady", detail: "Governance center and memory stay aligned", tone: snapshot.complianceAttention > 0 ? "warning" : "positive" },
      { label: "Decision Confidence", value: snapshot.decisionConfidence ? formatPercentage(snapshot.decisionConfidence) : "82%", change: snapshot.decisionConfidence && snapshot.decisionConfidence > 85 ? "+2 pts" : "Stable", detail: "Decision engine confidence for current priority", tone: "positive" },
    ],
    recommendations: [
      { id: "exec-investment", title: "Strategic investment review", reason: "Growth signals remain strong but governance attention is moving up.", action: "Review capital allocation and timing.", expectedOutcome: "Sharper board narrative and better investment discipline.", confidence: 91, priority: "high" },
      { id: "exec-briefing", title: "Board summary refresh", reason: "Executive intelligence has enough live signal to produce a sharper update.", action: "Generate the board summary and highlight major decisions.", expectedOutcome: "Faster executive alignment on priorities.", confidence: 88, priority: "medium" },
      { id: "exec-risk", title: "Strategic risk watch", reason: "Governance center is reporting active compliance attention.", action: "Escalate risks that could alter the quarterly plan.", expectedOutcome: "Earlier intervention on high-value risks.", confidence: 86, priority: "critical" },
    ],
    agents: [
      { id: "executive-assistant", name: "Executive Assistant", focus: "Board prep, executive summaries, and decision framing.", reason: "Keeps leadership context concise and decision-ready." },
      { id: "planning-agent", name: "Planning Agent", focus: "Scenario planning, execution sequencing, and priorities.", reason: "Connects executive goals to operating plans." },
      { id: "governance-agent", name: "Governance Agent", focus: "Policy, risk, and decision lineage.", reason: "Explains why decisions are safe to move forward." },
    ],
    alerts: [
      { id: "exec-alert-risk", title: "Strategic risk review due", detail: snapshot.complianceAttention > 0 ? "Governance center has active attention that should appear in the board narrative." : "No critical governance risk is currently detected.", priority: snapshot.complianceAttention > 0 ? "high" : "low", source: "Governance Center", recommendation: "Include the risk in the next executive briefing." },
      { id: "exec-alert-brief", title: "Board summary needs refresh", detail: "Role intelligence can consolidate the latest decisions and execution signals.", priority: "medium", source: "Executive Intelligence", recommendation: "Regenerate the board summary before the next leadership checkpoint." },
    ],
    workflows: [
      { id: "exec-board-pack", name: "Board pack refresh", reason: "Keeps board material current with live signals.", owner: "Executive Assistant", status: "recommended" },
      { id: "exec-strategy-review", name: "Strategy review", reason: "Connects strategic intent with operating constraints.", owner: "Planning Agent", status: "ready" },
      { id: "exec-decision-log", name: "Major decision log", reason: "Captures decisions, evidence, and follow-up actions.", owner: "Governance Agent", status: "ready" },
    ],
    prompts: [
      { id: "exec-prompt-risk", title: "Summarize strategic risks", prompt: "Summarize the strategic risks that matter most this week and explain the likely business impact.", context: "Executive lens" },
      { id: "exec-prompt-board", title: "Prepare board summary", prompt: "Prepare a board-ready summary with company health, major decisions, and next actions.", context: "Board lens" },
    ],
    insights: [
      { id: "exec-insight-priority", title: "Current priority", detail: role.currentPriorities[0] ?? "Company health", evidence: "Executive role profile and live runtime signals." },
      { id: "exec-insight-decision", title: "Pending decision", detail: role.pendingDecisions[0] ?? "Board narrative", evidence: "Decision engine, governance center, and Prompt OS." },
    ],
  }
}

function buildRevenueState(role: RoleProfile, snapshot: RoleSnapshot): RoleDashboardState {
  return {
    headline: `${role.label} intelligence`,
    subheadline: "Pipeline, forecast, and deal control for revenue decisions.",
    summaryPoints: [
      `Pipeline is being tracked across ${snapshot.runtimeRunningAgents} active agents and ${snapshot.runtimePendingTasks} pending tasks.`,
      snapshot.decisionSummary,
      snapshot.planningFocus ? `Planning engine is focused on ${snapshot.planningFocus}.` : "Planning engine is ready to prioritize revenue motions.",
    ],
    kpis: [
      { label: "Pipeline Coverage", value: snapshot.decisionConfidence ? formatPercentage(snapshot.decisionConfidence) : "84%", change: "+2 pts", detail: "Live opportunity coverage and forecast depth", tone: "positive" },
      { label: "Forecast Confidence", value: snapshot.decisionConfidence ? formatPercentage(snapshot.decisionConfidence - 3) : "81%", change: snapshot.decisionConfidence && snapshot.decisionConfidence > 85 ? "+1 pt" : "Flat", detail: "Decision engine and revenue signal alignment", tone: snapshot.decisionConfidence && snapshot.decisionConfidence > 85 ? "positive" : "neutral" },
      { label: "Deal Velocity", value: `${Math.max(12, 28 - snapshot.runtimeQueueDepth)}/wk`, change: snapshot.runtimeQueueDepth > 8 ? "-1" : "+2", detail: "Prioritized by pipeline health and execution pressure", tone: snapshot.runtimeQueueDepth > 8 ? "warning" : "positive" },
      { label: "Rep Activity", value: `${Math.max(18, snapshot.runtimeRunningAgents * 6)} touches`, change: "+3", detail: "Current activity and follow-up momentum", tone: "positive" },
    ],
    recommendations: [
      { id: "revenue-stalled", title: "Prioritize stalled opportunities", reason: "Forecast confidence is steady but deal velocity can improve.", action: "Escalate the top stalled opportunities and reassign coverage.", expectedOutcome: "Cleaner pipeline and faster revenue movement.", confidence: 89, priority: "high" },
      { id: "revenue-refresh", title: "Refresh the forecast", reason: "Decision engine and planning engine already have the necessary context.", action: "Regenerate the forecast view with current signals.", expectedOutcome: "Higher confidence in quarter-end expectations.", confidence: 86, priority: "medium" },
      { id: "revenue-coaching", title: "Coach rep activity", reason: "Rep activity is visible but may benefit from tighter focus.", action: "Rebalance attention toward high-probability deals.", expectedOutcome: "More productive revenue execution.", confidence: 84, priority: "medium" },
    ],
    agents: [
      { id: "sales-agent", name: "Sales Agent", focus: "Deal prioritization, follow-up sequencing, and revenue next steps.", reason: "Keeps opportunities moving with less manual triage." },
      { id: "planning-agent", name: "Planning Agent", focus: "Quota planning and revenue scenario review.", reason: "Connects forecast changes to execution plans." },
      { id: "executive-assistant", name: "Executive Assistant", focus: "Decision briefs and deal summaries.", reason: "Surfaces what matters to the revenue leader." },
    ],
    alerts: [
      { id: "revenue-alert-deal", title: "Stalled deal risk", detail: "A few deals may need executive attention before the next forecast checkpoint.", priority: "high", source: "Decision Engine", recommendation: "Escalate the highest-value stalled deals." },
      { id: "revenue-alert-forecast", title: "Forecast refresh recommended", detail: "Forecast confidence can be tightened with a new role-specific brief.", priority: "medium", source: "Planning Engine", recommendation: "Regenerate the forecast and inspect the top risk drivers." },
    ],
    workflows: [
      { id: "revenue-pipeline", name: "Pipeline review", reason: "Keeps the revenue team focused on the highest-value opportunities.", owner: "Sales Agent", status: "recommended" },
      { id: "revenue-forecast", name: "Forecast refresh", reason: "Aligns leadership, pipeline, and execution signals.", owner: "Planning Agent", status: "ready" },
      { id: "revenue-escalation", name: "Deal escalation", reason: "Pulls in the right decision-makers for stuck opportunities.", owner: "Executive Assistant", status: "ready" },
    ],
    prompts: [
      { id: "revenue-prompt-opps", title: "Prioritize today's opportunities", prompt: "Prioritize today's revenue opportunities and explain why each should stay at the top of the queue.", context: "Revenue lens" },
      { id: "revenue-prompt-forecast", title: "Explain forecast risk", prompt: "Explain the main drivers behind forecast risk and what to do next.", context: "Forecast lens" },
    ],
    insights: [
      { id: "revenue-insight-priority", title: "Current priority", detail: role.currentPriorities[0] ?? "Pipeline hygiene", evidence: "Revenue lens and live execution signals." },
      { id: "revenue-insight-decision", title: "Pending decision", detail: role.pendingDecisions[0] ?? "Escalation decisions", evidence: "Decision engine, workflow builder, and runtime telemetry." },
    ],
  }
}

function buildMarketingState(role: RoleProfile, snapshot: RoleSnapshot): RoleDashboardState {
  return {
    headline: `${role.label} intelligence`,
    subheadline: "Campaigns, demand, and market signal in one adaptive view.",
    summaryPoints: [
      `Knowledge Graph tracks ${snapshot.knowledgeNodes} entities and ${snapshot.knowledgeEdges} relationships supporting campaign context.`,
      snapshot.decisionSummary,
      snapshot.promptPreview ? `Prompt OS is aligned to ${snapshot.promptPreview.slice(0, 72)}.` : "Prompt OS is ready to synthesize campaign messaging.",
    ],
    kpis: [
      { label: "Demand Generation", value: `${78 + Math.min(snapshot.knowledgeNodes, 12)}%`, change: "+2 pts", detail: "Campaign and signal density across the market", tone: "positive" },
      { label: "Campaign Health", value: `${82 + Math.min(snapshot.knowledgeEdges, 8)}%`, change: snapshot.runtimeQueueDepth > 8 ? "-1 pt" : "+1 pt", detail: "How well campaigns are tracking to demand", tone: "positive" },
      { label: "Conversion Quality", value: snapshot.decisionConfidence ? formatPercentage(snapshot.decisionConfidence) : "83%", change: "+1 pt", detail: "Signal quality for lead prioritization", tone: "neutral" },
      { label: "Content Coverage", value: `${70 + Math.min(snapshot.knowledgeEdges, 20)}%`, change: "+2 pts", detail: "Coverage across the main buying motions", tone: "positive" },
    ],
    recommendations: [
      { id: "marketing-campaign", title: "Refocus the campaign mix", reason: "Demand signal is available but can be converted more intelligently.", action: "Shift attention to the highest-performing channels and segments.", expectedOutcome: "Better conversion and cleaner campaign prioritization.", confidence: 87, priority: "high" },
      { id: "marketing-content", title: "Refresh content coverage", reason: "Search priorities show a need for sharper content alignment.", action: "Rebuild the content angle around the strongest signals.", expectedOutcome: "Higher relevance for the next campaign cycle.", confidence: 84, priority: "medium" },
      { id: "marketing-insight", title: "Create a market brief", reason: "The current data set can support a stronger market narrative.", action: "Produce a concise market update for leadership.", expectedOutcome: "Faster alignment on demand strategy.", confidence: 82, priority: "medium" },
    ],
    agents: [
      { id: "marketing-agent", name: "Marketing Agent", focus: "Demand generation, campaign prioritization, and channel focus.", reason: "Keeps the team on the right growth levers." },
      { id: "knowledge-agent", name: "Knowledge Agent", focus: "Message, market signal, and content context.", reason: "Connects product knowledge to campaign execution." },
      { id: "planning-agent", name: "Planning Agent", focus: "Launch sequencing and campaign planning.", reason: "Supports better timing and alignment." },
    ],
    alerts: [
      { id: "marketing-alert-campaign", title: "Campaign performance to review", detail: "One or more campaigns may benefit from a new role-specific brief.", priority: "medium", source: "Executive Intelligence", recommendation: "Refresh campaign priorities before the next sprint." },
      { id: "marketing-alert-content", title: "Content coverage gap", detail: "The knowledge graph suggests a few message areas need fuller coverage.", priority: "low", source: "Knowledge Graph", recommendation: "Add content to the most underrepresented themes." },
    ],
    workflows: [
      { id: "marketing-campaign-workflow", name: "Campaign planning", reason: "Aligns demand goals to the next launch.", owner: "Marketing Agent", status: "recommended" },
      { id: "marketing-market-brief", name: "Market brief", reason: "Consolidates signal into a leadership-ready update.", owner: "Knowledge Agent", status: "ready" },
      { id: "marketing-content-review", name: "Content review", reason: "Keeps message coverage aligned to the pipeline.", owner: "Planning Agent", status: "ready" },
    ],
    prompts: [
      { id: "marketing-prompt-campaign", title: "Review campaign risks", prompt: "Review the most important campaign risks and explain how to improve demand quality.", context: "Marketing lens" },
      { id: "marketing-prompt-priority", title: "Prioritize demand work", prompt: "Prioritize today's demand generation work and explain which signals matter most.", context: "Growth lens" },
    ],
    insights: [
      { id: "marketing-insight-priority", title: "Current priority", detail: role.currentPriorities[0] ?? "Demand generation", evidence: "Marketing lens and live knowledge graph coverage." },
      { id: "marketing-insight-decision", title: "Pending decision", detail: role.pendingDecisions[0] ?? "Channel focus", evidence: "Planning engine, knowledge graph, and prompt OS." },
    ],
  }
}

function buildOperationsState(role: RoleProfile, snapshot: RoleSnapshot): RoleDashboardState {
  return {
    headline: `${role.label} intelligence`,
    subheadline: "Execution reliability, bottlenecks, and workflow health.",
    summaryPoints: [
      `Runtime queue depth is ${snapshot.runtimeQueueDepth} and ${snapshot.runtimePendingTasks} tasks are waiting on action.`,
      snapshot.decisionSummary,
      snapshot.workflowRunning && snapshot.activeWorkflow ? `Workflow Builder is actively running ${snapshot.activeWorkflow}.` : "Workflow Builder is ready to optimize execution.",
    ],
    kpis: [
      { label: "Workflow Health", value: snapshot.workflowRunning ? "94%" : "88%", change: snapshot.workflowRunning ? "+2 pts" : "Stable", detail: "Health of the active execution stack", tone: snapshot.workflowRunning ? "positive" : "neutral" },
      { label: "Bottlenecks", value: `${Math.max(1, snapshot.runtimePendingTasks)}`, change: snapshot.runtimePendingTasks > 4 ? "+2" : "Flat", detail: "Operational friction requiring attention", tone: snapshot.runtimePendingTasks > 4 ? "warning" : "neutral" },
      { label: "Throughput", value: `${Math.max(42, 100 - snapshot.runtimeQueueDepth * 4)}%`, change: snapshot.runtimeQueueDepth > 10 ? "-3 pts" : "+2 pts", detail: "Execution rate across current workflows", tone: snapshot.runtimeQueueDepth > 10 ? "warning" : "positive" },
      { label: "SLA Health", value: `${90 - Math.min(snapshot.runtimePendingTasks, 6)}%`, change: snapshot.runtimePendingTasks > 4 ? "-1 pt" : "+1 pt", detail: "Service level pressure and operational recovery", tone: snapshot.runtimePendingTasks > 4 ? "warning" : "positive" },
    ],
    recommendations: [
      { id: "ops-bottleneck", title: "Resolve the bottleneck", reason: "Queue depth and pending tasks indicate a workflow pinch point.", action: "Reassign the highest-friction workflow and remove the blocker.", expectedOutcome: "Cleaner operational flow and faster completion.", confidence: 90, priority: "critical" },
      { id: "ops-workflow", title: "Optimize the workflow", reason: "The workflow builder can compress the steps that matter most.", action: "Simplify the active workflow and reduce handoffs.", expectedOutcome: "Higher throughput with less manual coordination.", confidence: 87, priority: "high" },
      { id: "ops-escalation", title: "Prepare escalation guidance", reason: "A more decisive escalation path will protect delivery.", action: "Define the next decision owner for the blocked work.", expectedOutcome: "Faster recovery when exceptions appear.", confidence: 84, priority: "medium" },
    ],
    agents: [
      { id: "workflow-agent", name: "Workflow Agent", focus: "Execution sequencing, bottlenecks, and handoff reduction.", reason: "Keeps operations running with fewer interruptions." },
      { id: "operations-agent", name: "Operations Agent", focus: "Process health, task flow, and service recovery.", reason: "Focuses on throughput and service continuity." },
      { id: "planning-agent", name: "Planning Agent", focus: "Capacity planning and operational sequencing.", reason: "Connects resource allocation to workflow demand." },
    ],
    alerts: [
      { id: "ops-alert-queue", title: "Queue depth elevated", detail: "Runtime processing shows a noticeable queue that should be triaged.", priority: snapshot.runtimeQueueDepth > 10 ? "high" : "medium", source: "Runtime Engine", recommendation: "Reduce the queue before more work is added." },
      { id: "ops-alert-workflow", title: "Workflow review recommended", detail: "The active workflow can be simplified to reduce friction.", priority: "medium", source: "Workflow Builder", recommendation: "Review the current workflow steps and remove unnecessary handoffs." },
    ],
    workflows: [
      { id: "ops-bottleneck-workflow", name: "Bottleneck review", reason: "Targets the current execution pinch point.", owner: "Workflow Agent", status: "recommended" },
      { id: "ops-escalation-workflow", name: "Escalation path", reason: "Clarifies who owns the next decision.", owner: "Operations Agent", status: "ready" },
      { id: "ops-capacity-workflow", name: "Capacity planning", reason: "Ensures the next set of work can actually move.", owner: "Planning Agent", status: "ready" },
    ],
    prompts: [
      { id: "ops-prompt-bottleneck", title: "Identify bottlenecks", prompt: "Identify the operational bottlenecks that matter most right now and explain how to remove them.", context: "COO lens" },
      { id: "ops-prompt-execution", title: "Summarize execution risk", prompt: "Summarize the execution risks that should be escalated today.", context: "Operations lens" },
    ],
    insights: [
      { id: "ops-insight-priority", title: "Current priority", detail: role.currentPriorities[0] ?? "Execution health", evidence: "Runtime Engine and Workflow Builder signals." },
      { id: "ops-insight-decision", title: "Pending decision", detail: role.pendingDecisions[0] ?? "Process changes", evidence: "Decision Engine, Planning Engine, and workflow telemetry." },
    ],
  }
}

function buildFinanceState(role: RoleProfile, snapshot: RoleSnapshot): RoleDashboardState {
  return {
    headline: `${role.label} intelligence`,
    subheadline: "Cash flow, forecast quality, and approval discipline.",
    summaryPoints: [
      `Finance approvals are being monitored against ${snapshot.runtimePendingTasks} pending tasks and ${snapshot.runtimeQueueDepth} queued events.`,
      snapshot.decisionSummary,
      snapshot.boardReportName ? `Executive reporting is currently using ${snapshot.boardReportName}.` : "Executive reporting is ready to reflect the latest financial view.",
    ],
    kpis: [
      { label: "Cash Flow", value: `${88 - Math.min(snapshot.runtimePendingTasks, 8)}%`, change: snapshot.runtimePendingTasks > 4 ? "-1 pt" : "+1 pt", detail: "Liquidity pressure and near-term spend visibility", tone: snapshot.runtimePendingTasks > 4 ? "warning" : "positive" },
      { label: "Forecast Confidence", value: snapshot.decisionConfidence ? formatPercentage(snapshot.decisionConfidence) : "86%", change: "+1 pt", detail: "Decision engine confidence on financial actions", tone: "positive" },
      { label: "Approvals", value: `${Math.max(1, snapshot.runtimePendingTasks)}`, change: snapshot.runtimePendingTasks > 5 ? "+2" : "Flat", detail: "Open finance approvals and review actions", tone: snapshot.runtimePendingTasks > 5 ? "warning" : "neutral" },
      { label: "Burn Discipline", value: `${Math.max(70, 96 - snapshot.runtimeQueueDepth)}%`, change: snapshot.runtimeQueueDepth > 10 ? "-2 pts" : "+1 pt", detail: "How well spend is tracking to plan", tone: snapshot.runtimeQueueDepth > 10 ? "warning" : "positive" },
    ],
    recommendations: [
      { id: "finance-budget", title: "Review the budget request", reason: "Approval load and task pressure suggest a fresh review is warranted.", action: "Inspect the budget request and approve only the essential spend.", expectedOutcome: "Cleaner budget control and better cash discipline.", confidence: 90, priority: "high" },
      { id: "finance-forecast", title: "Refresh the cash forecast", reason: "Forecast confidence can be tightened with the current signals.", action: "Regenerate the quarterly forecast and review the variance drivers.", expectedOutcome: "Improved clarity on cash position and runway.", confidence: 88, priority: "medium" },
      { id: "finance-controls", title: "Tighten approval controls", reason: "A little more control will protect finance decisions.", action: "Route large spend requests through a stricter workflow.", expectedOutcome: "Less variance and better governance.", confidence: 85, priority: "high" },
    ],
    agents: [
      { id: "finance-agent", name: "Finance Agent", focus: "Approval routing, forecast support, and cash discipline.", reason: "Protects financial signal quality." },
      { id: "workflow-agent", name: "Workflow Agent", focus: "Budget routing and approval flows.", reason: "Reduces manual finance friction." },
      { id: "executive-assistant", name: "Executive Assistant", focus: "Decision summaries and finance briefings.", reason: "Helps leadership review the right data quickly." },
    ],
    alerts: [
      { id: "finance-alert-approval", title: "Approvals need review", detail: "Finance approvals are accumulating and may need tighter routing.", priority: "high", source: "Governance Center", recommendation: "Review the largest open approvals first." },
      { id: "finance-alert-forecast", title: "Forecast needs a refresh", detail: "A new financial brief would improve confidence for the next planning cycle.", priority: "medium", source: "Planning Engine", recommendation: "Regenerate the forecast with current spend assumptions." },
    ],
    workflows: [
      { id: "finance-approval-workflow", name: "Budget approval", reason: "Keeps spending aligned to approved priorities.", owner: "Finance Agent", status: "recommended" },
      { id: "finance-forecast-workflow", name: "Quarterly forecast", reason: "Updates the cash view for leadership.", owner: "Executive Assistant", status: "ready" },
      { id: "finance-controls-workflow", name: "Spend controls", reason: "Applies stricter governance to larger financial actions.", owner: "Workflow Agent", status: "ready" },
    ],
    prompts: [
      { id: "finance-prompt-cash", title: "Forecast quarterly cash flow", prompt: "Forecast quarterly cash flow and highlight the main assumptions driving confidence or risk.", context: "Finance lens" },
      { id: "finance-prompt-approval", title: "Summarize approval risks", prompt: "Summarize the approval risks that should be controlled before spend is released.", context: "Finance lens" },
    ],
    insights: [
      { id: "finance-insight-priority", title: "Current priority", detail: role.currentPriorities[0] ?? "Cash visibility", evidence: "Finance role lens and current runtime signal pressure." },
      { id: "finance-insight-decision", title: "Pending decision", detail: role.pendingDecisions[0] ?? "Funding needs", evidence: "Decision engine, governance center, and executive reporting." },
    ],
  }
}

function buildSupportState(role: RoleProfile, snapshot: RoleSnapshot): RoleDashboardState {
  return {
    headline: `${role.label} intelligence`,
    subheadline: "Service levels, escalations, and knowledge coverage.",
    summaryPoints: [
      `Support sees ${snapshot.runtimePendingTasks} pending actions and ${snapshot.runtimeRunningAgents} active agents on the floor.`,
      snapshot.decisionSummary,
      snapshot.promptPreview ? `Prompt OS is ready to frame ${snapshot.promptPreview.slice(0, 72)}.` : "Prompt OS is ready to guide the next support decision.",
    ],
    kpis: [
      { label: "SLA Health", value: `${94 - Math.min(snapshot.runtimePendingTasks, 8)}%`, change: snapshot.runtimePendingTasks > 4 ? "-2 pts" : "+1 pt", detail: "Service-level pressure and response reliability", tone: snapshot.runtimePendingTasks > 4 ? "warning" : "positive" },
      { label: "Escalations", value: `${Math.max(1, snapshot.runtimePendingTasks)}`, change: snapshot.runtimePendingTasks > 5 ? "+2" : "Flat", detail: "Open support escalations needing attention", tone: snapshot.runtimePendingTasks > 5 ? "warning" : "neutral" },
      { label: "Customer Satisfaction", value: `${88 + Math.min(snapshot.knowledgeNodes, 7)}%`, change: "+1 pt", detail: "Customer experience sentiment and response quality", tone: "positive" },
      { label: "Knowledge Coverage", value: `${75 + Math.min(snapshot.knowledgeEdges, 15)}%`, change: "+2 pts", detail: "How much of the support surface is documented", tone: "positive" },
    ],
    recommendations: [
      { id: "support-escalation", title: "Handle the highest escalations", reason: "Support load is visible and needs more focused routing.", action: "Prioritize the top escalations and bring in the right agents.", expectedOutcome: "Faster recovery and fewer customer delays.", confidence: 91, priority: "critical" },
      { id: "support-knowledge", title: "Refresh knowledge coverage", reason: "The knowledge graph shows room to improve the self-service surface.", action: "Add missing support guidance and update the knowledge base.", expectedOutcome: "More self-serve resolution and fewer repeats.", confidence: 86, priority: "medium" },
      { id: "support-sla", title: "Protect SLA performance", reason: "The team can prevent the next service dip by rebalancing work.", action: "Move the most time-sensitive tickets to the top.", expectedOutcome: "Better SLA outcomes and calmer support flow.", confidence: 84, priority: "high" },
    ],
    agents: [
      { id: "support-agent", name: "Support Agent", focus: "Escalation handling, triage, and customer recovery.", reason: "Keeps urgent customer issues from stalling." },
      { id: "knowledge-agent", name: "Knowledge Agent", focus: "Documentation and knowledge coverage.", reason: "Raises self-service quality and response speed." },
      { id: "workflow-agent", name: "Workflow Agent", focus: "Escalation routing and service workflows.", reason: "Improves service consistency across the queue." },
    ],
    alerts: [
      { id: "support-alert-sla", title: "SLA pressure detected", detail: "Support should focus on the quickest path to resolution.", priority: snapshot.runtimePendingTasks > 4 ? "high" : "medium", source: "Runtime Engine", recommendation: "Pull the most urgent tickets into the top of the queue." },
      { id: "support-alert-knowledge", title: "Knowledge gap spotted", detail: "A few support topics could benefit from improved documentation.", priority: "medium", source: "Knowledge Graph", recommendation: "Update knowledge content for repeated issues." },
    ],
    workflows: [
      { id: "support-escalation-workflow", name: "Escalation review", reason: "Gets urgent cases to the right owner faster.", owner: "Support Agent", status: "recommended" },
      { id: "support-knowledge-workflow", name: "Knowledge refresh", reason: "Improves self-service and team consistency.", owner: "Knowledge Agent", status: "ready" },
      { id: "support-sla-workflow", name: "SLA monitor", reason: "Protects service levels during high load.", owner: "Workflow Agent", status: "ready" },
    ],
    prompts: [
      { id: "support-prompt-escalations", title: "Summarize escalations", prompt: "Summarize the current escalations and explain the quickest path to customer recovery.", context: "Support lens" },
      { id: "support-prompt-knowledge", title: "Assess knowledge coverage", prompt: "Assess the knowledge coverage gaps that should be fixed next.", context: "Support lens" },
    ],
    insights: [
      { id: "support-insight-priority", title: "Current priority", detail: role.currentPriorities[0] ?? "Escalation response", evidence: "Support lens plus runtime and knowledge signals." },
      { id: "support-insight-decision", title: "Pending decision", detail: role.pendingDecisions[0] ?? "Priority cases", evidence: "Decision engine, runtime, and knowledge graph." },
    ],
  }
}

function buildPeopleState(role: RoleProfile, snapshot: RoleSnapshot): RoleDashboardState {
  return {
    headline: `${role.label} intelligence`,
    subheadline: "Capacity, talent risk, and organizational readiness.",
    summaryPoints: [
      `Organizational planning is mapped against ${snapshot.runtimeRunningAgents} active agents and current capacity pressure.`,
      snapshot.decisionSummary,
      snapshot.planningFocus ? `Planning engine is focused on ${snapshot.planningFocus}.` : "Planning engine can support workforce planning next.",
    ],
    kpis: [
      { label: "Org Readiness", value: `${84 + Math.min(snapshot.knowledgeNodes, 8)}%`, change: "+1 pt", detail: "How ready the org is for the next change", tone: "positive" },
      { label: "Manager Coverage", value: `${78 + Math.min(snapshot.runtimeRunningAgents, 12)}%`, change: "+1 pt", detail: "Leadership coverage across the organization", tone: "positive" },
      { label: "Hiring Flow", value: `${Math.max(4, 12 - snapshot.runtimePendingTasks)}`, change: snapshot.runtimePendingTasks > 5 ? "-1" : "+1", detail: "How much talent movement is in motion", tone: snapshot.runtimePendingTasks > 5 ? "warning" : "positive" },
      { label: "Retention Risk", value: snapshot.complianceAttention > 0 ? "Watch" : "Stable", change: snapshot.complianceAttention > 0 ? "Elevated" : "Flat", detail: "People risk needing executive attention", tone: snapshot.complianceAttention > 0 ? "warning" : "neutral" },
    ],
    recommendations: [
      { id: "people-capacity", title: "Rebalance capacity", reason: "The current work mix suggests a fresh capacity review.", action: "Review team load and shift priorities where needed.", expectedOutcome: "Better staffing and fewer overloaded teams.", confidence: 88, priority: "high" },
      { id: "people-hiring", title: "Check hiring flow", reason: "Hiring movement should track with organizational demand.", action: "Refresh the hiring plan and manager coverage.", expectedOutcome: "Improved readiness for growth.", confidence: 84, priority: "medium" },
      { id: "people-org", title: "Review org health", reason: "A quick org health summary can surface emerging risk.", action: "Generate a concise people briefing for leadership.", expectedOutcome: "Faster action on people issues.", confidence: 82, priority: "medium" },
    ],
    agents: [
      { id: "planning-agent", name: "Planning Agent", focus: "Capacity planning and role alignment.", reason: "Connects people decisions to operating demand." },
      { id: "executive-assistant", name: "Executive Assistant", focus: "People briefings and decision summaries.", reason: "Turns workforce data into leadership context." },
      { id: "knowledge-agent", name: "Knowledge Agent", focus: "Org knowledge, manager coverage, and policy context.", reason: "Supports stable people operations." },
    ],
    alerts: [
      { id: "people-alert-capacity", title: "Capacity pressure rising", detail: "A small set of teams may need additional support or sequencing changes.", priority: "medium", source: "Planning Engine", recommendation: "Review where capacity can be shifted quickly." },
      { id: "people-alert-org", title: "Org health summary recommended", detail: "Leadership could benefit from a fresh people intelligence brief.", priority: "low", source: "Executive Intelligence", recommendation: "Generate a people briefing for the next leadership update." },
    ],
    workflows: [
      { id: "people-capacity-workflow", name: "Capacity planning", reason: "Aligns team load with the work that matters most.", owner: "Planning Agent", status: "recommended" },
      { id: "people-org-workflow", name: "Org health review", reason: "Gives leadership a clean people signal.", owner: "Executive Assistant", status: "ready" },
      { id: "people-hiring-workflow", name: "Hiring review", reason: "Keeps hiring aligned to organizational demand.", owner: "Knowledge Agent", status: "ready" },
    ],
    prompts: [
      { id: "people-prompt-capacity", title: "Assess team capacity", prompt: "Assess team capacity and explain where load should be moved first.", context: "People lens" },
      { id: "people-prompt-org", title: "Summarize org health", prompt: "Summarize org health and identify the top people risks.", context: "People lens" },
    ],
    insights: [
      { id: "people-insight-priority", title: "Current priority", detail: role.currentPriorities[0] ?? "Capacity planning", evidence: "Planning engine and current organizational signal pressure." },
      { id: "people-insight-decision", title: "Pending decision", detail: role.pendingDecisions[0] ?? "Hiring approvals", evidence: "Planning, executive intelligence, and governance context." },
    ],
  }
}

function buildDeliveryState(role: RoleProfile, snapshot: RoleSnapshot): RoleDashboardState {
  return {
    headline: `${role.label} intelligence`,
    subheadline: "Milestones, dependency risk, and delivery predictability.",
    summaryPoints: [
      `Delivery health is being shaped by ${snapshot.runtimePendingTasks} open tasks and ${snapshot.runtimeQueueDepth} queued events.`,
      snapshot.decisionSummary,
      snapshot.activeWorkflow ? `Workflow Builder is currently focusing on ${snapshot.activeWorkflow}.` : "Workflow Builder can reinforce delivery sequencing.",
    ],
    kpis: [
      { label: "Milestone Health", value: `${87 - Math.min(snapshot.runtimePendingTasks, 6)}%`, change: snapshot.runtimePendingTasks > 4 ? "-1 pt" : "+1 pt", detail: "How the current milestones are tracking", tone: snapshot.runtimePendingTasks > 4 ? "warning" : "positive" },
      { label: "Dependency Risk", value: `${Math.max(1, snapshot.runtimeQueueDepth)}`, change: snapshot.runtimeQueueDepth > 8 ? "+2" : "Flat", detail: "Blocked or waiting work needing sequencing", tone: snapshot.runtimeQueueDepth > 8 ? "warning" : "neutral" },
      { label: "Capacity", value: `${82 + Math.min(snapshot.runtimeRunningAgents, 10)}%`, change: "+1 pt", detail: "How much room remains for delivery work", tone: "positive" },
      { label: "Predictability", value: `${84 + Math.min(snapshot.knowledgeEdges, 10)}%`, change: "+1 pt", detail: "Confidence in finishing on time", tone: "positive" },
    ],
    recommendations: [
      { id: "delivery-dependency", title: "Remove delivery blockers", reason: "Dependency risk is the fastest path to missed milestones.", action: "Escalate the blocked work and re-sequence the plan.", expectedOutcome: "More predictable milestone delivery.", confidence: 89, priority: "high" },
      { id: "delivery-plan", title: "Refresh the delivery plan", reason: "The active plan can be sharpened with current signal data.", action: "Update the plan and call out the next critical path item.", expectedOutcome: "Less ambiguity for the delivery team.", confidence: 85, priority: "medium" },
      { id: "delivery-risks", title: "Summarize delivery risks", reason: "A concise role briefing will help the team react faster.", action: "Generate a delivery risk summary for the next checkpoint.", expectedOutcome: "Faster intervention on project slips.", confidence: 83, priority: "medium" },
    ],
    agents: [
      { id: "workflow-agent", name: "Workflow Agent", focus: "Milestone sequencing and handoff reduction.", reason: "Helps the team ship with fewer delays." },
      { id: "planning-agent", name: "Planning Agent", focus: "Delivery planning and risk sequencing.", reason: "Keeps the plan aligned with current capacity." },
      { id: "knowledge-agent", name: "Knowledge Agent", focus: "Project knowledge and dependency context.", reason: "Keeps the delivery surface well understood." },
    ],
    alerts: [
      { id: "delivery-alert-dependency", title: "Dependency risk increasing", detail: "A handful of blockers could slow the next milestone.", priority: snapshot.runtimeQueueDepth > 8 ? "high" : "medium", source: "Planning Engine", recommendation: "Resolve blockers before adding new work." },
      { id: "delivery-alert-plan", title: "Plan refresh recommended", detail: "A role-specific summary would help the team move faster.", priority: "medium", source: "Workflow Builder", recommendation: "Update the delivery plan and sequence." },
    ],
    workflows: [
      { id: "delivery-milestone-workflow", name: "Milestone review", reason: "Keeps delivery on track.", owner: "Planning Agent", status: "recommended" },
      { id: "delivery-risk-workflow", name: "Risk review", reason: "Surfaces blockers before they become slips.", owner: "Knowledge Agent", status: "ready" },
      { id: "delivery-capacity-workflow", name: "Capacity alignment", reason: "Matches available effort to the delivery plan.", owner: "Workflow Agent", status: "ready" },
    ],
    prompts: [
      { id: "delivery-prompt-risks", title: "Review delivery risks", prompt: "Review delivery risks and explain which milestone needs attention first.", context: "Project lens" },
      { id: "delivery-prompt-plan", title: "Summarize plan status", prompt: "Summarize the current delivery plan status and call out the next critical action.", context: "Project lens" },
    ],
    insights: [
      { id: "delivery-insight-priority", title: "Current priority", detail: role.currentPriorities[0] ?? "Milestone health", evidence: "Planning engine, workflow builder, and runtime signals." },
      { id: "delivery-insight-decision", title: "Pending decision", detail: role.pendingDecisions[0] ?? "Sequencing", evidence: "Decision engine and delivery planning context." },
    ],
  }
}

function buildIndividualState(role: RoleProfile, snapshot: RoleSnapshot): RoleDashboardState {
  return {
    headline: `${role.label} intelligence`,
    subheadline: "Focused work, less context switching, and clearer next steps.",
    summaryPoints: [
      `You have ${snapshot.runtimePendingTasks} pending tasks and ${snapshot.runtimeRunningAgents} active agents that can help remove blockers.`,
      snapshot.decisionSummary,
      snapshot.promptPreview ? `Prompt OS can help frame ${snapshot.promptPreview.slice(0, 72)}.` : "Prompt OS is ready to help with the next task.",
    ],
    kpis: [
      { label: "Focus Time", value: `${78 + Math.min(snapshot.runtimeRunningAgents, 8)}%`, change: "+1 pt", detail: "How much uninterrupted work is available", tone: "positive" },
      { label: "Task Load", value: `${Math.max(1, snapshot.runtimePendingTasks)}`, change: snapshot.runtimePendingTasks > 5 ? "+2" : "Flat", detail: "Open tasks waiting for action", tone: snapshot.runtimePendingTasks > 5 ? "warning" : "neutral" },
      { label: "Blockers", value: `${Math.max(0, snapshot.runtimeQueueDepth - 2)}`, change: snapshot.runtimeQueueDepth > 6 ? "+1" : "Flat", detail: "Items that should be escalated or removed", tone: snapshot.runtimeQueueDepth > 6 ? "warning" : "positive" },
      { label: "Context Load", value: `${68 + Math.min(snapshot.knowledgeNodes, 10)}%`, change: "+1 pt", detail: "How much information is competing for attention", tone: "neutral" },
    ],
    recommendations: [
      { id: "individual-focus", title: "Protect today’s focus", reason: "The personal workflow works best when the next step is clear.", action: "Complete the highest-value task and defer the rest.", expectedOutcome: "Less context switching and faster completion.", confidence: 92, priority: "high" },
      { id: "individual-blocker", title: "Escalate blockers early", reason: "The right support can reduce hidden work.", action: "Use a quick workflow to surface the blocker owner.", expectedOutcome: "Fewer stalled tasks and cleaner progress.", confidence: 87, priority: "medium" },
      { id: "individual-summary", title: "Ask for a concise brief", reason: "A short role-aware summary can reduce decision friction.", action: "Generate a short decision brief before the next work session.", expectedOutcome: "Clearer next actions.", confidence: 84, priority: "low" },
    ],
    agents: [
      { id: "workflow-agent", name: "Workflow Agent", focus: "Task sequencing and block removal.", reason: "Helps keep the next step obvious." },
      { id: "knowledge-agent", name: "Knowledge Agent", focus: "Reference material and context lookup.", reason: "Reduces the time needed to find answers." },
      { id: "executive-assistant", name: "Executive Assistant", focus: "Concise summaries and task framing.", reason: "Keeps the workday clearer and lighter." },
    ],
    alerts: [
      { id: "individual-alert-focus", title: "Too many active items", detail: "The current workload may be too broad for deep work.", priority: "medium", source: "Planning Engine", recommendation: "Limit the next session to one or two outcomes." },
      { id: "individual-alert-blocker", title: "Blocker should be escalated", detail: "A quick escalation could prevent work from stalling.", priority: "low", source: "Workflow Builder", recommendation: "Use the recommended handoff to move the blocker forward." },
    ],
    workflows: [
      { id: "individual-focus-workflow", name: "Daily focus", reason: "Keeps the work plan narrow and actionable.", owner: "Executive Assistant", status: "recommended" },
      { id: "individual-blocker-workflow", name: "Blocker escalation", reason: "Moves stuck items to the right owner.", owner: "Workflow Agent", status: "ready" },
      { id: "individual-brief-workflow", name: "Decision brief", reason: "Gives a concise summary before starting work.", owner: "Knowledge Agent", status: "ready" },
    ],
    prompts: [
      { id: "individual-prompt-focus", title: "Prioritize today's work", prompt: "Prioritize today's work and explain which items should be handled first.", context: "Individual contributor lens" },
      { id: "individual-prompt-blockers", title: "Identify blockers", prompt: "Identify blockers that should be escalated before the end of the day.", context: "Individual contributor lens" },
    ],
    insights: [
      { id: "individual-insight-priority", title: "Current priority", detail: role.currentPriorities[0] ?? "Today’s focus", evidence: "Task load, runtime signal pressure, and work priorities." },
      { id: "individual-insight-decision", title: "Pending decision", detail: role.pendingDecisions[0] ?? "What to complete next", evidence: "Planning engine and prompt OS context." },
    ],
  }
}

function buildAdministrationState(role: RoleProfile, snapshot: RoleSnapshot): RoleDashboardState {
  return {
    headline: `${role.label} intelligence`,
    subheadline: "Access, audit readiness, and system governance.",
    summaryPoints: [
      `Governance attention is ${snapshot.complianceAttention > 0 ? "elevated" : "stable"} and runtime is handling ${snapshot.runtimeQueueDepth} queued events.`,
      snapshot.decisionSummary,
      snapshot.promptPreview ? `Prompt OS is focused on ${snapshot.promptPreview.slice(0, 72)}.` : "Prompt OS is ready for administrative review.",
    ],
    kpis: [
      { label: "System Health", value: `${93 - Math.min(snapshot.runtimeQueueDepth, 8)}%`, change: snapshot.runtimeQueueDepth > 10 ? "-2 pts" : "+1 pt", detail: "Platform stability and admin visibility", tone: snapshot.runtimeQueueDepth > 10 ? "warning" : "positive" },
      { label: "Audit Coverage", value: formatPercentage(snapshot.explainabilityCoverage), change: "+2 pts", detail: "How well the system can explain key actions", tone: "positive" },
      { label: "Access Risk", value: snapshot.complianceAttention > 0 ? "Watch" : "Low", change: snapshot.complianceAttention > 0 ? "Elevated" : "Stable", detail: "Administrative risk and policy exposure", tone: snapshot.complianceAttention > 0 ? "warning" : "positive" },
      { label: "Integration Health", value: `${82 + Math.min(snapshot.runtimeRunningAgents, 10)}%`, change: "+1 pt", detail: "How well connected systems are tracking", tone: "positive" },
    ],
    recommendations: [
      { id: "admin-access", title: "Review access patterns", reason: "The admin lens should watch for unnecessary exposure.", action: "Inspect access and policy changes first.", expectedOutcome: "Safer administrative posture.", confidence: 90, priority: "high" },
      { id: "admin-policy", title: "Update policy coverage", reason: "A small policy refresh keeps the governance layer current.", action: "Review audit, access, and integration policies.", expectedOutcome: "Cleaner compliance coverage.", confidence: 86, priority: "medium" },
      { id: "admin-system", title: "Check system stability", reason: "Admins can prevent problems early when health dips.", action: "Inspect system health and queue growth.", expectedOutcome: "More stable operations.", confidence: 84, priority: "medium" },
    ],
    agents: [
      { id: "knowledge-agent", name: "Knowledge Agent", focus: "Policy, metadata, and governance context.", reason: "Preserves the system's administrative knowledge." },
      { id: "workflow-agent", name: "Workflow Agent", focus: "Access changes and administrative sequences.", reason: "Reduces manual governance work." },
      { id: "executive-assistant", name: "Executive Assistant", focus: "Admin summaries and review lists.", reason: "Keeps admin decisions concise." },
    ],
    alerts: [
      { id: "admin-alert-policy", title: "Policy coverage review due", detail: "One or more policies may need a governance refresh.", priority: snapshot.complianceAttention > 0 ? "high" : "medium", source: "Governance Center", recommendation: "Refresh the most sensitive policies first." },
      { id: "admin-alert-health", title: "System stability watch", detail: "Queue growth should be monitored to preserve the admin experience.", priority: "medium", source: "Runtime Engine", recommendation: "Keep the queue under tighter control." },
    ],
    workflows: [
      { id: "admin-access-workflow", name: "Access review", reason: "Keeps privilege and exposure in check.", owner: "Workflow Agent", status: "recommended" },
      { id: "admin-policy-workflow", name: "Policy audit", reason: "Ensures governance remains current.", owner: "Knowledge Agent", status: "ready" },
      { id: "admin-health-workflow", name: "System health check", reason: "Protects the admin lens from operational issues.", owner: "Executive Assistant", status: "ready" },
    ],
    prompts: [
      { id: "admin-prompt-audit", title: "Summarize audit risk", prompt: "Summarize the audit risk that should be reviewed first.", context: "Administration lens" },
      { id: "admin-prompt-access", title: "Review access changes", prompt: "Review access changes and explain any unusual patterns.", context: "Administration lens" },
    ],
    insights: [
      { id: "admin-insight-priority", title: "Current priority", detail: role.currentPriorities[0] ?? "Audit readiness", evidence: "Governance center and runtime signal pressure." },
      { id: "admin-insight-decision", title: "Pending decision", detail: role.pendingDecisions[0] ?? "Policy updates", evidence: "Governance, runtime, and Prompt OS context." },
    ],
  }
}

function buildCustomState(role: RoleProfile, snapshot: RoleSnapshot): RoleDashboardState {
  return {
    headline: `${role.label} intelligence`,
    subheadline: "Tailored role semantics for specialized organizations.",
    summaryPoints: [
      `This custom lens can inherit the same intelligence stack as every other role.`,
      snapshot.decisionSummary,
      snapshot.promptPreview ? `Prompt OS is tailored to ${snapshot.promptPreview.slice(0, 72)}.` : "Prompt OS is ready for a custom brief.",
    ],
    kpis: [
      { label: "Role Fit", value: "Configured", change: "Adaptive", detail: "Customizable by organization and team", tone: "positive" },
      { label: "Workflow Match", value: snapshot.activeWorkflow ?? "Ready", change: snapshot.workflowRunning ? "Running" : "Ready", detail: "Custom workflow alignment", tone: "neutral" },
      { label: "Decision Support", value: snapshot.decisionConfidence ? formatPercentage(snapshot.decisionConfidence) : "80%", change: "+1 pt", detail: "Role-aware support for specialized decisions", tone: "positive" },
      { label: "Search Priorities", value: `${role.searchPriorities.length}`, change: "Flexible", detail: "Role-specific information prioritization", tone: "neutral" },
    ],
    recommendations: [
      { id: "custom-config", title: "Refine the custom profile", reason: "Custom roles benefit from explicit priorities and naming.", action: "Adjust the role profile and mapped workflows.", expectedOutcome: "A more precise intelligence layer.", confidence: 88, priority: "medium" },
      { id: "custom-brief", title: "Generate a custom brief", reason: "The system can summarize the exact context for this role.", action: "Create a tailored briefing with the right KPIs and actions.", expectedOutcome: "Less generic output and better alignment.", confidence: 84, priority: "low" },
    ],
    agents: [
      { id: "executive-assistant", name: "Executive Assistant", focus: "Custom summaries and decision framing.", reason: "Provides a neutral surface for specialized roles." },
      { id: "workflow-agent", name: "Workflow Agent", focus: "Custom workflow mapping.", reason: "Adapts existing workflows to new operating needs." },
      { id: "knowledge-agent", name: "Knowledge Agent", focus: "Role-specific context and search priorities.", reason: "Keeps the custom lens grounded in evidence." },
    ],
    alerts: [
      { id: "custom-alert-fit", title: "Role fit should be tuned", detail: "A custom role works best when the priorities are explicit.", priority: "medium", source: "Role Intelligence", recommendation: "Tune the profile so the role lens is less generic." },
    ],
    workflows: [
      { id: "custom-workflow", name: "Custom briefing", reason: "Produces a tailored summary for the configured role.", owner: "Executive Assistant", status: "recommended" },
      { id: "custom-mapping", name: "Workflow mapping", reason: "Maps existing platform workflows to the new role.", owner: "Workflow Agent", status: "ready" },
    ],
    prompts: [
      { id: "custom-prompt", title: "Describe the custom role", prompt: "Describe the custom role's priorities, decisions, and next best actions.", context: "Custom lens" },
    ],
    insights: [
      { id: "custom-insight-priority", title: "Current priority", detail: role.currentPriorities[0] ?? "Role configuration", evidence: "Custom role profile and adaptive role intelligence." },
      { id: "custom-insight-decision", title: "Pending decision", detail: role.pendingDecisions[0] ?? "Template overrides", evidence: "Role configuration and workflow mapping." },
    ],
  }
}

function buildCategoryState(role: RoleProfile, snapshot: RoleSnapshot): RoleDashboardState {
  if (role.category === "executive") return buildExecutiveState(role, snapshot)
  if (role.category === "revenue") return buildRevenueState(role, snapshot)
  if (role.category === "marketing") return buildMarketingState(role, snapshot)
  if (role.category === "operations") return buildOperationsState(role, snapshot)
  if (role.category === "finance") return buildFinanceState(role, snapshot)
  if (role.category === "support") return buildSupportState(role, snapshot)
  if (role.category === "people") return buildPeopleState(role, snapshot)
  if (role.category === "delivery") return buildDeliveryState(role, snapshot)
  if (role.category === "individual") return buildIndividualState(role, snapshot)
  if (role.category === "administration") return buildAdministrationState(role, snapshot)
  return buildCustomState(role, snapshot)
}

function makeAgentCards(role: RoleProfile, agents: string[]): RoleAgent[] {
  return agents.map((agent, index) => ({
    id: `${role.id}-agent-${index}`,
    name: agent,
    focus: `${role.label} lens support for ${agent.toLowerCase()}.`,
    reason: `Matches ${role.department.toLowerCase()} responsibilities and current priorities.`,
  }))
}

export function buildRoleDashboard(role: RoleProfile, snapshot: RoleSnapshot): RoleDashboardState {
  const state = buildCategoryState(role, snapshot)

  return {
    ...state,
    agents: state.agents.length > 0 ? state.agents : makeAgentCards(role, role.relevantAgents),
    summaryPoints: [...state.summaryPoints, `Role search prioritizes ${role.searchPriorities.slice(0, 3).join(", ")}.`],
  }
}

export function getRoleCategory(roleId: RoleId): RoleCategory {
  return roleProfiles[roleId].category
}