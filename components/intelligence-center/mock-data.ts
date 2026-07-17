import type {
  IntelligenceAnomaly,
  IntelligenceCardRecord,
  IntelligenceExecutiveBrief,
  IntelligenceGraphEdge,
  IntelligenceGraphNode,
  IntelligenceInsight,
  IntelligenceKpi,
  IntelligenceRecommendation,
  IntelligenceRibbonItem,
  IntelligenceRoleView,
  IntelligenceScenario,
  IntelligenceSignal,
  IntelligenceTimelineEvent,
  IntelligenceWorkspaceSection,
} from "./types";

export const intelligenceKpis: IntelligenceKpi[] = [
  { id: "k1", label: "Business Health", value: "96%", detail: "Composite enterprise health score", tone: "success" },
  { id: "k2", label: "Growth Index", value: "112", detail: "Leading growth momentum indicator", tone: "success" },
  { id: "k3", label: "Risk Score", value: "18", detail: "Lower is better for enterprise risk", tone: "default" },
  { id: "k4", label: "Forecast Accuracy", value: "94%", detail: "Rolling forecast confidence", tone: "success" },
  { id: "k5", label: "Automation Coverage", value: "71%", detail: "Decisions and workflows automated", tone: "success" },
  { id: "k6", label: "AI Confidence", value: "95%", detail: "Model confidence on active intelligence", tone: "success" },
  { id: "k7", label: "Revenue Opportunity", value: "€8.4M", detail: "Identified quarterly opportunity pool", tone: "warning" },
  { id: "k8", label: "Operational Efficiency", value: "+14%", detail: "Process efficiency improvement", tone: "success" },
];

export const intelligenceRibbon: IntelligenceRibbonItem[] = [
  { id: "r1", label: "Critical Alerts", value: "4", status: "Escalated", trend: "+1", tone: "critical" },
  { id: "r2", label: "Emerging Opportunities", value: "12", status: "Tracking", trend: "+3", tone: "success" },
  { id: "r3", label: "Revenue Forecast", value: "€24.6M", status: "This quarter", trend: "+12.4%", tone: "success" },
  { id: "r4", label: "Risk Alerts", value: "7", status: "Active", trend: "+2", tone: "warning" },
  { id: "r5", label: "Departments Requiring Attention", value: "3", status: "Monitor", trend: "-1", tone: "warning" },
  { id: "r6", label: "Confidence Level", value: "95%", status: "Stable", trend: "+1%", tone: "success" },
  { id: "r7", label: "Business Status", value: "Healthy", status: "Operating above baseline", trend: "+", tone: "default" },
];

export const intelligenceSignals: IntelligenceSignal[] = [
  { id: "s1", label: "Revenue expected to increase by 12.4%", source: "Executive KPIs", value: "€24.6M", trend: "+12.4%", detail: "Demand growth and pricing uplift are driving forecast expansion." },
  { id: "s2", label: "Customer churn predicted in Germany", source: "Customer Signals", value: "8.2%", trend: "+1.3%", detail: "Renewal risk is concentrated in EMEA enterprise accounts." },
  { id: "s3", label: "Knowledge quality increased 18%", source: "Knowledge Center", value: "98%", trend: "+18%", detail: "Policy alignment and reference depth improved after governance review." },
  { id: "s4", label: "AI adoption reached 71%", source: "Agent Studio", value: "71%", trend: "+6%", detail: "Role-based assistants are now used across sales, finance, and operations." },
  { id: "s5", label: "Warehouse capacity will reach 95%", source: "Workflow Builder", value: "95%", trend: "+8%", detail: "Fulfillment load is approaching physical and labor capacity thresholds." },
  { id: "s6", label: "Marketing automation generated highest ROI", source: "Command Center", value: "17.8x", trend: "+4.2x", detail: "Campaign automation is outperforming manual campaign execution." },
  { id: "s7", label: "Support response time reduced 41%", source: "Memory Center", value: "-41%", trend: "-41%", detail: "Cross-knowledge service playbooks improved response speed." },
  { id: "s8", label: "Finance has highest automation opportunity", source: "Decision Center", value: "63%", trend: "+9%", detail: "Approval routing and control checks remain mostly manual." },
];

export const intelligenceCards: IntelligenceCardRecord[] = [
  {
    id: "c1",
    title: "Revenue acceleration in North America enterprise accounts",
    executiveSummary: "Executive pipeline momentum and pricing stability point to an upsell opportunity.",
    aiAnalysis: "Forecast confidence is high because renewal risk is low and conversion velocity improved in the last two cycles.",
    businessImpact: "Potential quarterly uplift of €2.4M with limited implementation overhead.",
    priority: "critical",
    confidence: 96,
    supportingEvidence: [
      "North America enterprise ARR grew 14.2% quarter over quarter",
      "Expansion pipeline coverage is 2.7x quota",
      "Renewal churn has remained below 2% for 90 days",
    ],
    predictedOutcome: "Enterprise bookings rise without meaningful service degradation.",
    recommendedAction: "Launch enterprise pricing motion and assign executive sponsorship to top 20 accounts.",
    status: "recommended",
    sourceChips: ["Memory Center", "Knowledge Center", "Executive Center"],
    sourceTooltip: "Calculated using Executive KPIs and Memory Graph context",
  },
  {
    id: "c2",
    title: "Germany churn risk requires intervention",
    executiveSummary: "A narrow set of accounts in Germany is showing elevated churn indicators.",
    aiAnalysis: "The model correlates delayed support resolution, lower product adoption, and reduced executive engagement.",
    businessImpact: "At-risk revenue exposure is €1.1M unless retention actions are taken.",
    priority: "high",
    confidence: 93,
    supportingEvidence: [
      "Support backlog has increased 28% in the last 14 days",
      "Usage frequency dropped across three enterprise accounts",
      "Renewal intent sentiment declined from 82 to 69",
    ],
    predictedOutcome: "A targeted intervention can stabilize renewals in 2-3 weeks.",
    recommendedAction: "Create a retention workflow and assign Sales plus Customer Success ownership.",
    status: "review",
    sourceChips: ["Command Center", "Decision Center", "Agent Studio"],
    sourceTooltip: "Generated by Sales Agent and influenced by decision signals",
  },
  {
    id: "c3",
    title: "Warehouse capacity saturation is approaching",
    executiveSummary: "Fulfillment load suggests the Midwest warehouse is moving toward saturation.",
    aiAnalysis: "The model sees sustained throughput growth and increasing overtime cost as leading indicators.",
    businessImpact: "Risk to SLA and shipping costs unless capacity is expanded or optimized.",
    priority: "high",
    confidence: 95,
    supportingEvidence: [
      "Throughput is forecast to reach 95% of usable capacity",
      "Overtime hours increased by 18% month over month",
      "Packing queue times are exceeding the threshold in peak windows",
    ],
    predictedOutcome: "Without changes, delivery lead times will drift upward next month.",
    recommendedAction: "Review the warehouse expansion decision and add short-term overflow routing.",
    status: "recommended",
    sourceChips: ["Workflow Builder", "Decision Center", "Operations Center"],
    sourceTooltip: "Influenced by workflow capacity and operational KPIs",
  },
  {
    id: "c4",
    title: "AI adoption is ready for broader executive rollout",
    executiveSummary: "Adoption data shows the organization is ready for deeper AI-enabled workflows.",
    aiAnalysis: "Usage patterns indicate stable confidence across agents and higher task completion speed.",
    businessImpact: "Higher automation coverage can free operational capacity and improve consistency.",
    priority: "medium",
    confidence: 91,
    supportingEvidence: [
      "AI usage reached 71% across tracked roles",
      "Task completion time declined in knowledge-heavy workflows",
      "Human override frequency remained low in approved lanes",
    ],
    predictedOutcome: "Broader AI deployment will produce incremental efficiency gains.",
    recommendedAction: "Expand governed AI rollout to remaining departments with onboarding support.",
    status: "validated",
    sourceChips: ["Agent Studio", "Knowledge Center", "Memory Center"],
    sourceTooltip: "Derived from 41 Knowledge Objects and memory feedback loops",
  },
  {
    id: "c5",
    title: "Marketing automation is producing the highest ROI",
    executiveSummary: "Marketing automation campaigns are outperforming manual activity across segments.",
    aiAnalysis: "The system sees sustained ROI from segmentation, triggered journeys, and content personalization.",
    businessImpact: "A scaled automation program could improve pipeline efficiency and reduce manual effort.",
    priority: "medium",
    confidence: 94,
    supportingEvidence: [
      "Automated journeys generated the highest return among active campaigns",
      "Lead-to-opportunity conversion improved after sequence optimization",
      "Content engagement rose as journeys became more targeted",
    ],
    predictedOutcome: "Automation-led campaigns continue to outperform manual execution.",
    recommendedAction: "Scale the top-performing automation sequence and reduce manual campaign dependencies.",
    status: "recommended",
    sourceChips: ["Command Center", "Workflow Builder", "Executive Center"],
    sourceTooltip: "Calculated from campaign automation and executive KPI feeds",
  },
  {
    id: "c6",
    title: "Finance automation opportunity is concentrated in approvals",
    executiveSummary: "Finance workflows still contain high manual approval overhead.",
    aiAnalysis: "The model identifies repeated approvals, redundant checks, and delay-prone handoffs.",
    businessImpact: "Automation could reduce cycle time and improve control consistency.",
    priority: "high",
    confidence: 97,
    supportingEvidence: [
      "Approval SLA is the slowest of all tracked departments",
      "Manual review is concentrated in spend and exception paths",
      "Repeated validation steps add avoidable delay",
    ],
    predictedOutcome: "Approval automation should reduce bottlenecks without increasing control risk.",
    recommendedAction: "Automate approval routing and keep policy exceptions under executive review.",
    status: "review",
    sourceChips: ["Decision Center", "Workflow Builder", "Compliance Center"],
    sourceTooltip: "Calculated from executive KPIs and control process telemetry",
  },
];

export const intelligenceTimeline: IntelligenceTimelineEvent[] = [
  { id: "t1", stage: "signals", timestamp: "2026-07-10T07:00:00Z", confidence: 94, businessArea: "Revenue", detail: "Revenue uplift and churn pressure signals captured from operating systems." },
  { id: "t2", stage: "analysis", timestamp: "2026-07-10T07:12:00Z", confidence: 95, businessArea: "Operations", detail: "AI evaluates cross-department relationships and forecast impacts." },
  { id: "t3", stage: "insight", timestamp: "2026-07-10T07:20:00Z", confidence: 96, businessArea: "Knowledge", detail: "Knowledge quality and executive readiness improved from governance updates." },
  { id: "t4", stage: "recommendation", timestamp: "2026-07-10T07:33:00Z", confidence: 93, businessArea: "Customer Success", detail: "Retention workflow recommended for Germany accounts." },
  { id: "t5", stage: "decision", timestamp: "2026-07-10T07:44:00Z", confidence: 95, businessArea: "Finance", detail: "Finance automation path scored highest for immediate ROI." },
  { id: "t6", stage: "outcome", timestamp: "2026-07-10T08:05:00Z", confidence: 92, businessArea: "Executive", detail: "Executives reviewed predicted outcomes and approved staged actioning." },
];

export const intelligenceGraphNodes: IntelligenceGraphNode[] = [
  { id: "n1", label: "Departments", type: "department", x: 120, y: 130, radius: 22, detail: "Org structure and attention points" },
  { id: "n2", label: "Agents", type: "agent", x: 360, y: 90, radius: 20, detail: "AI workforce and recommendations" },
  { id: "n3", label: "Knowledge", type: "knowledge", x: 350, y: 280, radius: 20, detail: "Enterprise knowledge layer" },
  { id: "n4", label: "Memory", type: "memory", x: 580, y: 140, radius: 20, detail: "Living organizational memory" },
  { id: "n5", label: "Customers", type: "customer", x: 590, y: 320, radius: 20, detail: "Customer signals and journeys" },
  { id: "n6", label: "Workflows", type: "workflow", x: 820, y: 100, radius: 20, detail: "Decisioning and automation flows" },
  { id: "n7", label: "MCP", type: "mcp", x: 820, y: 290, radius: 20, detail: "Model context protocol operations" },
  { id: "n8", label: "Executive Goals", type: "goal", x: 1040, y: 150, radius: 22, detail: "Strategic objectives and targets" },
  { id: "n9", label: "Revenue", type: "revenue", x: 1040, y: 320, radius: 22, detail: "Financial outcome signals" },
  { id: "n10", label: "Risks", type: "risk", x: 1270, y: 220, radius: 22, detail: "Operational and strategic risk" },
];

export const intelligenceGraphEdges: IntelligenceGraphEdge[] = [
  { id: "e1", from: "n1", to: "n2", label: "feeds", strength: 92, animated: true },
  { id: "e2", from: "n2", to: "n3", label: "uses", strength: 88, animated: true },
  { id: "e3", from: "n3", to: "n4", label: "updates", strength: 86, animated: true },
  { id: "e4", from: "n4", to: "n5", label: "influences", strength: 84, animated: true },
  { id: "e5", from: "n5", to: "n6", label: "drives", strength: 81, animated: true },
  { id: "e6", from: "n6", to: "n7", label: "orchestrates", strength: 79, animated: true },
  { id: "e7", from: "n7", to: "n8", label: "supports", strength: 85, animated: true },
  { id: "e8", from: "n7", to: "n9", label: "optimizes", strength: 82, animated: true },
  { id: "e9", from: "n8", to: "n10", label: "monitors", strength: 80, animated: true },
  { id: "e10", from: "n9", to: "n10", label: "exposes", strength: 83, animated: true },
];

export const intelligenceInsights: IntelligenceInsight[] = [
  { id: "i1", title: "Revenue Trends", detail: "Revenue is expected to increase by 12.4% with pricing and retention support.", confidence: 96, impact: "+€8.4M opportunity" },
  { id: "i2", title: "Customer Behaviour", detail: "Germany churn risk is concentrated in top enterprise accounts.", confidence: 93, impact: "Retention intervention required" },
  { id: "i3", title: "Workflow Performance", detail: "Warehouse and approval workflows are nearing capacity thresholds.", confidence: 95, impact: "Automation and expansion needed" },
  { id: "i4", title: "Knowledge Growth", detail: "Knowledge quality increased 18% after recent governance updates.", confidence: 94, impact: "Better retrieval and reasoning" },
  { id: "i5", title: "Memory Activity", detail: "Support response time reduced 41% after memory-linked guidance improved.", confidence: 92, impact: "Higher service consistency" },
  { id: "i6", title: "Department Health", detail: "Finance has the highest automation opportunity across active departments.", confidence: 97, impact: "Approval cycle optimization" },
  { id: "i7", title: "AI Adoption", detail: "Enterprise AI adoption reached 71% and continues to climb steadily.", confidence: 91, impact: "Broader AI enablement" },
  { id: "i8", title: "Operational Efficiency", detail: "Operational efficiency improved after workflow automation in core functions.", confidence: 94, impact: "Reduced cost and delay" },
];

export const intelligenceRecommendations: IntelligenceRecommendation[] = [
  {
    id: "r1",
    recommendation: "Approve enterprise pricing expansion",
    reasoning: "Pricing elasticity is favorable and strategic accounts remain stable.",
    evidence: ["Expansion pipeline covers the new price point", "Churn risk remains low in core segments", "Margin uplift is material"],
    expectedROI: "€5.1M annual margin impact",
    implementationEffort: "Medium",
    confidence: 92,
    priority: "critical",
    sourceChips: ["Decision Center", "Executive Center", "Command Center"],
  },
  {
    id: "r2",
    recommendation: "Delegate Germany churn mitigation",
    reasoning: "Retention risk is localized and requires targeted execution.",
    evidence: ["Support response time degraded", "Customer sentiment dropped", "Renewal risk increased"],
    expectedROI: "€1.1M protected revenue",
    implementationEffort: "Low",
    confidence: 93,
    priority: "high",
    sourceChips: ["Memory Center", "Agent Studio", "Customer Center"],
  },
  {
    id: "r3",
    recommendation: "Create warehouse overflow workflow",
    reasoning: "Capacity approaches saturation; additional routing is needed before peak demand.",
    evidence: ["Capacity forecast at 95%", "Queue times are trending up", "Overtime costs are increasing"],
    expectedROI: "€3.2M network benefit",
    implementationEffort: "Medium",
    confidence: 95,
    priority: "high",
    sourceChips: ["Workflow Builder", "Operations Center", "Decision Center"],
  },
  {
    id: "r4",
    recommendation: "Schedule finance automation review",
    reasoning: "Finance offers the highest automation opportunity based on approval bottlenecks.",
    evidence: ["Approval SLA is slow", "Manual checks duplicate controls", "Automation readiness is strong"],
    expectedROI: "€2.4M savings",
    implementationEffort: "Medium",
    confidence: 97,
    priority: "medium",
    sourceChips: ["Command Center", "Decision Center", "Compliance Center"],
  },
];

export const intelligenceScenarios: IntelligenceScenario[] = [
  { id: "s1", label: "Current", revenue: "€24.6M", profit: "€6.8M", growth: "+8.1%", risk: "18", customerSatisfaction: "91" },
  { id: "s2", label: "Optimistic", revenue: "€27.2M", profit: "€7.9M", growth: "+12.4%", risk: "12", customerSatisfaction: "94" },
  { id: "s3", label: "Expected", revenue: "€26.1M", profit: "€7.2M", growth: "+10.2%", risk: "15", customerSatisfaction: "92" },
  { id: "s4", label: "Conservative", revenue: "€25.0M", profit: "€6.4M", growth: "+7.0%", risk: "21", customerSatisfaction: "89" },
  { id: "s5", label: "Worst Case", revenue: "€22.1M", profit: "€5.3M", growth: "+2.4%", risk: "31", customerSatisfaction: "84" },
];

export const intelligenceAnomalies: IntelligenceAnomaly[] = [
  { id: "a1", category: "Revenue", title: "Revenue variance in EMEA", detail: "Forecast drift detected in Germany and France accounts.", severity: "high", timestamp: "2026-07-10T07:18:00Z" },
  { id: "a2", category: "Operations", title: "Warehouse queue expansion", detail: "Peak-order queue length is above the expected threshold.", severity: "medium", timestamp: "2026-07-10T07:24:00Z" },
  { id: "a3", category: "Customers", title: "Churn pressure rising", detail: "Top enterprise accounts show declining renewal intent.", severity: "high", timestamp: "2026-07-10T07:31:00Z" },
  { id: "a4", category: "Infrastructure", title: "Compute spend anomaly", detail: "Reserved compute coverage is under target for the next cycle.", severity: "medium", timestamp: "2026-07-10T07:40:00Z" },
  { id: "a5", category: "Agents", title: "Agent confidence drift", detail: "Two agent routes returned lower-than-normal confidence.", severity: "low", timestamp: "2026-07-10T07:47:00Z" },
  { id: "a6", category: "Compliance", title: "Policy review delay", detail: "Compliance updates pending executive review beyond SLA.", severity: "high", timestamp: "2026-07-10T07:55:00Z" },
  { id: "a7", category: "Workflows", title: "Approval bottleneck detected", detail: "Finance approvals are slowing down the decision queue.", severity: "medium", timestamp: "2026-07-10T08:02:00Z" },
  { id: "a8", category: "Memory", title: "Memory link degradation", detail: "Some support memories are falling out of refresh windows.", severity: "low", timestamp: "2026-07-10T08:11:00Z" },
  { id: "a9", category: "Knowledge", title: "Knowledge freshness gap", detail: "Two policy objects need refresh after process changes.", severity: "medium", timestamp: "2026-07-10T08:19:00Z" },
];

export const intelligenceExecutiveBrief: IntelligenceExecutiveBrief = {
  todaySummary: "AIOS is seeing stronger revenue signals, manageable risk pressure, and a few high-value attention areas across Germany, finance, and operations.",
  weeklyTrends: [
    "Revenue forecast improved after pricing and retention signals strengthened.",
    "AI adoption is rising steadily across governed departments.",
    "Warehouse and approval throughput require proactive capacity handling.",
  ],
  topOpportunities: [
    "Launch enterprise pricing motion",
    "Scale AI adoption programs",
    "Automate finance approvals",
  ],
  strategicRisks: [
    "EMEA churn pressure remains concentrated",
    "Warehouse capacity will reach threshold soon",
    "Knowledge freshness gaps can slow AI reasoning",
  ],
  priorityActions: [
    "Review the enterprise pricing recommendation",
    "Create a workflow for finance automation",
    "Escalate Germany retention intervention",
  ],
  forecast: "Revenue is forecast to increase by 12.4% while maintaining acceptable risk levels if the current recommendations are executed.",
  recommendedDecisions: [
    "Approve enterprise pricing expansion",
    "Delegate churn mitigation to Sales and Customer Success",
    "Schedule finance automation review",
  ],
};

export const intelligenceRoleViews: IntelligenceRoleView[] = [
  { role: "CEO", headline: "Strategic enterprise direction", priorities: ["Growth", "Risk", "Decision velocity"], focusAreas: ["Revenue forecast", "Strategic risks", "Executive actions"] },
  { role: "CFO", headline: "Financial discipline and forecast quality", priorities: ["Margin", "Savings", "Capital efficiency"], focusAreas: ["Revenue opportunity", "Risk score", "Forecast accuracy"] },
  { role: "COO", headline: "Operational throughput and execution", priorities: ["Capacity", "Automation", "Reliability"], focusAreas: ["Operational efficiency", "Workflow performance", "SLA stability"] },
  { role: "Sales", headline: "Revenue acceleration and renewal health", priorities: ["Pipeline", "Retention", "Pricing"], focusAreas: ["Customer behaviour", "Revenue trends", "Decision recommendations"] },
  { role: "Marketing", headline: "Demand generation and automation ROI", priorities: ["Activation", "ROI", "Conversion"], focusAreas: ["Campaign performance", "Adoption", "Opportunity growth"] },
  { role: "HR", headline: "Workforce readiness and capacity", priorities: ["Hiring", "Enablement", "Adoption"], focusAreas: ["AI adoption", "Org health", "Workflow completion"] },
  { role: "Operations", headline: "Process performance and delivery health", priorities: ["Capacity", "SLA", "Execution"], focusAreas: ["Warehouse capacity", "Operations anomalies", "Workflow throughput"] },
  { role: "Compliance", headline: "Governance and policy integrity", priorities: ["Control", "Audit", "Approvals"], focusAreas: ["Risk alerts", "Compliance anomalies", "Knowledge governance"] },
  { role: "IT", headline: "Infrastructure and platform reliability", priorities: ["Spend", "Resilience", "Automation"], focusAreas: ["Infrastructure anomalies", "AI confidence", "Platform health"] },
];

export const intelligenceWorkspaceSections: IntelligenceWorkspaceSection[] = [
  {
    title: "Connected Intelligence",
    items: [
      { id: "executive", label: "Executive Center", href: "/app/executive", meta: "KPIs linked" },
      { id: "command", label: "Command Center", href: "/app/commands", meta: "Signals linked" },
      { id: "agents", label: "Agent Studio", href: "/app/agents", meta: "Agents linked" },
      { id: "workflows", label: "Workflow Builder", href: "/app/workflows", meta: "Automation linked" },
      { id: "memory", label: "Memory Center", href: "/app/memory", meta: "Memory linked" },
      { id: "knowledge", label: "Knowledge Center", href: "/app/knowledge", meta: "Knowledge linked" },
    ],
  },
  {
    title: "Control Views",
    items: [
      { id: "decisions", label: "Decision Center", href: "/app/decisions", meta: "Decisions linked" },
      { id: "orchestrator", label: "Orchestrator", href: "/app/orchestrator", meta: "Execution linked" },
      { id: "planning", label: "Planning", href: "/app/planning", meta: "Roadmap linked" },
      { id: "mcp", label: "MCP", href: "/app/mcp", meta: "Protocols linked" },
      { id: "reports", label: "Reports", href: "/app/reports", meta: "Briefing linked" },
    ],
  },
];
