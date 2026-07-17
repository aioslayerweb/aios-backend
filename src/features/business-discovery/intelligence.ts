import { createBusinessBlueprintEngine, type BlueprintDepartment, type BlueprintLocation, type BlueprintProcess, type BlueprintRevenueStream, type BlueprintSystemConnection, type BlueprintUserRole, type DynamicKpiDefinition, type GoalDefinition, type IndustryTemplateId } from "@/src/core/business-blueprint"
import type { DetectedIndustry, DiscoveryAnalysis, DiscoveryAnswers, DiscoveryQuestion, DiscoveryRecommendations } from "@/src/features/business-discovery/types"

const QUESTION_BANK: ReadonlyArray<DiscoveryQuestion> = [
  {
    id: "company_name",
    topic: "Company",
    prompt: "What is your company name?",
    placeholder: "Example: Northwind Logistics",
    required: true,
  },
  {
    id: "industry_context",
    topic: "Industry",
    prompt: "Describe your industry and what you sell.",
    hint: "Include your core offer, who buys it, and how value is delivered.",
    required: true,
  },
  {
    id: "revenue_model",
    topic: "Revenue model",
    prompt: "How do you make money today?",
    options: ["Subscriptions", "Products", "Services", "Projects", "Mixed"],
    required: true,
  },
  {
    id: "products_services",
    topic: "Products and services",
    prompt: "What are your main products or services?",
    placeholder: "Comma-separated list",
    required: true,
  },
  {
    id: "customers_markets",
    topic: "Customers and markets",
    prompt: "Who are your main customers and markets?",
    required: true,
  },
  {
    id: "employee_count",
    topic: "Employees",
    prompt: "How many employees do you have?",
    options: ["1-50", "51-200", "201-1000", "1000+"],
    required: true,
  },
  {
    id: "departments",
    topic: "Departments",
    prompt: "Which departments are critical for your operation?",
    placeholder: "Example: Sales, Operations, Finance, Product",
    required: true,
  },
  {
    id: "locations",
    topic: "Locations",
    prompt: "Where do you operate?",
    placeholder: "Countries or cities",
    required: true,
  },
  {
    id: "current_systems",
    topic: "Current systems",
    prompt: "Which systems are currently in use?",
    placeholder: "Example: Salesforce, NetSuite, HubSpot, Zendesk",
    required: true,
  },
  {
    id: "challenges",
    topic: "Biggest challenges",
    prompt: "What are the top business challenges right now?",
    required: true,
  },
  {
    id: "business_goals",
    topic: "Business goals",
    prompt: "What are your top goals for the next 12 months?",
    required: true,
  },
  {
    id: "kpis",
    topic: "KPIs",
    prompt: "Which KPIs do executives track most closely?",
    placeholder: "Example: NRR, gross margin, churn, SLA",
    required: true,
  },
  {
    id: "decision_makers",
    topic: "Decision makers",
    prompt: "Who makes strategic and operational decisions?",
    required: true,
  },
  {
    id: "reporting_structure",
    topic: "Reporting structure",
    prompt: "How does reporting flow across leadership and teams?",
    required: true,
  },
  {
    id: "operational_processes",
    topic: "Operational processes",
    prompt: "Which operational processes are most business-critical?",
    placeholder: "Example: order-to-cash, onboarding, incident response",
    required: true,
  },
  {
    id: "growth_plans",
    topic: "Growth plans",
    prompt: "What are your expansion or growth plans?",
    required: true,
  },
  {
    id: "compliance_requirements",
    topic: "Compliance",
    prompt: "Which compliance or governance requirements must be respected?",
    options: ["SOC 2", "ISO 27001", "GDPR", "HIPAA", "PCI-DSS", "Internal policy only"],
    required: true,
  },
  {
    id: "subscription_risk",
    topic: "Subscription health",
    prompt: "How do you monitor retention, churn, and expansion risk?",
    required: false,
    condition: (answers) => hasWord(answers.revenue_model, ["subscription", "saas", "recurring"]),
  },
  {
    id: "supply_chain",
    topic: "Operations depth",
    prompt: "How is your supply chain or fulfillment operation managed?",
    required: false,
    condition: (answers) => hasWord(answers.industry_context, ["retail", "ecommerce", "manufacturing"]),
  },
  {
    id: "service_quality",
    topic: "Service quality",
    prompt: "How do you measure service quality and resolution performance?",
    required: false,
    condition: (answers) => hasWord(answers.products_services, ["service", "support", "consulting"]),
  },
]

const REQUIRED_QUESTION_IDS = QUESTION_BANK.filter((question) => question.required).map((question) => question.id)

type IndustryProfile = {
  readonly templateId: IndustryTemplateId
  readonly industry: string
  readonly subIndustry: string
  readonly businessModel: string
  readonly keywords: ReadonlyArray<string>
  readonly suggestedKpis: ReadonlyArray<string>
  readonly suggestedIntegrations: ReadonlyArray<string>
  readonly suggestedDashboards: ReadonlyArray<string>
  readonly suggestedWorkflows: ReadonlyArray<string>
}

const INDUSTRY_PROFILES: ReadonlyArray<IndustryProfile> = [
  {
    templateId: "saas",
    industry: "Software",
    subIndustry: "B2B SaaS",
    businessModel: "Recurring subscriptions with expansion",
    keywords: ["saas", "software", "subscription", "platform", "arr", "mrr"],
    suggestedKpis: ["Net Revenue Retention", "Gross Revenue Retention", "Churn Rate", "Activation Rate", "Pipeline Coverage"],
    suggestedIntegrations: ["Salesforce", "HubSpot", "Stripe", "Zendesk", "Snowflake"],
    suggestedDashboards: ["Executive Growth Board", "Churn Intelligence", "Revenue Forecast", "Customer Health"],
    suggestedWorkflows: ["Renewal Risk Escalation", "Expansion Qualification", "Executive Weekly Briefing"],
  },
  {
    templateId: "ecommerce",
    industry: "Commerce",
    subIndustry: "Ecommerce and Marketplace",
    businessModel: "Product sales and repeat purchase optimization",
    keywords: ["ecommerce", "shop", "store", "sku", "fulfillment", "order"],
    suggestedKpis: ["Average Order Value", "Conversion Rate", "Repeat Purchase Rate", "Return Rate", "Fulfillment SLA"],
    suggestedIntegrations: ["Shopify", "NetSuite", "Google Analytics", "Klaviyo", "Stripe"],
    suggestedDashboards: ["Commerce Performance", "Inventory Risk", "Demand Signals", "Fulfillment Control"],
    suggestedWorkflows: ["Stockout Prevention", "Return Root-Cause Routing", "High-Value Cart Recovery"],
  },
  {
    templateId: "manufacturing",
    industry: "Manufacturing",
    subIndustry: "Discrete and Process Manufacturing",
    businessModel: "Production efficiency and contract revenue",
    keywords: ["manufacturing", "plant", "factory", "production", "quality", "procurement"],
    suggestedKpis: ["OEE", "First Pass Yield", "Scrap Rate", "On-Time Delivery", "Cycle Time"],
    suggestedIntegrations: ["SAP", "Oracle ERP", "MES", "ServiceNow", "Power BI"],
    suggestedDashboards: ["Plant Performance", "Quality Intelligence", "Supply Chain Risk", "Capacity Planning"],
    suggestedWorkflows: ["Quality Escalation", "Maintenance Prioritization", "Supplier Delay Mitigation"],
  },
  {
    templateId: "healthcare",
    industry: "Healthcare",
    subIndustry: "Provider and Clinical Operations",
    businessModel: "Care delivery and reimbursement optimization",
    keywords: ["health", "clinic", "hospital", "patient", "clinical", "hipaa"],
    suggestedKpis: ["Patient Wait Time", "Readmission Rate", "Claims Cycle Time", "Utilization", "Care Quality"],
    suggestedIntegrations: ["Epic", "Cerner", "Workday", "ServiceNow", "Snowflake"],
    suggestedDashboards: ["Clinical Operations", "Access and Throughput", "Claims Performance", "Risk and Compliance"],
    suggestedWorkflows: ["Care Escalation", "Claims Exception Routing", "Staffing Rebalance"],
  },
  {
    templateId: "consulting",
    industry: "Professional Services",
    subIndustry: "Consulting and Advisory",
    businessModel: "Project and retainer services",
    keywords: ["consulting", "advisory", "retainer", "billable", "engagement"],
    suggestedKpis: ["Utilization", "Billable Margin", "Pipeline-to-Staffing Fit", "Delivery SLA", "Client NPS"],
    suggestedIntegrations: ["Salesforce", "Jira", "Asana", "NetSuite", "HubSpot"],
    suggestedDashboards: ["Engagement Health", "Delivery Margin", "Capacity Forecast", "Executive Portfolio View"],
    suggestedWorkflows: ["Staffing Optimization", "Delivery Risk Escalation", "Margin Protection"],
  },
]

function hasWord(source: string | undefined, words: ReadonlyArray<string>): boolean {
  const normalized = source?.toLowerCase() ?? ""
  return words.some((word) => normalized.includes(word))
}

function splitList(source: string | undefined): string[] {
  if (!source) {
    return []
  }

  return source
    .split(/[;,\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizeEmployeeCount(raw: string | undefined): number {
  const value = (raw ?? "").toLowerCase()
  if (value.includes("1000")) {
    return 1400
  }
  if (value.includes("201") || value.includes("200") || value.includes("500")) {
    return 420
  }
  if (value.includes("51") || value.includes("50") || value.includes("200")) {
    return 120
  }

  const numeric = Number.parseInt(value.replace(/[^0-9]/g, ""), 10)
  if (Number.isFinite(numeric) && numeric > 0) {
    return numeric
  }

  return 50
}

function detectIndustry(answers: DiscoveryAnswers): DetectedIndustry {
  const corpus = [
    answers.industry_context,
    answers.revenue_model,
    answers.products_services,
    answers.customers_markets,
    answers.current_systems,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  const scored = INDUSTRY_PROFILES.map((profile) => ({
    profile,
    score: profile.keywords.reduce((total, keyword) => (corpus.includes(keyword) ? total + 1 : total), 0),
  }))

  scored.sort((left, right) => right.score - left.score)
  const winner = scored[0]

  if (!winner || winner.score === 0) {
    const fallback = INDUSTRY_PROFILES[0]
    return {
      industry: "General Business",
      subIndustry: "Multi-function enterprise",
      businessModel: "Mixed revenue model",
      confidence: 56,
      templateId: fallback.templateId,
      suggestedKpis: fallback.suggestedKpis,
      suggestedIntegrations: fallback.suggestedIntegrations,
      suggestedDashboards: fallback.suggestedDashboards,
      suggestedWorkflows: fallback.suggestedWorkflows,
    }
  }

  const confidence = Math.min(97, 55 + winner.score * 8)
  return {
    industry: winner.profile.industry,
    subIndustry: winner.profile.subIndustry,
    businessModel: winner.profile.businessModel,
    confidence,
    templateId: winner.profile.templateId,
    suggestedKpis: winner.profile.suggestedKpis,
    suggestedIntegrations: winner.profile.suggestedIntegrations,
    suggestedDashboards: winner.profile.suggestedDashboards,
    suggestedWorkflows: winner.profile.suggestedWorkflows,
  }
}

function unique(values: ReadonlyArray<string>): string[] {
  return Array.from(new Set(values.filter(Boolean)))
}

function mapDepartments(departmentNames: ReadonlyArray<string>): ReadonlyArray<BlueprintDepartment> {
  return departmentNames.map((name, index) => ({
    id: `dept-${index + 1}`,
    name,
    headRole: index === 0 ? "CEO" : undefined,
    teamIds: [`team-${index + 1}`],
  }))
}

function mapLocations(rawLocations: ReadonlyArray<string>): ReadonlyArray<BlueprintLocation> {
  return rawLocations.map((location, index) => ({
    id: `loc-${index + 1}`,
    label: location,
    country: location,
    isHeadquarters: index === 0,
  }))
}

function inferSystems(names: ReadonlyArray<string>): ReadonlyArray<BlueprintSystemConnection> {
  return names.map((name, index) => {
    const normalized = name.toLowerCase()
    let category: BlueprintSystemConnection["category"] = "other"

    if (normalized.includes("salesforce") || normalized.includes("hubspot") || normalized.includes("crm")) {
      category = "crm"
    } else if (normalized.includes("erp") || normalized.includes("netsuite") || normalized.includes("sap") || normalized.includes("oracle")) {
      category = "erp"
    } else if (normalized.includes("stripe") || normalized.includes("accounting") || normalized.includes("xero")) {
      category = "accounting"
    } else if (normalized.includes("workday") || normalized.includes("hr")) {
      category = "hr"
    } else if (normalized.includes("zendesk") || normalized.includes("support")) {
      category = "support"
    } else if (normalized.includes("slack") || normalized.includes("teams")) {
      category = "communication"
    } else if (normalized.includes("jira") || normalized.includes("github")) {
      category = "development"
    }

    return {
      id: `system-${index + 1}`,
      name,
      category,
      status: "connected",
    }
  })
}

function inferProcesses(processNames: ReadonlyArray<string>): ReadonlyArray<BlueprintProcess> {
  return processNames.map((name, index) => ({
    id: `process-${index + 1}`,
    name,
    ownerRole: index === 0 ? "COO" : "Operations",
    criticality: index === 0 ? "critical" : "high",
  }))
}

function inferRevenueStreams(revenueModel: string, offers: ReadonlyArray<string>): ReadonlyArray<BlueprintRevenueStream> {
  const lower = revenueModel.toLowerCase()

  if (lower.includes("subscription")) {
    return [{ id: "rev-subscription", name: "Subscription Revenue", type: "subscription", primaryMarkets: ["Core"] }]
  }

  if (lower.includes("project")) {
    return [{ id: "rev-project", name: "Project Revenue", type: "project", primaryMarkets: ["Core"] }]
  }

  if (lower.includes("product")) {
    return [{ id: "rev-product", name: "Product Sales", type: "product", primaryMarkets: ["Core"] }]
  }

  if (lower.includes("service")) {
    return [{ id: "rev-service", name: "Service Revenue", type: "service", primaryMarkets: ["Core"] }]
  }

  return [
    { id: "rev-primary", name: offers[0] ?? "Primary Revenue", type: "other", primaryMarkets: ["Core"] },
  ]
}

function inferKpis(list: ReadonlyArray<string>, suggestedKpis: ReadonlyArray<string>): ReadonlyArray<DynamicKpiDefinition> {
  const source = unique([...list, ...suggestedKpis.slice(0, 3)])

  return source.map((name, index) => ({
    id: `kpi-${index + 1}`,
    name,
    description: `${name} tracked by executive team for discovery baseline.`,
    formula: "defined-during-implementation",
    department: "Executive",
    priority: index === 0 ? "critical" : "high",
    frequency: index < 2 ? "weekly" : "monthly",
    ownerRole: index === 0 ? "CEO" : "COO",
    thresholds: { warning: 0.7, critical: 0.5, target: 0.9 },
    industryTags: ["discovery"],
  }))
}

function inferGoals(list: ReadonlyArray<string>, suggestedKpis: ReadonlyArray<string>): ReadonlyArray<GoalDefinition> {
  const source = unique(list)
  if (!source.length) {
    return [
      {
        id: "goal-discovery-1",
        title: "Establish measurable operating baseline",
        type: "strategic",
        ownerRole: "CEO",
        successMetrics: suggestedKpis.slice(0, 2).map((_, index) => `kpi-${index + 1}`),
        horizon: "year",
      },
    ]
  }

  return source.map((goal, index) => ({
    id: `goal-${index + 1}`,
    title: goal,
    type: index === 0 ? "strategic" : "operational",
    ownerRole: index === 0 ? "CEO" : "COO",
    successMetrics: suggestedKpis.slice(0, 2).map((_, metricIndex) => `kpi-${metricIndex + 1}`),
    horizon: index === 0 ? "year" : "quarter",
  }))
}

function inferRoles(decisionMakers: string, reportingStructure: string): ReadonlyArray<BlueprintUserRole> {
  const people = unique([...splitList(decisionMakers), ...splitList(reportingStructure)])
  if (!people.length) {
    return [
      {
        id: "role-ceo",
        name: "CEO",
        permissions: ["blueprint:approve", "decisions:approve"],
        responsibilities: ["Company strategy", "Executive decisions"],
        decisionScope: ["company"],
      },
    ]
  }

  return people.slice(0, 8).map((name, index) => ({
    id: `role-${index + 1}`,
    name,
    permissions: index === 0 ? ["blueprint:approve", "decisions:approve"] : ["insights:read", "workflows:approve"],
    responsibilities: index === 0 ? ["Strategic decisions"] : ["Operational decisions"],
    reportsToRoleId: index === 0 ? undefined : "role-1",
    decisionScope: index === 0 ? ["company"] : ["department"],
  }))
}

function buildRecommendations(detected: DetectedIndustry, answers: DiscoveryAnswers): DiscoveryRecommendations {
  const goals = splitList(answers.business_goals)
  const challengeSignals = splitList(answers.challenges).map((item) => item.toLowerCase())

  const riskFocus = challengeSignals.some((signal) => signal.includes("churn") || signal.includes("retention"))
  const costFocus = challengeSignals.some((signal) => signal.includes("cost") || signal.includes("margin"))

  const dashboards = unique([
    ...detected.suggestedDashboards,
    riskFocus ? "Executive Risk Board" : "Executive Decision Board",
    costFocus ? "Margin Control Dashboard" : "Growth and Capacity Dashboard",
  ])

  const reports = unique([
    "Weekly Executive Briefing",
    "Monthly KPI Confidence Report",
    goals.length ? `Goal Progress Report: ${goals[0]}` : "Goal Progress Report",
    "Decision Velocity Report",
  ])

  const aiOperators = unique([
    "Executive Briefing Operator",
    "KPI Anomaly Operator",
    "Workflow Optimization Operator",
    riskFocus ? "Retention Risk Operator" : "Opportunity Prioritization Operator",
  ])

  const integrations = unique([...detected.suggestedIntegrations, ...splitList(answers.current_systems)]).slice(0, 8)

  const businessMemoryStructure = [
    "Signal lane: Revenue and Growth",
    "Signal lane: Operational Throughput",
    "Signal lane: Customer and Experience",
    "Signal lane: Risk and Compliance",
    "Decision memory: Executive decisions + outcomes",
  ]

  const roleBasedIntelligence = [
    "CEO: Strategic direction, confidence, and risk",
    "COO: Throughput, bottlenecks, and execution reliability",
    "CFO: Margin, cost drift, and forecast integrity",
    "Department leaders: Team-level priorities and blockers",
  ]

  const automationOpportunities = unique([
    "Auto-route high-risk signals to owner with evidence",
    "Trigger weekly executive briefing generation",
    "Escalate KPI threshold breaches with recommended actions",
    ...detected.suggestedWorkflows,
  ])

  return {
    dashboards,
    reports,
    aiOperators,
    integrations,
    businessMemoryStructure,
    roleBasedIntelligence,
    automationOpportunities,
  }
}

function confidenceForCompletion(completion: number): number {
  if (completion >= 90) {
    return 93
  }
  if (completion >= 75) {
    return 84
  }
  if (completion >= 50) {
    return 72
  }
  return 62
}

export function getDiscoveryQuestions(): ReadonlyArray<DiscoveryQuestion> {
  return QUESTION_BANK
}

export function getNextQuestionId(answers: DiscoveryAnswers, history: ReadonlyArray<string>): string | undefined {
  const visited = new Set(history)

  for (const question of QUESTION_BANK) {
    if (visited.has(question.id)) {
      continue
    }
    if (typeof question.condition === "function" && !question.condition(answers)) {
      continue
    }

    return question.id
  }

  return undefined
}

export function getQuestionById(id: string): DiscoveryQuestion | undefined {
  return QUESTION_BANK.find((question) => question.id === id)
}

export function analyzeDiscovery(answers: DiscoveryAnswers): DiscoveryAnalysis {
  const detected = detectIndustry(answers)
  const completionPercent = Math.round(
    (REQUIRED_QUESTION_IDS.filter((id) => Boolean(answers[id]?.trim())).length / REQUIRED_QUESTION_IDS.length) * 100,
  )

  const missingInformation = REQUIRED_QUESTION_IDS
    .filter((id) => !answers[id]?.trim())
    .map((id) => getQuestionById(id)?.topic ?? id)

  const conflicts: string[] = []
  const employeeCount = normalizeEmployeeCount(answers.employee_count)
  const departments = splitList(answers.departments)
  const locations = splitList(answers.locations)

  if (employeeCount <= 40 && departments.length >= 7) {
    conflicts.push("Department count appears high for the current employee range. Verify organization structure.")
  }

  if (hasWord(answers.customers_markets, ["global", "international", "multi-country"]) && locations.length <= 1) {
    conflicts.push("Markets indicate global reach but only one operating location is captured.")
  }

  if (hasWord(answers.revenue_model, ["subscription", "saas"]) && !hasWord(answers.kpis, ["churn", "retention", "nrr"])) {
    conflicts.push("Subscription model detected without retention KPIs. Add churn/NRR coverage.")
  }

  const suggestions: string[] = []
  if (!answers.current_systems) {
    suggestions.push("List your current systems so AIOS can prioritize integration sequencing.")
  }
  if (!answers.kpis) {
    suggestions.push("Add at least 3 executive KPIs to strengthen confidence scoring.")
  }
  if (!answers.operational_processes) {
    suggestions.push("Capture core operational processes to unlock workflow recommendations.")
  }

  const engine = createBusinessBlueprintEngine()
  const blueprint = engine.create({
    actorId: "discovery-agent",
    templateId: detected.templateId,
    organizationName: answers.company_name?.trim() || "New Organization",
    industry: detected.industry,
    country: locations[0] ?? "Unknown",
    legalStructure: "Private",
  })

  const offers = splitList(answers.products_services)
  const markets = splitList(answers.customers_markets)
  const systems = inferSystems(splitList(answers.current_systems))
  const processes = inferProcesses(splitList(answers.operational_processes))
  const roles = inferRoles(answers.decision_makers ?? "", answers.reporting_structure ?? "")
  const kpis = inferKpis(splitList(answers.kpis), detected.suggestedKpis)
  const goals = inferGoals(splitList(answers.business_goals), detected.suggestedKpis)
  const recommendations = buildRecommendations(detected, answers)

  const updatedBlueprint = engine.update(blueprint.id, {
    actorId: "discovery-agent",
    changeSummary: "Adaptive discovery interview synthesis",
    patch: {
      organization: {
        ...blueprint.organization,
        status: completionPercent >= 70 ? "complete" : "in-progress",
        confidence: {
          ...blueprint.organization.confidence,
          score: confidenceForCompletion(completionPercent),
          source: "adaptive-discovery-interview",
          lastUpdated: new Date().toISOString(),
          pendingQuestions: missingInformation,
          missingInformation,
        },
        data: {
          ...blueprint.organization.data,
          name: answers.company_name?.trim() || blueprint.organization.data.name,
          industry: detected.industry,
          subIndustry: detected.subIndustry,
          employeeCount,
          locations: locations.length ? mapLocations(locations) : blueprint.organization.data.locations,
          departments: departments.length ? mapDepartments(departments) : blueprint.organization.data.departments,
          teams: departments.length
            ? departments.map((name, index) => ({
                id: `team-${index + 1}`,
                name: `${name} Team`,
                departmentId: `dept-${index + 1}`,
                responsibilities: ["Execution", "Collaboration"],
              }))
            : blueprint.organization.data.teams,
          businessUnits: markets.length
            ? [{ id: "bu-1", name: "Core Business", ownerRole: "CEO", markets }]
            : blueprint.organization.data.businessUnits,
        },
      },
      businessModel: {
        ...blueprint.businessModel,
        confidence: {
          ...blueprint.businessModel.confidence,
          score: confidenceForCompletion(completionPercent),
          source: "adaptive-discovery-interview",
          lastUpdated: new Date().toISOString(),
          pendingQuestions: missingInformation,
          missingInformation,
        },
        data: {
          ...blueprint.businessModel.data,
          revenueStreams: inferRevenueStreams(answers.revenue_model ?? "", offers),
          products: offers.map((offer, index) => ({ id: `prod-${index + 1}`, name: offer, category: detected.subIndustry })),
          services: offers
            .filter((offer) => hasWord(offer, ["service", "support", "consult", "advisory"]))
            .map((offer, index) => ({ id: `svc-${index + 1}`, name: offer, category: "Services" })),
          markets: markets.length ? markets : blueprint.businessModel.data.markets,
        },
      },
      operations: {
        ...blueprint.operations,
        confidence: {
          ...blueprint.operations.confidence,
          score: confidenceForCompletion(completionPercent),
          source: "adaptive-discovery-interview",
          lastUpdated: new Date().toISOString(),
          pendingQuestions: missingInformation,
          missingInformation,
        },
        data: {
          ...blueprint.operations.data,
          processes: processes.length ? processes : blueprint.operations.data.processes,
          policies: splitList(answers.compliance_requirements).map((name, index) => ({
            id: `policy-${index + 1}`,
            name,
            scope: "organization",
            ownerRole: "Compliance",
          })),
        },
      },
      finance: {
        ...blueprint.finance,
        confidence: {
          ...blueprint.finance.confidence,
          score: confidenceForCompletion(completionPercent),
          source: "adaptive-discovery-interview",
          lastUpdated: new Date().toISOString(),
          pendingQuestions: missingInformation,
          missingInformation,
        },
        data: {
          ...blueprint.finance.data,
          revenueModel: answers.revenue_model || blueprint.finance.data.revenueModel,
          currencies: ["EUR"],
          financialKpiIds: kpis.slice(0, 4).map((kpi) => kpi.id),
        },
      },
      systems: {
        ...blueprint.systems,
        confidence: {
          ...blueprint.systems.confidence,
          score: confidenceForCompletion(completionPercent),
          source: "adaptive-discovery-interview",
          lastUpdated: new Date().toISOString(),
          pendingQuestions: missingInformation,
          missingInformation,
        },
        data: {
          ...blueprint.systems.data,
          connectedPlatforms: systems.length ? systems : blueprint.systems.data.connectedPlatforms,
        },
      },
      users: {
        ...blueprint.users,
        confidence: {
          ...blueprint.users.confidence,
          score: confidenceForCompletion(completionPercent),
          source: "adaptive-discovery-interview",
          lastUpdated: new Date().toISOString(),
          pendingQuestions: missingInformation,
          missingInformation,
        },
        data: {
          ...blueprint.users.data,
          roles,
          decisionMakerRoleIds: roles.slice(0, 3).map((role) => role.id),
        },
      },
      kpis: {
        ...blueprint.kpis,
        status: kpis.length >= 3 ? "complete" : "in-progress",
        confidence: {
          ...blueprint.kpis.confidence,
          score: confidenceForCompletion(completionPercent),
          source: "adaptive-discovery-interview",
          lastUpdated: new Date().toISOString(),
          pendingQuestions: missingInformation,
          missingInformation,
        },
        data: kpis,
      },
      goals: {
        ...blueprint.goals,
        status: goals.length >= 2 ? "complete" : "in-progress",
        confidence: {
          ...blueprint.goals.confidence,
          score: confidenceForCompletion(completionPercent),
          source: "adaptive-discovery-interview",
          lastUpdated: new Date().toISOString(),
          pendingQuestions: missingInformation,
          missingInformation,
        },
        data: goals,
      },
      businessMemory: {
        ...blueprint.businessMemory,
        data: recommendations.businessMemoryStructure.map((item, index) => ({
          id: `memory-seed-${index + 1}`,
          title: item,
          summary: `Generated from discovery context: ${item}.`,
          sourceSection: "discovery",
          tags: ["discovery", "foundation"],
        })),
      },
      rbiInitialization: {
        ...blueprint.rbiInitialization,
        data: blueprint.rbiInitialization.data.slice(0, 4),
      },
    },
  })

  const validation = engine.validate(updatedBlueprint.id)

  const businessSummary = [
    `${updatedBlueprint.organization.data.name} operates in ${detected.subIndustry}.`,
    `Business model appears to be ${detected.businessModel.toLowerCase()}.`,
    `Primary goals include ${goals.slice(0, 2).map((goal) => goal.title).join(" and ") || "building a clear operating baseline"}.`,
    `AIOS confidence is ${detected.confidence}% with ${missingInformation.length} remaining discovery gaps.`,
  ].join(" ")

  return {
    detectedIndustry: detected,
    missingInformation,
    conflicts,
    suggestions,
    businessSummary,
    completionPercent,
    blueprint: updatedBlueprint,
    validation,
    recommendations,
  }
}
