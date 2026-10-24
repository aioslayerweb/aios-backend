import { formatDemoEuro } from "@/lib/demo/currency"

export type DemoExecutiveRole = "CEO" | "CFO" | "Sales leader" | "Customer Success leader" | "Operations leader"

export const demoExecutiveRoles: DemoExecutiveRole[] = [
  "CEO",
  "CFO",
  "Sales leader",
  "Customer Success leader",
  "Operations leader",
]

export type DemoDepartmentSummary = {
  id: string
  focus: string
  kpi: string
  issue: string
  recommendation: string
  relatedDepartmentIds: string[]
  href: string
}

export const demoDepartmentSummaries: DemoDepartmentSummary[] = [
  {
    id: "sales",
    focus: "Pipeline acceleration",
    kpi: "€37.6M sample pipeline · 28% modeled win rate",
    issue: "Two sample deals have had no stage movement in 21 days.",
    recommendation: "Review proposal follow-ups before the next forecast cut.",
    relatedDepartmentIds: ["marketing", "customers", "finance"],
    href: "/demo-platform/sales-intelligence",
  },
  {
    id: "marketing",
    focus: "Demand quality",
    kpi: "1,840 sample leads · 14% modeled sales acceptance",
    issue: "Lead acceptance is below the synthetic quarterly target.",
    recommendation: "Compare campaign cohorts with accepted-lead signals.",
    relatedDepartmentIds: ["sales"],
    href: "/demo-platform/intelligence",
  },
  {
    id: "customers",
    focus: "Retention risk",
    kpi: "642 sample customers · 23 modeled high-risk accounts",
    issue: "Renewal timing and support signals merit a human review.",
    recommendation: "Prioritize upcoming renewals with multiple risk indicators.",
    relatedDepartmentIds: ["sales", "product"],
    href: "/demo-platform/customer-intelligence",
  },
  {
    id: "finance",
    focus: "Margin guardrails",
    kpi: "€24.8M sample YTD revenue · 18.6% modeled growth",
    issue: "A sample forecast variance is approaching its review threshold.",
    recommendation: "Review actual-versus-target movement before reallocating spend.",
    relatedDepartmentIds: ["sales", "operations"],
    href: "/demo-platform/finance-intelligence",
  },
  {
    id: "operations",
    focus: "Throughput stability",
    kpi: "94% sample on-time completion · 3 modeled bottlenecks",
    issue: "Three synthetic workflows show repeated manual handoffs.",
    recommendation: "Inspect the highest-volume handoff before simulating a change.",
    relatedDepartmentIds: ["finance"],
    href: "/demo-platform/workflows",
  },
  {
    id: "product",
    focus: "Roadmap confidence",
    kpi: "76% sample feature adoption · 18 open feedback themes",
    issue: "Two synthetic feedback themes are increasing in frequency.",
    recommendation: "Connect customer feedback to the next roadmap review.",
    relatedDepartmentIds: ["customers"],
    href: "/demo-platform/blueprint",
  },
]

export type DemoAssistantContext = {
  revenueEur: number
  pipelineEur: number
  activeCustomers: number
  atRiskCustomers: number
  selectedDepartment: string
  selectedDepartmentFocus: string
}

export type DemoAssistantAnswer = {
  summary: string
  evidence: string
  href: string
  linkLabel: string
}

export function answerDemoQuestion(question: string, context: DemoAssistantContext): DemoAssistantAnswer {
  const normalized = question.trim().toLowerCase()

  if (!normalized) {
    return {
      summary: "Choose a suggested question or ask about sample revenue, pipeline, customer risk, or department priorities.",
      evidence: "This deterministic demo assistant only uses the synthetic values shown on this page.",
      href: "/demo-platform",
      linkLabel: "Return to overview",
    }
  }

  if (normalized.includes("risk") || normalized.includes("churn") || normalized.includes("retention")) {
    return {
      summary: `The sample view includes ${context.atRiskCustomers} accounts flagged for review. Risk scores are prioritization indices, not calibrated churn probabilities.`,
      evidence: "The illustrative factors are renewal timing and support signals; confirm them with a human before taking action.",
      href: "/demo-platform/customer-intelligence",
      linkLabel: "Open customer intelligence",
    }
  }

  if (normalized.includes("pipeline") || normalized.includes("opportunit") || normalized.includes("deal") || normalized.includes("bottleneck")) {
    return {
      summary: `The synthetic pipeline is ${formatDemoEuro(context.pipelineEur, true)}. The displayed stage bars are sample aggregates, not a forecast guarantee.`,
      evidence: "Use stage and close-date review to locate possible stalls; probability-weighted values are estimates.",
      href: "/demo-platform/sales-intelligence",
      linkLabel: "Open sales intelligence",
    }
  }

  if (normalized.includes("revenue") || normalized.includes("month") || normalized.includes("financial")) {
    return {
      summary: `Sample YTD revenue is ${formatDemoEuro(context.revenueEur, true)}.`,
      evidence: "This synthetic example shows an 18.6% comparison with its sample prior-year baseline; it does not represent live company performance.",
      href: "/demo-platform/finance-intelligence",
      linkLabel: "Open finance intelligence",
    }
  }

  if (normalized.includes("department") || normalized.includes("priority") || normalized.includes("priorit")) {
    const selected = context.selectedDepartment || "Company-wide"
    return {
      summary: `${selected} is currently selected, focused on ${context.selectedDepartmentFocus}. The dashboard's role selector changes the ordering of synthetic priorities only.`,
      evidence: `Across the sample view there are ${context.activeCustomers} active customers and ${context.atRiskCustomers} accounts flagged for review.`,
      href: "/demo-platform/executive",
      linkLabel: "Review executive overview",
    }
  }

  if (normalized.includes("agent") || normalized.includes("action") || normalized.includes("recent")) {
    return {
      summary: "The activity panel lists deterministic sample events and clearly labels previews; none represents a production action.",
      evidence: "Proposed, reviewed, simulated, and completed states are kept distinct in this demo.",
      href: "/demo-platform/activity",
      linkLabel: "Open sample activity",
    }
  }

  return {
    summary: "I can summarize the synthetic revenue, pipeline, customer-risk, department, and activity information shown in this demo.",
    evidence: "No prompt is sent to a model or backend. Try asking about pipeline bottlenecks, customer risk, revenue, or department priorities.",
    href: "/demo-platform",
    linkLabel: "Return to overview",
  }
}
