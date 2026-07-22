export type BusinessRole =
  | "CEO"
  | "CFO"
  | "COO"
  | "Sales Director"
  | "HR Director"
  | "Operations Manager"
  | "Marketing Manager"
  | "Customer Success"
  | "IT"
  | "Legal"
  | "Developer"

export type RolePreset = {
  role: BusinessRole
  kpis: Array<{ label: string; value: string; trend: string }>
  prompts: string[]
  priorities: string[]
  restrictedAreas: string[]
}

export type EntityRecord = {
  id: string
  name: string
  owner: string
  status: "Healthy" | "Attention" | "Critical" | "In Progress" | "Approved" | "Draft"
  value: string
  updatedAt: string
  summary: string
}

export type Recommendation = {
  id: string
  title: string
  priority: "Urgent" | "High" | "Medium" | "Low"
  confidence: number
  impact: string
  roi: string
  risk: string
  estimatedSavings: string
  pros: string[]
  cons: string[]
  dependencies: string[]
  affectedTeams: string[]
  timeline: string
}

export const integrationSystems = [
  "HubSpot",
  "Salesforce",
  "Microsoft 365",
  "Google Workspace",
  "Slack",
  "Microsoft Teams",
  "SAP",
  "Stripe",
  "QuickBooks",
  "Xero",
  "Shopify",
  "WooCommerce",
  "MCP Gateway",
]

export const rolePresets: RolePreset[] = [
  {
    role: "CEO",
    kpis: [
      { label: "Revenue Run-Rate", value: "$48.7M", trend: "+11.2%" },
      { label: "Business Health", value: "84/100", trend: "+4" },
      { label: "Strategic Initiatives", value: "19", trend: "+3" },
    ],
    prompts: [
      "Generate my executive morning briefing.",
      "What are the top 3 risks to quarterly goals?",
      "Compare growth scenarios for APAC expansion.",
      "Summarise company-wide operational bottlenecks.",
    ],
    priorities: ["Growth", "Risk Mitigation", "Capital Efficiency"],
    restrictedAreas: ["Legal Hold Documents"],
  },
  {
    role: "CFO",
    kpis: [
      { label: "Cash Position", value: "$12.4M", trend: "+$0.8M" },
      { label: "Gross Margin", value: "58.6%", trend: "+1.9%" },
      { label: "AR Over 30 Days", value: "$1.1M", trend: "-7.4%" },
    ],
    prompts: [
      "Why did revenue fall in EMEA this month?",
      "Forecast cash flow for the next two quarters.",
      "Create monthly finance board report.",
      "Recommend cost optimization actions with ROI.",
    ],
    priorities: ["Cash Flow", "Profitability", "Forecast Accuracy"],
    restrictedAreas: ["HR Compensation Records", "Legal Hold Documents"],
  },
  {
    role: "COO",
    kpis: [
      { label: "Workflow Throughput", value: "91.4%", trend: "+5.2%" },
      { label: "SLA Compliance", value: "96.1%", trend: "+1.2%" },
      { label: "Process Automation", value: "73%", trend: "+8%" },
    ],
    prompts: [
      "Show operations risks this week.",
      "Generate onboarding workflow for enterprise customers.",
      "Analyse root cause of delayed project handoffs.",
      "Recommend process automation opportunities.",
    ],
    priorities: ["Efficiency", "Reliability", "Scalability"],
    restrictedAreas: ["Legal Hold Documents"],
  },
  {
    role: "Sales Director",
    kpis: [
      { label: "Pipeline Coverage", value: "3.8x", trend: "+0.6x" },
      { label: "Win Rate", value: "33.1%", trend: "+3.4%" },
      { label: "Avg Deal Size", value: "$121K", trend: "+9.7%" },
    ],
    prompts: [
      "Tell me about ACME Ltd.",
      "Find deals at risk this quarter.",
      "Create account expansion action plan.",
      "Summarise top-performing segments.",
    ],
    priorities: ["Pipeline Quality", "Expansion", "Renewal Risk"],
    restrictedAreas: ["Payroll Files", "Legal Hold Documents"],
  },
  {
    role: "HR Director",
    kpis: [
      { label: "Hiring Velocity", value: "28 open roles", trend: "+6" },
      { label: "Attrition", value: "7.4%", trend: "-0.8%" },
      { label: "Engagement", value: "82/100", trend: "+3" },
    ],
    prompts: [
      "Predict hiring needs for next quarter.",
      "Summarise attrition risk by department.",
      "Generate leadership development report.",
      "Create onboarding workflow for managers.",
    ],
    priorities: ["Talent Retention", "Hiring", "Capability Growth"],
    restrictedAreas: ["Financial Statements", "Legal Hold Documents"],
  },
  {
    role: "Operations Manager",
    kpis: [
      { label: "Queue Cycle Time", value: "4.2h", trend: "-19%" },
      { label: "Backlog", value: "241", trend: "-36" },
      { label: "Automation Coverage", value: "62%", trend: "+11%" },
    ],
    prompts: [
      "Show today's operational hotspots.",
      "Create escalation workflow for delayed tickets.",
      "Explain SLA variance by team.",
      "Recommend staffing adjustments.",
    ],
    priorities: ["Throughput", "SLA Stability", "Cost Control"],
    restrictedAreas: ["Board Materials", "Legal Hold Documents"],
  },
  {
    role: "Marketing Manager",
    kpis: [
      { label: "Pipeline from Marketing", value: "$9.6M", trend: "+16%" },
      { label: "CAC", value: "$7.2K", trend: "-4.1%" },
      { label: "MQL to SQL", value: "38%", trend: "+5.7%" },
    ],
    prompts: [
      "Compare campaign ROI by channel.",
      "Predict demand for next quarter.",
      "Generate weekly marketing report.",
      "Summarise content performance trends.",
    ],
    priorities: ["Demand Generation", "Efficiency", "Attribution"],
    restrictedAreas: ["Compensation Files", "Legal Hold Documents"],
  },
  {
    role: "Customer Success",
    kpis: [
      { label: "NPS", value: "51", trend: "+6" },
      { label: "Renewal Rate", value: "92.3%", trend: "+2.8%" },
      { label: "Support SLA", value: "94.7%", trend: "+1.4%" },
    ],
    prompts: [
      "Tell me about ACME Ltd.",
      "Find accounts with churn risk above 70.",
      "Create renewal rescue workflow.",
      "Summarise open customer escalations.",
    ],
    priorities: ["Renewals", "Adoption", "Risk Reduction"],
    restrictedAreas: ["Payroll Files", "Legal Hold Documents"],
  },
  {
    role: "IT",
    kpis: [
      { label: "Integration Health", value: "97.1%", trend: "+0.8%" },
      { label: "Security Incidents", value: "3", trend: "-2" },
      { label: "System Uptime", value: "99.95%", trend: "+0.02%" },
    ],
    prompts: [
      "Show integration failures in the last 24h.",
      "Recommend remediation for API latency spikes.",
      "Generate weekly platform reliability report.",
      "Explain root cause of incident INC-482.",
    ],
    priorities: ["Reliability", "Security", "Performance"],
    restrictedAreas: ["Board Compensation Pack", "Legal Hold Documents"],
  },
  {
    role: "Legal",
    kpis: [
      { label: "Contract Risk Cases", value: "14", trend: "+2" },
      { label: "Policy Exceptions", value: "9", trend: "-1" },
      { label: "Review SLA", value: "95.2%", trend: "+1.1%" },
    ],
    prompts: [
      "Search contracts with renewal risk.",
      "Summarise obligations from latest supplier agreements.",
      "Generate compliance incident report.",
      "Explain policy changes impacting procurement.",
    ],
    priorities: ["Compliance", "Contract Risk", "Governance"],
    restrictedAreas: ["Payroll Files"],
  },
  {
    role: "Developer",
    kpis: [
      { label: "Deployment Frequency", value: "34/week", trend: "+5" },
      { label: "Lead Time", value: "1.8d", trend: "-0.4d" },
      { label: "Defect Escape Rate", value: "1.2%", trend: "-0.3%" },
    ],
    prompts: [
      "Generate MCP integration scaffolding.",
      "Analyse runtime regressions in payment service.",
      "Create workflow for incident triage approvals.",
      "Summarise architecture decisions this sprint.",
    ],
    priorities: ["Velocity", "Quality", "Observability"],
    restrictedAreas: ["Payroll Files", "Legal Hold Documents"],
  },
]

export const customers: EntityRecord[] = [
  { id: "cust-01", name: "ACME Ltd.", owner: "Emma Rao", status: "Attention", value: "$2.4M ARR", updatedAt: "7m ago", summary: "Renewal in 74 days; expansion blocked by security review." },
  { id: "cust-02", name: "Northstar Logistics", owner: "Tariq Benson", status: "Healthy", value: "$1.8M ARR", updatedAt: "14m ago", summary: "Onboarding complete and SLA trend improving." },
  { id: "cust-03", name: "Blue Orbit Retail", owner: "Ivy Sanchez", status: "Critical", value: "$920K ARR", updatedAt: "2m ago", summary: "Escalation due to 3 unresolved support incidents." },
  { id: "cust-04", name: "Horizon Biotech", owner: "Mina Patel", status: "Healthy", value: "$3.1M ARR", updatedAt: "23m ago", summary: "Strong adoption in analytics and automation modules." },
  { id: "cust-05", name: "Delta Manufacturing", owner: "Jon Park", status: "Attention", value: "$1.3M ARR", updatedAt: "41m ago", summary: "Invoice dispute may delay contract renewal." },
  { id: "cust-06", name: "Aster Financial", owner: "Ava Kim", status: "Healthy", value: "$2.9M ARR", updatedAt: "19m ago", summary: "QBR outcome positive with expansion to APAC." },
  { id: "cust-07", name: "Vertex Mobility", owner: "Nina Cole", status: "In Progress", value: "$760K ARR", updatedAt: "4m ago", summary: "Migration workflow 62% complete." },
  { id: "cust-08", name: "Orbit Insurance", owner: "Leo Griffin", status: "Attention", value: "$1.1M ARR", updatedAt: "31m ago", summary: "Contract obligations update required before renewal." },
  { id: "cust-09", name: "Silverline Health", owner: "Kai Jordan", status: "Healthy", value: "$2.2M ARR", updatedAt: "28m ago", summary: "Churn risk dropped from 61 to 42 this month." },
  { id: "cust-10", name: "Cedar Energy", owner: "Mara Stone", status: "Critical", value: "$1.6M ARR", updatedAt: "1m ago", summary: "Service degradation impacted executive sponsor confidence." },
]

export const meetings: EntityRecord[] = [
  { id: "mtg-01", name: "Executive Morning Brief", owner: "CEO Office", status: "Approved", value: "08:00 Today", updatedAt: "Today", summary: "Priorities, risks, wins, and action approvals." },
  { id: "mtg-02", name: "ACME Renewal War Room", owner: "Customer Success", status: "In Progress", value: "11:00 Today", updatedAt: "2h ago", summary: "Resolve legal and security blockers." },
  { id: "mtg-03", name: "Finance Forecast Review", owner: "CFO", status: "Approved", value: "13:00 Today", updatedAt: "1h ago", summary: "Review scenario assumptions and deltas." },
  { id: "mtg-04", name: "Operations Capacity Planning", owner: "COO", status: "Draft", value: "Tomorrow", updatedAt: "26m ago", summary: "Model staffing and workflow throughput." },
  { id: "mtg-05", name: "Security Incident RCA", owner: "IT", status: "Approved", value: "Tomorrow", updatedAt: "39m ago", summary: "Investigate root cause and controls." },
  { id: "mtg-06", name: "Board Pack Working Session", owner: "Strategy", status: "In Progress", value: "Thursday", updatedAt: "12m ago", summary: "Align narrative with KPI evidence." },
  { id: "mtg-07", name: "Marketing Demand Sync", owner: "Marketing", status: "Approved", value: "Weekly", updatedAt: "1d ago", summary: "Review channel ROI and conversion quality." },
  { id: "mtg-08", name: "Supplier Risk Council", owner: "Procurement", status: "Draft", value: "Friday", updatedAt: "43m ago", summary: "Mitigate concentration and compliance risks." },
  { id: "mtg-09", name: "Product Delivery Standup", owner: "Engineering", status: "Approved", value: "Daily", updatedAt: "4h ago", summary: "Roadmap execution and dependency status." },
  { id: "mtg-10", name: "Global Sales Pipeline Review", owner: "Sales", status: "Approved", value: "Weekly", updatedAt: "6h ago", summary: "Prioritize rescue and expansion opportunities." },
]

export const reports: EntityRecord[] = [
  { id: "rpt-01", name: "Board Report Q2", owner: "Strategy", status: "In Progress", value: "Quarterly", updatedAt: "9m ago", summary: "Enterprise growth, risk, and capital efficiency." },
  { id: "rpt-02", name: "Weekly Revenue Pulse", owner: "Finance", status: "Approved", value: "Weekly", updatedAt: "21m ago", summary: "Bookings, pipeline movement, and forecast variance." },
  { id: "rpt-03", name: "Operations Stability Report", owner: "COO Office", status: "Approved", value: "Weekly", updatedAt: "18m ago", summary: "Throughput, SLA, and incident trends." },
  { id: "rpt-04", name: "Customer Health Index", owner: "Customer Success", status: "Approved", value: "Weekly", updatedAt: "13m ago", summary: "Risk scores and adoption movement." },
  { id: "rpt-05", name: "Security Posture Summary", owner: "IT", status: "Attention", value: "Monthly", updatedAt: "4m ago", summary: "Critical vulnerabilities and mitigation progress." },
  { id: "rpt-06", name: "Marketing ROI Lens", owner: "Marketing", status: "Approved", value: "Monthly", updatedAt: "37m ago", summary: "CAC, attribution, and channel quality." },
  { id: "rpt-07", name: "Workforce Planning Pack", owner: "HR", status: "Draft", value: "Monthly", updatedAt: "1h ago", summary: "Hiring plan, attrition risk, and skills map." },
  { id: "rpt-08", name: "Supplier Exposure Digest", owner: "Procurement", status: "Attention", value: "Monthly", updatedAt: "11m ago", summary: "Concentration risk and contract renewal profile." },
  { id: "rpt-09", name: "Product Velocity Snapshot", owner: "Engineering", status: "Approved", value: "Weekly", updatedAt: "46m ago", summary: "Delivery pace, quality, and blocker burn-down." },
  { id: "rpt-10", name: "Investor Update Draft", owner: "CEO Office", status: "Draft", value: "Quarterly", updatedAt: "22m ago", summary: "Narrative for growth and resilience outlook." },
]

export const workflows: EntityRecord[] = [
  { id: "wf-01", name: "Enterprise Onboarding", owner: "Operations", status: "In Progress", value: "64 steps", updatedAt: "Live", summary: "Multi-team onboarding with legal and security approvals." },
  { id: "wf-02", name: "Invoice Approval", owner: "Finance", status: "Approved", value: "18 steps", updatedAt: "5m ago", summary: "Auto-match, anomaly detection, and manager approval." },
  { id: "wf-03", name: "Renewal Rescue", owner: "Customer Success", status: "Attention", value: "22 steps", updatedAt: "11m ago", summary: "Escalation workflow for high churn accounts." },
  { id: "wf-04", name: "Incident Triage", owner: "IT", status: "Approved", value: "15 steps", updatedAt: "2m ago", summary: "Severity routing, ownership, and recovery tasks." },
  { id: "wf-05", name: "Deal Desk Approval", owner: "Sales", status: "In Progress", value: "19 steps", updatedAt: "14m ago", summary: "Discount guardrails and legal checks." },
  { id: "wf-06", name: "Policy Exception Review", owner: "Governance", status: "Attention", value: "13 steps", updatedAt: "7m ago", summary: "Assess drift from corporate policy thresholds." },
  { id: "wf-07", name: "Supplier Onboarding", owner: "Procurement", status: "Draft", value: "21 steps", updatedAt: "26m ago", summary: "Risk, finance, and compliance onboarding path." },
  { id: "wf-08", name: "Board Report Assembly", owner: "Strategy", status: "Approved", value: "30 steps", updatedAt: "9m ago", summary: "Collect KPI blocks and executive commentary." },
  { id: "wf-09", name: "Marketing Campaign Launch", owner: "Marketing", status: "In Progress", value: "27 steps", updatedAt: "16m ago", summary: "Review creative, legal, and budget checks." },
  { id: "wf-10", name: "Hiring Approval", owner: "HR", status: "Approved", value: "12 steps", updatedAt: "32m ago", summary: "Role authorization and compensation governance." },
]

export const invoices: EntityRecord[] = [
  { id: "inv-01", name: "INV-2026-1142", owner: "Finance", status: "Approved", value: "$184,000", updatedAt: "12m ago", summary: "Cloud infrastructure annual renewal." },
  { id: "inv-02", name: "INV-2026-1147", owner: "Procurement", status: "Attention", value: "$92,400", updatedAt: "4m ago", summary: "Supplier contract mismatch detected." },
  { id: "inv-03", name: "INV-2026-1153", owner: "Finance", status: "In Progress", value: "$41,200", updatedAt: "7m ago", summary: "Pending department approval." },
  { id: "inv-04", name: "INV-2026-1162", owner: "Finance", status: "Approved", value: "$260,000", updatedAt: "18m ago", summary: "Data licensing for analytics stack." },
  { id: "inv-05", name: "INV-2026-1168", owner: "Operations", status: "Critical", value: "$310,000", updatedAt: "2m ago", summary: "Urgent review due to duplicate billing pattern." },
  { id: "inv-06", name: "INV-2026-1174", owner: "Finance", status: "Approved", value: "$27,600", updatedAt: "36m ago", summary: "Regional marketing retainer payment." },
  { id: "inv-07", name: "INV-2026-1180", owner: "HR", status: "Draft", value: "$12,900", updatedAt: "55m ago", summary: "Training vendor invoice draft." },
  { id: "inv-08", name: "INV-2026-1186", owner: "IT", status: "In Progress", value: "$78,250", updatedAt: "13m ago", summary: "Security tooling procurement approval chain." },
  { id: "inv-09", name: "INV-2026-1192", owner: "Finance", status: "Attention", value: "$144,100", updatedAt: "24m ago", summary: "Purchase order reference missing." },
  { id: "inv-10", name: "INV-2026-1198", owner: "Procurement", status: "Approved", value: "$53,450", updatedAt: "9m ago", summary: "Automation consulting services." },
]

export const suppliers: EntityRecord[] = [
  { id: "sup-01", name: "Atlas Cloud Services", owner: "IT", status: "Healthy", value: "$1.2M annual", updatedAt: "2d ago", summary: "Tier-1 infrastructure partner with strong SLA." },
  { id: "sup-02", name: "Lexon Legal Advisors", owner: "Legal", status: "Healthy", value: "$420K annual", updatedAt: "1d ago", summary: "Contract review throughput on target." },
  { id: "sup-03", name: "Nova Data Labs", owner: "Data Office", status: "Attention", value: "$640K annual", updatedAt: "3h ago", summary: "Data freshness incidents increased." },
  { id: "sup-04", name: "Blue Harbor Logistics", owner: "Operations", status: "Critical", value: "$510K annual", updatedAt: "48m ago", summary: "Delivery risk after regional outage." },
  { id: "sup-05", name: "Orchid Security", owner: "IT", status: "Healthy", value: "$380K annual", updatedAt: "6h ago", summary: "Threat intel feed performing well." },
  { id: "sup-06", name: "PixelForge Studio", owner: "Marketing", status: "In Progress", value: "$190K annual", updatedAt: "4h ago", summary: "Creative SLA renegotiation underway." },
  { id: "sup-07", name: "PrimeTalent Group", owner: "HR", status: "Attention", value: "$270K annual", updatedAt: "5h ago", summary: "Candidate quality variance observed." },
  { id: "sup-08", name: "CarbonPay Financial", owner: "Finance", status: "Healthy", value: "$330K annual", updatedAt: "7h ago", summary: "Payment processing resilience stable." },
  { id: "sup-09", name: "Quantum Advisory", owner: "Strategy", status: "Draft", value: "$210K annual", updatedAt: "1h ago", summary: "Renewal draft pending governance review." },
  { id: "sup-10", name: "Meridian Support Ops", owner: "Customer Success", status: "In Progress", value: "$290K annual", updatedAt: "2h ago", summary: "Escalation staffing pilot in phase 2." },
]

export const projects: EntityRecord[] = [
  { id: "prj-01", name: "AIOS APAC Expansion", owner: "Strategy", status: "In Progress", value: "$4.2M budget", updatedAt: "9m ago", summary: "Scenario planning in final recommendation cycle." },
  { id: "prj-02", name: "Revenue Intelligence 3.0", owner: "Sales Ops", status: "Approved", value: "$1.8M budget", updatedAt: "17m ago", summary: "Forecast and deal quality upgrade." },
  { id: "prj-03", name: "Workflow Automation Scale", owner: "Operations", status: "In Progress", value: "$2.1M budget", updatedAt: "13m ago", summary: "Automation coverage increased to 73%." },
  { id: "prj-04", name: "Customer Health Graph", owner: "Customer Success", status: "Attention", value: "$930K budget", updatedAt: "6m ago", summary: "Data model mismatch delaying release." },
  { id: "prj-05", name: "Finance Command Center", owner: "Finance", status: "Approved", value: "$1.2M budget", updatedAt: "31m ago", summary: "Cash forecasting and invoice intelligence." },
  { id: "prj-06", name: "Security Zero Trust Upgrade", owner: "IT", status: "Critical", value: "$2.8M budget", updatedAt: "3m ago", summary: "Identity provider outage mitigation required." },
  { id: "prj-07", name: "HR Talent Compass", owner: "HR", status: "In Progress", value: "$710K budget", updatedAt: "24m ago", summary: "Attrition prediction and skills mapping." },
  { id: "prj-08", name: "Global Reporting Modernization", owner: "BI Team", status: "Approved", value: "$1.4M budget", updatedAt: "1h ago", summary: "Board and investor report automation." },
  { id: "prj-09", name: "Supplier Risk Radar", owner: "Procurement", status: "Attention", value: "$540K budget", updatedAt: "20m ago", summary: "Cross-region concentration dashboard pending." },
  { id: "prj-10", name: "Voice Assistant Rollout", owner: "Product", status: "Draft", value: "$880K budget", updatedAt: "42m ago", summary: "Speech UX and policy guardrails design." },
]

export const aiAgents: EntityRecord[] = [
  { id: "agt-01", name: "Revenue Sentinel", owner: "Sales", status: "Healthy", value: "Autonomy 78%", updatedAt: "Live", summary: "Monitors deal health and pricing behavior." },
  { id: "agt-02", name: "Cash Guardian", owner: "Finance", status: "Healthy", value: "Autonomy 74%", updatedAt: "Live", summary: "Forecasts burn, runway, and AR risk." },
  { id: "agt-03", name: "Ops Flowkeeper", owner: "Operations", status: "Attention", value: "Autonomy 69%", updatedAt: "Live", summary: "Detects queue bottlenecks and recommends reroutes." },
  { id: "agt-04", name: "Churn Navigator", owner: "Customer Success", status: "Critical", value: "Autonomy 61%", updatedAt: "Live", summary: "Escalates high-risk customer moments." },
  { id: "agt-05", name: "Policy Guardian", owner: "Governance", status: "Healthy", value: "Autonomy 72%", updatedAt: "Live", summary: "Flags policy drift and exception risk." },
  { id: "agt-06", name: "Contract Lens", owner: "Legal", status: "In Progress", value: "Autonomy 53%", updatedAt: "Live", summary: "Extracts obligations and deadline clauses." },
  { id: "agt-07", name: "Demand Architect", owner: "Marketing", status: "Healthy", value: "Autonomy 76%", updatedAt: "Live", summary: "Optimizes campaign investment by quality signals." },
  { id: "agt-08", name: "Reliability Pilot", owner: "IT", status: "Attention", value: "Autonomy 67%", updatedAt: "Live", summary: "Correlates incidents and recommends remediations." },
  { id: "agt-09", name: "Talent Mentor", owner: "HR", status: "In Progress", value: "Autonomy 58%", updatedAt: "Live", summary: "Supports hiring plans and manager coaching." },
  { id: "agt-10", name: "Blueprint Interpreter", owner: "Strategy", status: "Healthy", value: "Autonomy 81%", updatedAt: "Live", summary: "Maps business model context to recommendations." },
]

export const knowledgeArticles: EntityRecord[] = [
  { id: "kb-01", name: "Enterprise Onboarding SOP", owner: "Operations", status: "Approved", value: "SOP-218", updatedAt: "3d ago", summary: "Standardized onboarding checkpoints and controls." },
  { id: "kb-02", name: "Pricing Governance Policy", owner: "Finance", status: "Approved", value: "POL-073", updatedAt: "6d ago", summary: "Discount boundaries and approval matrix." },
  { id: "kb-03", name: "Incident Response Playbook", owner: "IT", status: "Approved", value: "PLB-992", updatedAt: "1d ago", summary: "Severity model, escalation ladder, and communications." },
  { id: "kb-04", name: "Executive Briefing Template", owner: "Strategy", status: "Draft", value: "TMP-404", updatedAt: "5h ago", summary: "Morning briefing structure with impact framing." },
  { id: "kb-05", name: "Supplier Due Diligence SOP", owner: "Procurement", status: "Attention", value: "SOP-441", updatedAt: "8h ago", summary: "Vendor risk checks and compliance evidence." },
  { id: "kb-06", name: "Renewal Risk Framework", owner: "Customer Success", status: "Approved", value: "FRM-288", updatedAt: "2d ago", summary: "Signals for churn and expansion risk scoring." },
  { id: "kb-07", name: "Board Narrative Guide", owner: "CEO Office", status: "Approved", value: "GDE-055", updatedAt: "4d ago", summary: "How to frame evidence and recommendations." },
  { id: "kb-08", name: "Marketing Attribution Standard", owner: "Marketing", status: "In Progress", value: "STD-610", updatedAt: "12h ago", summary: "Campaign source taxonomy and weighting model." },
  { id: "kb-09", name: "Security Access Matrix", owner: "Security", status: "Approved", value: "SEC-331", updatedAt: "7d ago", summary: "Role-based access patterns and exceptions." },
  { id: "kb-10", name: "Autonomous Workflow Safety", owner: "Governance", status: "Approved", value: "SAF-710", updatedAt: "18h ago", summary: "Human-in-the-loop constraints and thresholds." },
]

export const recommendations: Recommendation[] = [
  {
    id: "rec-01",
    title: "Rescue ACME renewal with executive escalation",
    priority: "Urgent",
    confidence: 92,
    impact: "Protect $2.4M ARR",
    roi: "11.8x",
    risk: "Medium",
    estimatedSavings: "$740K churn avoidance",
    pros: ["High revenue protection", "Improves reference account retention"],
    cons: ["Requires legal fast-track", "Temporary support capacity shift"],
    dependencies: ["Legal review", "Security exception approval"],
    affectedTeams: ["Customer Success", "Legal", "IT Security"],
    timeline: "48 hours",
  },
  {
    id: "rec-02",
    title: "Automate invoice anomaly triage",
    priority: "High",
    confidence: 87,
    impact: "Reduce cycle time by 33%",
    roi: "6.2x",
    risk: "Low",
    estimatedSavings: "$210K annual",
    pros: ["Lower manual review load", "Faster payment processing"],
    cons: ["Initial workflow tuning", "Requires finance QA period"],
    dependencies: ["Workflow builder", "Approval policy update"],
    affectedTeams: ["Finance", "Procurement"],
    timeline: "2 weeks",
  },
  {
    id: "rec-03",
    title: "Rebalance support staffing for critical accounts",
    priority: "High",
    confidence: 84,
    impact: "Improve SLA by 18%",
    roi: "4.7x",
    risk: "Medium",
    estimatedSavings: "$130K penalty avoidance",
    pros: ["Immediate SLA relief", "Reduces churn pressure"],
    cons: ["May delay lower-priority queue", "Requires manager sign-off"],
    dependencies: ["HR schedule approvals"],
    affectedTeams: ["Customer Success", "Support", "HR"],
    timeline: "72 hours",
  },
  {
    id: "rec-04",
    title: "Launch APAC expansion phase 1",
    priority: "Medium",
    confidence: 76,
    impact: "Add $3.1M pipeline",
    roi: "5.4x",
    risk: "High",
    estimatedSavings: "$0 (growth action)",
    pros: ["Diversifies regional revenue", "Improves market share"],
    cons: ["Higher upfront operating cost", "Regulatory onboarding required"],
    dependencies: ["Legal entity setup", "Local partner agreements"],
    affectedTeams: ["Sales", "Finance", "Legal", "Operations"],
    timeline: "90 days",
  },
  {
    id: "rec-05",
    title: "Create root-cause watchlist for revenue dips",
    priority: "Medium",
    confidence: 81,
    impact: "Increase forecast accuracy",
    roi: "3.8x",
    risk: "Low",
    estimatedSavings: "$95K planning efficiency",
    pros: ["Improves decision quality", "Speeds executive reviews"],
    cons: ["Needs cross-team taxonomy alignment"],
    dependencies: ["Data model updates"],
    affectedTeams: ["Finance", "Strategy", "Sales Ops"],
    timeline: "3 weeks",
  },
  {
    id: "rec-06",
    title: "Consolidate low-value software vendors",
    priority: "High",
    confidence: 78,
    impact: "Lower operating expense",
    roi: "7.1x",
    risk: "Medium",
    estimatedSavings: "$420K annual",
    pros: ["Direct cost reduction", "Simplifies security footprint"],
    cons: ["Migration overhead", "Change management needed"],
    dependencies: ["IT migration plan", "Contract renegotiations"],
    affectedTeams: ["IT", "Finance", "Procurement"],
    timeline: "6 weeks",
  },
  {
    id: "rec-07",
    title: "Deploy autonomous meeting assistant",
    priority: "Medium",
    confidence: 74,
    impact: "Cut admin overhead by 21%",
    roi: "4.1x",
    risk: "Low",
    estimatedSavings: "$88K annual",
    pros: ["Faster follow-up execution", "Higher action closure rates"],
    cons: ["Requires adoption coaching"],
    dependencies: ["Calendar integration", "Policy guardrails"],
    affectedTeams: ["All Departments"],
    timeline: "4 weeks",
  },
  {
    id: "rec-08",
    title: "Trigger legal obligation extraction on new contracts",
    priority: "High",
    confidence: 89,
    impact: "Reduce missed obligations",
    roi: "6.8x",
    risk: "Low",
    estimatedSavings: "$260K compliance avoidance",
    pros: ["Improves governance", "Reduces breach risk"],
    cons: ["Requires legal taxonomy review"],
    dependencies: ["Document intelligence rollout"],
    affectedTeams: ["Legal", "Procurement", "Finance"],
    timeline: "10 days",
  },
  {
    id: "rec-09",
    title: "Enable voice mode for field operations",
    priority: "Low",
    confidence: 68,
    impact: "Faster frontline updates",
    roi: "2.9x",
    risk: "Medium",
    estimatedSavings: "$47K annual",
    pros: ["Hands-free data capture", "Improved adoption"],
    cons: ["Speech quality variance", "Privacy policy checks"],
    dependencies: ["Mobile rollout", "Security review"],
    affectedTeams: ["Operations", "IT", "Security"],
    timeline: "8 weeks",
  },
  {
    id: "rec-10",
    title: "Expand autonomous monitoring to HR and Marketing",
    priority: "Medium",
    confidence: 79,
    impact: "Earlier risk detection",
    roi: "4.9x",
    risk: "Low",
    estimatedSavings: "$170K annual",
    pros: ["Cross-functional visibility", "Lower incident response time"],
    cons: ["Alert tuning required"],
    dependencies: ["Signal configuration", "Owner assignments"],
    affectedTeams: ["HR", "Marketing", "Operations"],
    timeline: "3 weeks",
  },
]

export const businessMemoryCollections = [
  "Meetings",
  "Projects",
  "Customers",
  "Suppliers",
  "Invoices",
  "Policies",
  "SOPs",
  "Contracts",
  "Knowledge",
  "Reports",
  "Conversations",
  "Tasks",
  "Emails",
]

export const reasoningSteps = [
  "Collecting Business Signals across revenue, operations, and customer health.",
  "Correlating timeline events against forecast variance and account activity.",
  "Testing alternative hypotheses with historical patterns from memory objects.",
  "Scoring recommendations by impact, confidence, and implementation risk.",
  "Preparing approval-ready actions with owner and timeline dependencies.",
]
