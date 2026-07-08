import type {
  PromptAssignedAgent,
  PromptDomain,
  PromptInterpretation,
  PromptPlanStep,
  PromptPriority,
  PromptReasoningItem,
  PromptResult,
  PromptSuggestion,
  PromptTemplate,
  PromptTimelineItem,
} from "@/types"

const templateCatalog: PromptTemplate[] = [
  {
    id: "tpl-executive-briefing",
    name: "Executive Briefing",
    description: "Prepare tomorrow's executive briefing with risks and opportunities.",
    content: "Prepare tomorrow's executive briefing with key risks, opportunities, and required actions.",
    domain: "executive",
  },
  {
    id: "tpl-sales-review",
    name: "Sales Review",
    description: "Review today's sales activity and pipeline changes.",
    content: "Review today's sales activity, major pipeline changes, and opportunities requiring attention.",
    domain: "sales",
  },
  {
    id: "tpl-customer-health",
    name: "Customer Health Check",
    description: "Find customers likely to churn and suggest interventions.",
    content: "Find every customer likely to churn and recommend the best intervention by urgency.",
    domain: "customer",
  },
  {
    id: "tpl-risk-assessment",
    name: "Risk Assessment",
    description: "Assess operational and financial risks this week.",
    content: "Assess this week's operational and financial risks with confidence and mitigation actions.",
    domain: "finance",
  },
  {
    id: "tpl-pipeline-summary",
    name: "Pipeline Summary",
    description: "Summarize current pipeline momentum and blockers.",
    content: "Summarize current sales pipeline momentum, blockers, and near-term conversion opportunities.",
    domain: "sales",
  },
  {
    id: "tpl-knowledge-summary",
    name: "Knowledge Summary",
    description: "Summarize newly imported knowledge and relevance.",
    content: "Summarize newly imported knowledge and identify which teams should act on it.",
    domain: "knowledge",
  },
  {
    id: "tpl-operational-review",
    name: "Operational Review",
    description: "Review today's operations and execution outcomes.",
    content: "Review today's operations, execution outcomes, and unresolved workflow issues.",
    domain: "operations",
  },
  {
    id: "tpl-financial-snapshot",
    name: "Financial Snapshot",
    description: "Generate a concise financial performance snapshot.",
    content: "Generate this week's financial snapshot with variance drivers and recommended actions.",
    domain: "finance",
  },
]

const planLabels = [
  "Understand request",
  "Retrieve memory",
  "Search knowledge",
  "Assign agents",
  "Validate",
  "Execute",
  "Store memory",
  "Report",
]

const timelineStages: PromptTimelineItem["stage"][] = [
  "Planning",
  "Searching",
  "Analyzing",
  "Executing",
  "Reviewing",
  "Completed",
]

function inferDomain(prompt: string): PromptDomain {
  const value = prompt.toLowerCase()

  if (value.includes("sales") || value.includes("pipeline") || value.includes("opportunity")) {
    return "sales"
  }

  if (value.includes("customer") || value.includes("churn")) {
    return "customer"
  }

  if (value.includes("risk") || value.includes("financial") || value.includes("finance")) {
    return "finance"
  }

  if (value.includes("knowledge") || value.includes("document")) {
    return "knowledge"
  }

  if (value.includes("operation") || value.includes("workflow") || value.includes("execution")) {
    return "operations"
  }

  if (value.includes("executive") || value.includes("brief")) {
    return "executive"
  }

  return "platform"
}

function inferPriority(prompt: string): PromptPriority {
  const value = prompt.toLowerCase()

  if (value.includes("urgent") || value.includes("critical")) {
    return "critical"
  }

  if (value.includes("risk") || value.includes("churn")) {
    return "high"
  }

  if (value.includes("review") || value.includes("analyze")) {
    return "medium"
  }

  return "low"
}

function inferIntent(prompt: string): string {
  const value = prompt.trim()
  if (!value) {
    return "No explicit intent detected"
  }

  if (value.endsWith(".")) {
    return value
  }

  return `${value}.`
}

export function buildInterpretation(prompt: string): PromptInterpretation {
  const domain = inferDomain(prompt)
  const priority = inferPriority(prompt)

  return {
    intent: inferIntent(prompt),
    confidence: clamp(76 + Math.round(Math.random() * 17), 65, 97),
    domain,
    priority,
    estimatedMinutes: clamp(6 + Math.round(Math.random() * 18), 4, 30),
    suggestedAgents:
      domain === "sales"
        ? ["Sales Agent", "Knowledge Agent", "Executive Agent"]
        : domain === "finance"
          ? ["Finance Agent", "Executive Agent", "Operations Agent"]
          : domain === "customer"
            ? ["Support Agent", "Sales Agent", "Knowledge Agent"]
            : domain === "operations"
              ? ["Operations Agent", "Executive Agent", "Knowledge Agent"]
              : ["Executive Agent", "Knowledge Agent", "Operations Agent"],
  }
}

export function createInitialPlan(): PromptPlanStep[] {
  const now = Date.now()
  return planLabels.map((label, index) => ({
    id: `plan-${index + 1}`,
    label,
    status: index === 0 ? "current" : "pending",
    timestamp: now - (planLabels.length - index) * 1000,
  }))
}

export function advancePlan(plan: PromptPlanStep[]): PromptPlanStep[] {
  const currentIndex = plan.findIndex((item) => item.status === "current")
  const nextIndex = currentIndex === -1 ? 0 : Math.min(plan.length - 1, currentIndex + 1)

  return plan.map((item, index) => {
    if (index < nextIndex) {
      return { ...item, status: "completed", timestamp: Date.now() - 200 }
    }

    if (index === nextIndex) {
      return { ...item, status: "current", timestamp: Date.now() }
    }

    return { ...item, status: "pending" }
  })
}

export function createInitialReasoning(): PromptReasoningItem[] {
  return [
    {
      id: "reasoning-1",
      title: "Intent identified",
      summary: "AIOS parsed objective scope and success criteria from the user intention.",
      timestamp: Date.now() - 1800,
    },
  ]
}

const reasoningCatalog = [
  "Memory loaded and relevant context selected.",
  "Knowledge sources searched for current business evidence.",
  "Execution strategy selected based on confidence and risk.",
  "Agent delegation completed with ownership boundaries.",
  "Validation checks passed for plan consistency.",
  "Outcome compiled into user-facing executive report.",
]

export function advanceReasoning(reasoning: PromptReasoningItem[]): PromptReasoningItem[] {
  const next = reasoningCatalog[Math.min(reasoning.length - 1, reasoningCatalog.length - 1)]

  if (!next || reasoning.some((item) => item.summary === next)) {
    return reasoning
  }

  return [
    {
      id: `reasoning-${Date.now()}`,
      title: "Reasoning update",
      summary: next,
      timestamp: Date.now(),
    },
    ...reasoning,
  ].slice(0, 8)
}

export function createPromptInitialAgents(domain: PromptDomain): PromptAssignedAgent[] {
  const seed: Record<PromptDomain, Array<{ id: string; name: string; task: string }>> = {
    executive: [
      { id: "executive-agent", name: "Executive Agent", task: "Building leadership narrative" },
      { id: "knowledge-agent", name: "Knowledge Agent", task: "Retrieving board references" },
      { id: "operations-agent", name: "Operations Agent", task: "Validating operational impact" },
    ],
    sales: [
      { id: "sales-agent", name: "Sales Agent", task: "Analyzing pipeline momentum" },
      { id: "knowledge-agent", name: "Knowledge Agent", task: "Linking market context" },
      { id: "executive-agent", name: "Executive Agent", task: "Preparing decision summary" },
    ],
    operations: [
      { id: "operations-agent", name: "Operations Agent", task: "Evaluating execution performance" },
      { id: "executive-agent", name: "Executive Agent", task: "Reviewing escalation impact" },
      { id: "knowledge-agent", name: "Knowledge Agent", task: "Validating process guidance" },
    ],
    customer: [
      { id: "support-agent", name: "Support Agent", task: "Scanning churn signals" },
      { id: "sales-agent", name: "Sales Agent", task: "Estimating retention opportunities" },
      { id: "knowledge-agent", name: "Knowledge Agent", task: "Retrieving playbook context" },
    ],
    finance: [
      { id: "finance-agent", name: "Finance Agent", task: "Analyzing variance and risk" },
      { id: "executive-agent", name: "Executive Agent", task: "Summarizing strategic impact" },
      { id: "operations-agent", name: "Operations Agent", task: "Cross-checking execution cost" },
    ],
    knowledge: [
      { id: "knowledge-agent", name: "Knowledge Agent", task: "Summarizing recent imports" },
      { id: "executive-agent", name: "Executive Agent", task: "Preparing relevance summary" },
      { id: "operations-agent", name: "Operations Agent", task: "Assigning follow-up actions" },
    ],
    platform: [
      { id: "executive-agent", name: "Executive Agent", task: "Structuring objective" },
      { id: "operations-agent", name: "Operations Agent", task: "Coordinating execution" },
      { id: "knowledge-agent", name: "Knowledge Agent", task: "Retrieving supporting context" },
    ],
  }

  return seed[domain].map((agent, index) => ({
    ...agent,
    status: index === 0 ? "running" : "idle",
    progress: index === 0 ? 18 : 0,
    confidence: 78 + index * 6,
  }))
}

export function advanceAgents(agents: PromptAssignedAgent[]): PromptAssignedAgent[] {
  return agents.map((agent, index) => {
    const nextProgress = clamp(agent.progress + (index === 0 ? 18 : 12), 0, 100)
    const status = nextProgress >= 100 ? "complete" : "running"

    return {
      ...agent,
      status,
      progress: nextProgress,
      confidence: clamp(agent.confidence + 1, 65, 98),
    }
  })
}

export function createInitialTimeline(): PromptTimelineItem[] {
  const now = Date.now()
  return timelineStages.map((stage, index) => ({
    id: `timeline-${index + 1}`,
    stage,
    status: index === 0 ? "current" : "pending",
    timestamp: now - index * 250,
  }))
}

export function advanceTimeline(timeline: PromptTimelineItem[]): PromptTimelineItem[] {
  const currentIndex = timeline.findIndex((item) => item.status === "current")
  const nextIndex = currentIndex === -1 ? 0 : Math.min(timeline.length - 1, currentIndex + 1)

  return timeline.map((item, index) => {
    if (index < nextIndex) {
      return { ...item, status: "completed", timestamp: Date.now() }
    }

    if (index === nextIndex) {
      return { ...item, status: "current", timestamp: Date.now() }
    }

    return { ...item, status: "pending" }
  })
}

export function buildResult(prompt: string, interpretation: PromptInterpretation): PromptResult {
  return {
    executiveSummary: `AIOS completed objective: ${prompt}. Priority ${interpretation.priority} with ${interpretation.confidence}% confidence.`,
    actionsTaken: [
      "Parsed objective and execution scope",
      "Retrieved memory and knowledge references",
      "Delegated tasks to domain agents",
      "Validated outcomes and generated report",
    ],
    recommendations: [
      "Review highlighted risks before scheduling execution",
      "Assign owner for the top two opportunities",
      "Schedule follow-up prompt for deeper analysis",
    ],
    risks: [
      "Confidence drops if source freshness falls",
      "Cross-team dependencies may delay execution",
    ],
    opportunities: [
      "Immediate opportunity acceleration in high-confidence segments",
      "Automation expansion across repeated manual steps",
    ],
    linkedMemory: [
      "Session context updated with execution summary",
      "Long-term memory tagged for retrieval",
    ],
    relatedKnowledge: [
      "Operational playbook references attached",
      "Policy constraints captured for next execution",
    ],
    futureActions: [
      "Generate report",
      "Create follow-up tasks",
      "Assign additional agent oversight",
    ],
  }
}

export function createFollowUps(): PromptSuggestion[] {
  return [
    { id: "follow-1", label: "Continue analysis" },
    { id: "follow-2", label: "Generate report" },
    { id: "follow-3", label: "Create tasks" },
    { id: "follow-4", label: "Assign agent" },
    { id: "follow-5", label: "Export summary" },
    { id: "follow-6", label: "Store knowledge" },
  ]
}

export function promptTemplates(): PromptTemplate[] {
  return templateCatalog
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}
