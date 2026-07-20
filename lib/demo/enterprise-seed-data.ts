export type EnterpriseEntity = {
  id: string;
  name: string;
  owner: string;
  status: "healthy" | "watch" | "risk";
  value: string;
  confidence: number;
  updatedAt: string;
};

export type EnterpriseDataset = {
  title: string;
  entities: EnterpriseEntity[];
};

function createEntities(prefix: string, names: string[]): EnterpriseEntity[] {
  return names.map((name, index) => {
    const cycle = index % 3;
    const status: EnterpriseEntity["status"] = cycle === 0 ? "healthy" : cycle === 1 ? "watch" : "risk";

    return {
      id: `${prefix}-${index + 1}`,
      name,
      owner: ["Executive Office", "Finance", "Operations", "Sales", "Customer Success"][index % 5] ?? "Executive Office",
      status,
      value: `EUR ${(1.4 + index * 0.7).toFixed(1)}M`,
      confidence: 82 + ((index * 3) % 15),
      updatedAt: `${Math.max(1, 19 - index)}m ago`,
    };
  });
}

export const enterpriseDatasets: EnterpriseDataset[] = [
  {
    title: "Companies",
    entities: createEntities("company", [
      "Northwind Logistics",
      "Bluewave Manufacturing",
      "Helios Retail Group",
      "Aster Energy",
      "Crestline Telecom",
      "Delta Maritime",
      "Veridian Health",
      "Aurora Foods",
      "Summit Mobility",
      "Orion Infrastructure",
    ]),
  },
  {
    title: "Employees",
    entities: createEntities("employee", [
      "Meelis Vaher",
      "Anika Feldman",
      "Rafael Ortega",
      "Nadia Petrov",
      "Milo Jensen",
      "Priya Sen",
      "Luca Marino",
      "Hana Kim",
      "Jonas Adler",
      "Eleni Costa",
    ]),
  },
  {
    title: "Meetings",
    entities: createEntities("meeting", [
      "Board Strategy Sync",
      "Revenue Quality Review",
      "Customer Churn Council",
      "Supply Resilience Forum",
      "Executive Morning Brief",
      "Risk Response Cadence",
      "Finance Forecast Update",
      "Partner Governance Meeting",
      "QBI Simulation Debrief",
      "AI Operator Alignment",
    ]),
  },
  {
    title: "Workflows",
    entities: createEntities("workflow", [
      "Onboarding Acceleration",
      "Contract Approval Loop",
      "Invoice Exception Handling",
      "Renewal Risk Recovery",
      "Procurement Escalation",
      "Incident Coordination",
      "Pricing Approval Flow",
      "Board Briefing Generator",
      "Compliance Evidence Capture",
      "Sales Handoff Sequencing",
    ]),
  },
  {
    title: "Opportunities",
    entities: createEntities("opportunity", [
      "Skyline Aviation Expansion",
      "Global Marine Upsell",
      "BetaTech Retention Offer",
      "Metro Grid Modernization",
      "Atlas Retail Renewal",
      "Prime Labs Migration",
      "Nova Freight Package",
      "Verde Energy Bundle",
      "Apex Finance Rollout",
      "Polar Foods Partnership",
    ]),
  },
  {
    title: "Risks",
    entities: createEntities("risk", [
      "Churn Spike Segment C",
      "Cash Conversion Delay",
      "Supplier Concentration",
      "Regulatory Filing Lag",
      "Model Drift in Forecast",
      "Contract SLA Breach",
      "Hiring Pipeline Gap",
      "Critical Incident Backlog",
      "Renewal Timing Slippage",
      "Data Quality Deviation",
    ]),
  },
  {
    title: "Products",
    entities: createEntities("product", [
      "AIOS Executive Center",
      "AIOS QBI Engine",
      "AIOS Memory Core",
      "AIOS Workflow Studio",
      "AIOS Decision Queue",
      "AIOS Knowledge Graph",
      "AIOS Customer 360",
      "AIOS Sales Intelligence",
      "AIOS Finance Intelligence",
      "AIOS Governance Layer",
    ]),
  },
  {
    title: "Suppliers",
    entities: createEntities("supplier", [
      "Vertex Cloud Systems",
      "NorthPeak Analytics",
      "BlueArc Security",
      "Mosaic Data Fabric",
      "Mercury Hardware",
      "Catalyst Integrations",
      "Nova Ledger Services",
      "Anchor Legal Advisory",
      "Pioneer Logistics",
      "Summit Talent Partners",
    ]),
  },
  {
    title: "Integrations",
    entities: createEntities("integration", [
      "Microsoft 365",
      "Google Workspace",
      "Slack",
      "HubSpot",
      "Salesforce",
      "GitHub",
      "Jira",
      "Shopify",
      "Stripe",
      "QuickBooks",
    ]),
  },
  {
    title: "Reports",
    entities: createEntities("report", [
      "Board Narrative Q3",
      "Revenue Integrity Weekly",
      "Risk and Controls Digest",
      "Growth Opportunity Radar",
      "Customer Health Recap",
      "Operations Performance",
      "Finance Variance Memo",
      "AI Operator Performance",
      "Compliance Status Brief",
      "Executive Morning Brief",
    ]),
  },
  {
    title: "Dashboards",
    entities: createEntities("dashboard", [
      "Executive Command Center",
      "Business Blueprint Center",
      "Memory Intelligence Center",
      "QBI Probability Studio",
      "Decision Control Tower",
      "Workflow Operations Hub",
      "Governance Assurance Desk",
      "Security Signal Board",
      "Customer Journey Intelligence",
      "Developer Runtime Studio",
    ]),
  },
  {
    title: "Notifications",
    entities: createEntities("notification", [
      "Risk threshold breached",
      "Revenue projection upgraded",
      "Supplier incident detected",
      "Approval decision required",
      "Policy update published",
      "Workflow execution complete",
      "Customer sentiment shifted",
      "Forecast confidence improved",
      "Budget variance warning",
      "AI recommendation available",
    ]),
  },
  {
    title: "Approvals",
    entities: createEntities("approval", [
      "Budget Reallocation",
      "Contract Renewal",
      "Hiring Plan",
      "Security Exception",
      "Pricing Adjustment",
      "Marketing Campaign",
      "Supplier Change",
      "Governance Policy",
      "Workflow Automation",
      "QBI Scenario Selection",
    ]),
  },
  {
    title: "Recommendations",
    entities: createEntities("recommendation", [
      "Save at-risk enterprise segment",
      "Accelerate upsell sequence",
      "Rebalance support capacity",
      "Advance procurement trigger",
      "Lock forecast assumptions",
      "Increase board signal cadence",
      "Consolidate supplier contracts",
      "Prioritize product bundle",
      "Refine pricing guardrails",
      "Automate approval routing",
    ]),
  },
  {
    title: "Decisions",
    entities: createEntities("decision", [
      "Approve renewal discount",
      "Escalate risk protocol",
      "Adopt new supplier",
      "Defer hiring expansion",
      "Launch APAC package",
      "Adjust Q4 targets",
      "Approve capex plan",
      "Roll out workflow v2",
      "Update compliance scope",
      "Expand AI operator budget",
    ]),
  },
  {
    title: "AI Operators",
    entities: createEntities("operator", [
      "Executive Operator",
      "Sales Operator",
      "Finance Operator",
      "HR Operator",
      "Operations Operator",
      "Support Operator",
      "Marketing Operator",
      "Legal Operator",
      "Developer Operator",
      "Compliance Operator",
    ]),
  },
];

export const enterpriseKpis = [
  { label: "Total Revenue (YTD)", value: "EUR 24.8M", delta: "+18.6%" },
  { label: "Pipeline Value", value: "EUR 37.6M", delta: "+21.3%" },
  { label: "Active Customers", value: "642", delta: "+8.7%" },
  { label: "Churn Risk", value: "23", delta: "-12.2%" },
  { label: "AI Actions", value: "128", delta: "+32%" },
];
