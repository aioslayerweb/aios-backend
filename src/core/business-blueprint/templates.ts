import type {
  BlueprintConfidence,
  BlueprintSection,
  BlueprintSystemConnection,
  BusinessBlueprint,
  BusinessMemorySeed,
  BusinessModelBlueprintData,
  DynamicKpiDefinition,
  FinanceBlueprintData,
  GoalDefinition,
  IndustryTemplateId,
  OperationsBlueprintData,
  OrganizationBlueprintData,
  RbiRoleInitialization,
  SystemsBlueprintData,
  UsersBlueprintData,
} from "@/src/core/business-blueprint/types"

type PartialBlueprint = Omit<
  BusinessBlueprint,
  "id" | "createdAt" | "updatedAt" | "approvedAt" | "approvedBy" | "version" | "versionHistory" | "auditTrail"
>

function defaultConfidence(source: string, missingInformation: ReadonlyArray<string> = []): BlueprintConfidence {
  return {
    score: missingInformation.length ? 62 : 78,
    source,
    lastUpdated: new Date().toISOString(),
    pendingQuestions: [],
    missingInformation,
  }
}

function section<T>(data: T, source: string, missingInformation: ReadonlyArray<string> = []): BlueprintSection<T> {
  return {
    status: missingInformation.length ? "in-progress" : "complete",
    confidence: defaultConfidence(source, missingInformation),
    data,
  }
}

const defaultSystems: ReadonlyArray<BlueprintSystemConnection> = [
  { id: "sys-crm", name: "CRM", category: "crm", status: "planned" },
  { id: "sys-erp", name: "ERP", category: "erp", status: "planned" },
  { id: "sys-accounting", name: "Accounting", category: "accounting", status: "planned" },
  { id: "sys-hr", name: "HR", category: "hr", status: "planned" },
  { id: "sys-support", name: "Support", category: "support", status: "planned" },
  { id: "sys-marketing", name: "Marketing", category: "marketing", status: "planned" },
  { id: "sys-communication", name: "Communication", category: "communication", status: "planned" },
  { id: "sys-storage", name: "Storage", category: "storage", status: "planned" },
  { id: "sys-development", name: "Development", category: "development", status: "planned" },
  { id: "sys-identity", name: "Identity", category: "identity", status: "planned" },
]

const defaultUsers: UsersBlueprintData = {
  roles: [
    {
      id: "role-ceo",
      name: "CEO",
      permissions: ["blueprint:approve", "insights:read", "decisions:approve"],
      responsibilities: ["Strategy", "Executive direction", "Capital allocation"],
      decisionScope: ["company", "board"],
    },
    {
      id: "role-coo",
      name: "COO",
      permissions: ["operations:manage", "workflows:approve"],
      responsibilities: ["Operational execution", "Cross-functional coordination"],
      reportsToRoleId: "role-ceo",
      decisionScope: ["operations", "delivery"],
    },
    {
      id: "role-cfo",
      name: "CFO",
      permissions: ["finance:manage", "budgets:approve"],
      responsibilities: ["Financial governance", "Forecasting", "Profitability"],
      reportsToRoleId: "role-ceo",
      decisionScope: ["finance", "risk"],
    },
    {
      id: "role-cto",
      name: "CTO",
      permissions: ["systems:manage", "security:manage"],
      responsibilities: ["Technology architecture", "Platform reliability"],
      reportsToRoleId: "role-ceo",
      decisionScope: ["platform", "security"],
    },
  ],
  decisionMakerRoleIds: ["role-ceo", "role-coo", "role-cfo", "role-cto"],
}

const defaultRbi: ReadonlyArray<RbiRoleInitialization> = [
  { role: "ceo", intelligencePriorities: ["Strategic goals", "Growth risk", "Capital efficiency"], keyKpiIds: ["kpi-revenue-growth", "kpi-ebitda"], recommendedViews: ["Executive Briefing", "Decision Center", "Board Summary"] },
  { role: "coo", intelligencePriorities: ["Workflow throughput", "Delivery SLA", "Process bottlenecks"], keyKpiIds: ["kpi-throughput", "kpi-sla"], recommendedViews: ["Operations Command", "Execution Queue", "Workflow Reliability"] },
  { role: "cfo", intelligencePriorities: ["Cost control", "Runway", "Forecast variance"], keyKpiIds: ["kpi-burn", "kpi-forecast-variance"], recommendedViews: ["Financial Intelligence", "Budget Health", "Forecast Risk"] },
  { role: "cto", intelligencePriorities: ["System reliability", "Incident risk", "Delivery velocity"], keyKpiIds: ["kpi-uptime", "kpi-mttr"], recommendedViews: ["Runtime Center", "Architecture Integrity", "Security Posture"] },
  { role: "sales", intelligencePriorities: ["Pipeline health", "Win rate", "Retention risk"], keyKpiIds: ["kpi-pipeline-coverage", "kpi-win-rate"], recommendedViews: ["Revenue Operator", "Opportunity Radar", "Renewal Signals"] },
  { role: "marketing", intelligencePriorities: ["Demand quality", "Attribution clarity", "CAC efficiency"], keyKpiIds: ["kpi-cac", "kpi-conversion-rate"], recommendedViews: ["Demand Intelligence", "Campaign Performance", "Segment Quality"] },
  { role: "hr", intelligencePriorities: ["Hiring velocity", "Retention risk", "Capability gaps"], keyKpiIds: ["kpi-retention", "kpi-time-to-hire"], recommendedViews: ["People Intelligence", "Capability Map", "Attrition Risk"] },
  { role: "operations", intelligencePriorities: ["Execution reliability", "Approval latency", "Queue health"], keyKpiIds: ["kpi-cycle-time", "kpi-first-pass-yield"], recommendedViews: ["Operations Center", "Approval Radar", "SLA Performance"] },
  { role: "support", intelligencePriorities: ["Ticket deflection", "Resolution quality", "Escalation risk"], keyKpiIds: ["kpi-csat", "kpi-first-response-time"], recommendedViews: ["Support Intelligence", "Escalation Signals", "Case Throughput"] },
  { role: "developers", intelligencePriorities: ["Release quality", "Defect escape", "Cycle efficiency"], keyKpiIds: ["kpi-deployment-frequency", "kpi-change-failure-rate"], recommendedViews: ["Developer Center", "Quality Signals", "Delivery Intelligence"] },
]

function industryKpis(industry: IndustryTemplateId): ReadonlyArray<DynamicKpiDefinition> {
  const base: ReadonlyArray<DynamicKpiDefinition> = [
    {
      id: "kpi-revenue-growth",
      name: "Revenue Growth",
      description: "Net revenue growth over baseline period.",
      formula: "(current_revenue - baseline_revenue) / baseline_revenue",
      department: "Finance",
      priority: "critical",
      frequency: "monthly",
      ownerRole: "CFO",
      thresholds: { warning: 0.03, critical: 0.0, target: 0.08 },
      industryTags: [industry, "executive"],
    },
    {
      id: "kpi-throughput",
      name: "Workflow Throughput",
      description: "Completed workflows over reporting period.",
      formula: "completed_workflows / period",
      department: "Operations",
      priority: "high",
      frequency: "weekly",
      ownerRole: "COO",
      thresholds: { warning: 0.7, critical: 0.5, target: 0.9 },
      industryTags: [industry, "operations"],
    },
  ]

  if (industry === "saas") {
    return [
      ...base,
      {
        id: "kpi-nrr",
        name: "Net Revenue Retention",
        description: "Revenue retention including expansion and contraction.",
        formula: "(starting_arr + expansion - contraction - churn) / starting_arr",
        department: "Revenue",
        priority: "critical",
        frequency: "monthly",
        ownerRole: "CEO",
        thresholds: { warning: 1.0, critical: 0.95, target: 1.1 },
        industryTags: [industry, "subscription"],
      },
    ]
  }

  if (industry === "ecommerce" || industry === "retail") {
    return [
      ...base,
      {
        id: "kpi-aov",
        name: "Average Order Value",
        description: "Average order value by active channels.",
        formula: "gross_sales / total_orders",
        department: "Sales",
        priority: "high",
        frequency: "daily",
        ownerRole: "COO",
        thresholds: { warning: 45, critical: 35, target: 60 },
        industryTags: [industry, "commerce"],
      },
    ]
  }

  return base
}

function industryGoals(industry: IndustryTemplateId): ReadonlyArray<GoalDefinition> {
  return [
    {
      id: `goal-${industry}-growth`,
      title: "Sustain profitable growth",
      type: "strategic",
      ownerRole: "CEO",
      successMetrics: ["kpi-revenue-growth"],
      horizon: "year",
    },
    {
      id: `goal-${industry}-operations`,
      title: "Improve operational execution reliability",
      type: "operational",
      ownerRole: "COO",
      successMetrics: ["kpi-throughput"],
      horizon: "quarter",
    },
  ]
}

function industryMemorySeeds(industry: IndustryTemplateId): ReadonlyArray<BusinessMemorySeed> {
  return [
    {
      id: `memory-${industry}-model`,
      title: "Business model baseline",
      summary: `Initial ${industry} business model assumptions and dependencies.`,
      sourceSection: "businessModel",
      tags: [industry, "baseline"],
    },
    {
      id: `memory-${industry}-ops`,
      title: "Operations baseline",
      summary: "Initial process criticality and workflow assumptions.",
      sourceSection: "operations",
      tags: [industry, "operations"],
    },
  ]
}

function templateOrganization(industry: IndustryTemplateId): OrganizationBlueprintData {
  return {
    name: "New Organization",
    industry,
    subIndustry: undefined,
    country: "Unknown",
    legalStructure: "Private",
    employeeCount: 50,
    locations: [{ id: "loc-hq", label: "Headquarters", country: "Unknown", isHeadquarters: true }],
    departments: [
      { id: "dept-exec", name: "Executive", headRole: "CEO", teamIds: ["team-leadership"] },
      { id: "dept-ops", name: "Operations", headRole: "COO", teamIds: ["team-ops"] },
      { id: "dept-fin", name: "Finance", headRole: "CFO", teamIds: ["team-finance"] },
      { id: "dept-tech", name: "Technology", headRole: "CTO", teamIds: ["team-platform"] },
    ],
    teams: [
      { id: "team-leadership", name: "Leadership", departmentId: "dept-exec", responsibilities: ["Strategy"] },
      { id: "team-ops", name: "Operations Team", departmentId: "dept-ops", responsibilities: ["Execution"] },
      { id: "team-finance", name: "Finance Team", departmentId: "dept-fin", responsibilities: ["Planning"] },
      { id: "team-platform", name: "Platform Team", departmentId: "dept-tech", responsibilities: ["Systems"] },
    ],
    businessUnits: [{ id: "bu-core", name: "Core Business", ownerRole: "CEO", markets: ["Primary"] }],
  }
}

function templateBusinessModel(industry: IndustryTemplateId): BusinessModelBlueprintData {
  return {
    revenueStreams: [
      { id: `rev-${industry}-primary`, name: "Primary Revenue", type: "service", primaryMarkets: ["Primary"] },
    ],
    products: [{ id: `prod-${industry}-core`, name: "Core Offering", category: industry, lifecycleStage: "growth" }],
    services: [{ id: `svc-${industry}-services`, name: "Professional Services", category: "Services" }],
    subscriptions: [{ id: `sub-${industry}-plan`, name: "Standard Plan", category: "Subscription" }],
    projects: [{ id: `project-${industry}-delivery`, name: "Delivery Project", category: "Project" }],
    relationships: [
      { id: "rel-customers", name: "Customers", type: "customer" },
      { id: "rel-partners", name: "Partners", type: "partner" },
      { id: "rel-vendors", name: "Vendors", type: "vendor" },
      { id: "rel-channels", name: "Channels", type: "channel" },
    ],
    markets: ["Primary"],
  }
}

function templateOperations(industry: IndustryTemplateId): OperationsBlueprintData {
  return {
    processes: [
      { id: `process-${industry}-delivery`, name: "Service Delivery", ownerRole: "COO", criticality: "high" },
      { id: `process-${industry}-planning`, name: "Planning", ownerRole: "CEO", criticality: "high" },
    ],
    workflows: [
      { id: `workflow-${industry}-approval`, name: "Executive Approval", trigger: "Budget threshold exceeded", approvalRequired: true },
      { id: `workflow-${industry}-ops`, name: "Operations Daily Run", trigger: "Daily schedule", approvalRequired: false },
    ],
    approvals: [
      { id: `approval-${industry}-budget`, name: "Budget Approval", approverRoles: ["CFO", "CEO"], condition: "Amount > policy threshold" },
    ],
    policies: [
      { id: `policy-${industry}-security`, name: "Security Policy", scope: "systems", ownerRole: "CTO" },
      { id: `policy-${industry}-compliance`, name: "Compliance Policy", scope: "operations", ownerRole: "COO" },
    ],
    assets: [
      { id: `asset-${industry}-core`, name: "Core Asset", category: "digital", ownerRole: "COO" },
    ],
    serviceDeliveryModel: "Managed",
  }
}

function templateFinance(): FinanceBlueprintData {
  return {
    currencies: ["EUR"],
    revenueModel: "Recurring and project revenue",
    costModel: "Fixed plus variable operating costs",
    profitCenters: ["Core", "Expansion"],
    budgets: [
      { id: "budget-annual", name: "Annual Budget", amount: 1000000, currency: "EUR", period: "annual" },
    ],
    forecasts: [
      { id: "forecast-quarter", name: "Quarter Forecast", period: "quarter", value: 280000, confidence: 74 },
    ],
    financialKpiIds: ["kpi-revenue-growth"],
  }
}

export function createTemplateBlueprint(templateId: IndustryTemplateId): PartialBlueprint {
  const systems: SystemsBlueprintData = { connectedPlatforms: defaultSystems }
  const users = defaultUsers
  const kpis = industryKpis(templateId)
  const goals = industryGoals(templateId)
  const memory = industryMemorySeeds(templateId)

  return {
    templateId,
    organization: section(templateOrganization(templateId), "industry-template", ["organization.subIndustry", "organization.country"]),
    businessModel: section(templateBusinessModel(templateId), "industry-template", ["businessModel.markets"]),
    operations: section(templateOperations(templateId), "industry-template"),
    finance: section(templateFinance(), "industry-template", ["finance.budgets", "finance.forecasts"]),
    systems: section(systems, "industry-template", ["systems.connectedPlatforms.status"]),
    users: section(users, "industry-template", ["users.roles.permissions"]),
    kpis: section(kpis, "industry-template"),
    goals: section(goals, "industry-template"),
    businessMemory: section(memory, "industry-template"),
    rbiInitialization: section(defaultRbi, "industry-template"),
  }
}