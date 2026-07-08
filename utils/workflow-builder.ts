import type {
  WorkflowAgentId,
  WorkflowBuilderState,
  WorkflowDefinition,
  WorkflowEdge,
  WorkflowExecutionStep,
  WorkflowNode,
  WorkflowNodeType,
  WorkflowTemplate,
} from "@/types"

const NODE_SIZE = { width: 220, height: 92 }

const AGENT_ASSIGNMENTS: Record<WorkflowNodeType, WorkflowAgentId[]> = {
  start: ["operations-agent"],
  end: ["operations-agent"],
  "ai-prompt": ["executive-agent", "knowledge-agent"],
  decision: ["executive-agent"],
  condition: ["operations-agent"],
  "memory-read": ["knowledge-agent"],
  "memory-write": ["knowledge-agent"],
  "knowledge-search": ["knowledge-agent"],
  "customer-lookup": ["sales-agent", "support-agent"],
  "crm-update": ["sales-agent"],
  email: ["support-agent"],
  slack: ["operations-agent"],
  calendar: ["operations-agent"],
  approval: ["executive-agent"],
  delay: ["operations-agent"],
  loop: ["operations-agent"],
  "parallel-branch": ["operations-agent"],
  merge: ["operations-agent"],
  webhook: ["operations-agent"],
  "api-call": ["operations-agent"],
  "custom-action": ["marketing-agent"],
}

const NODE_TITLES: Record<WorkflowNodeType, string> = {
  start: "Start",
  end: "End",
  "ai-prompt": "AI Prompt",
  decision: "Decision",
  condition: "Condition",
  "memory-read": "Memory Read",
  "memory-write": "Memory Write",
  "knowledge-search": "Knowledge Search",
  "customer-lookup": "Customer Lookup",
  "crm-update": "CRM Update",
  email: "Email",
  slack: "Slack",
  calendar: "Calendar",
  approval: "Approval",
  delay: "Delay",
  loop: "Loop",
  "parallel-branch": "Parallel Branch",
  merge: "Merge",
  webhook: "Webhook",
  "api-call": "API Call",
  "custom-action": "Custom Action",
}

function baseNode(id: string, type: WorkflowNodeType, x: number, y: number): WorkflowNode {
  return {
    id,
    type,
    x,
    y,
    width: NODE_SIZE.width,
    height: NODE_SIZE.height,
    status: "idle",
    selected: false,
    data: {
      title: NODE_TITLES[type],
      description: `${NODE_TITLES[type]} step in autonomous workflow orchestration.`,
      inputs: ["context"],
      outputs: ["result"],
      configuration: {
        enabled: true,
      },
      conditions: type === "decision" ? ["yes", "no"] : [],
      assignedAgents: AGENT_ASSIGNMENTS[type],
      runtimeStatus: "Ready",
      loop:
        type === "loop"
          ? {
              repeat: true,
              retry: true,
              timeoutSeconds: 300,
              maxAttempts: 3,
            }
          : undefined,
      errorStrategy: "retry",
    },
  }
}

function linearEdges(nodes: WorkflowNode[]): WorkflowEdge[] {
  return nodes.slice(0, -1).map((node, index) => ({
    id: `edge-${nodes[index].id}-${nodes[index + 1].id}`,
    source: nodes[index].id,
    target: nodes[index + 1].id,
    animated: true,
    selected: false,
    condition: "default",
  }))
}

export function createWorkflowTemplates(): WorkflowTemplate[] {
  const templates: Array<Pick<WorkflowTemplate, "id" | "name" | "description" | "department" | "tags"> & { flow: WorkflowNodeType[] }> = [
    {
      id: "tpl-lead-qualification",
      name: "Lead Qualification",
      description: "Qualify inbound leads using memory, scoring, and CRM updates.",
      department: "sales",
      tags: ["sales", "crm", "qualification"],
      flow: ["start", "customer-lookup", "decision", "crm-update", "ai-prompt", "end"],
    },
    {
      id: "tpl-customer-onboarding",
      name: "Customer Onboarding",
      description: "Orchestrate onboarding kickoff, approvals, and reminders.",
      department: "operations",
      tags: ["operations", "onboarding"],
      flow: ["start", "ai-prompt", "approval", "calendar", "slack", "end"],
    },
    {
      id: "tpl-executive-briefing",
      name: "Executive Briefing",
      description: "Build executive briefing from memory and knowledge context.",
      department: "executive",
      tags: ["executive", "briefing"],
      flow: ["start", "memory-read", "knowledge-search", "ai-prompt", "decision", "end"],
    },
    {
      id: "tpl-sales-follow-up",
      name: "Sales Follow-up",
      description: "Automate prioritized follow-up orchestration.",
      department: "sales",
      tags: ["sales", "follow-up"],
      flow: ["start", "customer-lookup", "decision", "email", "crm-update", "end"],
    },
    {
      id: "tpl-meeting-preparation",
      name: "Meeting Preparation",
      description: "Prepare meetings with context packets and action lists.",
      department: "executive",
      tags: ["executive", "meetings"],
      flow: ["start", "memory-read", "knowledge-search", "calendar", "ai-prompt", "end"],
    },
    {
      id: "tpl-risk-monitoring",
      name: "Risk Monitoring",
      description: "Monitor and escalate high-risk signals.",
      department: "finance",
      tags: ["risk", "finance"],
      flow: ["start", "knowledge-search", "decision", "parallel-branch", "approval", "end"],
    },
    {
      id: "tpl-invoice-approval",
      name: "Invoice Approval",
      description: "Route invoices through condition checks and approval branches.",
      department: "finance",
      tags: ["finance", "approval"],
      flow: ["start", "condition", "approval", "api-call", "memory-write", "end"],
    },
    {
      id: "tpl-knowledge-import",
      name: "Knowledge Import",
      description: "Import, enrich, and store knowledge objects.",
      department: "knowledge",
      tags: ["knowledge", "import"],
      flow: ["start", "webhook", "knowledge-search", "memory-write", "end"],
    },
    {
      id: "tpl-customer-support",
      name: "Customer Support",
      description: "Run support triage with retries and escalation policies.",
      department: "support",
      tags: ["support", "escalation"],
      flow: ["start", "customer-lookup", "loop", "decision", "slack", "end"],
    },
    {
      id: "tpl-weekly-reports",
      name: "Weekly Reports",
      description: "Generate recurring weekly reports across departments.",
      department: "platform",
      tags: ["reports", "automation"],
      flow: ["start", "parallel-branch", "merge", "ai-prompt", "email", "end"],
    },
  ]

  return templates.map((template) => {
    const nodes = template.flow.map((type, index) =>
      baseNode(`${template.id}-node-${index + 1}`, type, 180 + index * 320, 220 + (index % 2 === 0 ? 0 : 120))
    )

    return {
      ...template,
      nodes,
      edges: linearEdges(nodes),
    }
  })
}

export function createInitialWorkflows(templates: WorkflowTemplate[]): WorkflowDefinition[] {
  const first = templates[0]
  const second = templates[2]

  const now = Date.now()

  return [
    {
      id: "wf-lead-qualification",
      name: "Lead Qualification Orchestration",
      description: "Autonomous workflow for qualification, routing, and CRM updates.",
      owner: "Revenue Operations",
      department: "sales",
      tags: ["lead", "revenue", "automation"],
      status: "draft",
      createdAt: now - 86400000 * 6,
      updatedAt: now - 600000,
      nodes: first.nodes,
      edges: first.edges,
      history: [
        { id: "h1", type: "created", timestamp: now - 86400000 * 6, actor: "AIOS", summary: "Workflow created from template." },
        { id: "h2", type: "edited", timestamp: now - 86400000 * 2, actor: "Revenue Ops", summary: "Added decision branch for qualification threshold." },
      ],
      versions: [
        { id: "v1", version: 1, status: "draft", timestamp: now - 86400000 * 6, note: "Initial draft" },
      ],
    },
    {
      id: "wf-executive-briefing",
      name: "Executive Briefing Runtime",
      description: "Generate executive-ready briefing with memory and knowledge traces.",
      owner: "Executive Office",
      department: "executive",
      tags: ["executive", "briefing", "memory"],
      status: "published",
      createdAt: now - 86400000 * 10,
      updatedAt: now - 86400000,
      nodes: second.nodes,
      edges: second.edges,
      history: [
        { id: "h3", type: "created", timestamp: now - 86400000 * 10, actor: "AIOS", summary: "Workflow created from template." },
        { id: "h4", type: "published", timestamp: now - 86400000, actor: "Executive Office", summary: "Published for weekly runtime execution." },
      ],
      versions: [
        { id: "v2", version: 1, status: "published", timestamp: now - 86400000, note: "Published baseline" },
      ],
    },
  ]
}

export function defaultWorkflowBuilderState(): WorkflowBuilderState {
  const templates = createWorkflowTemplates()
  const workflows = createInitialWorkflows(templates)

  return {
    workflows,
    selectedWorkflowId: workflows[0]?.id ?? "",
    selectedNodeId: workflows[0]?.nodes[0]?.id ?? null,
    selectedEdgeId: null,
    templates,
    canvas: {
      zoom: 1,
      panX: 0,
      panY: 0,
      snapToGrid: true,
      gridSize: 24,
    },
    execution: {
      running: false,
      activeNodeId: null,
      steps: workflows[0]
        ? workflows[0].nodes.map((node) => ({
            id: `exec-${node.id}`,
            nodeId: node.id,
            nodeTitle: node.data.title,
            status: "pending",
            assignedAgents: node.data.assignedAgents,
            estimatedSeconds: 30 + Math.round(Math.random() * 95),
          }))
        : [],
      timeline: [],
      estimatedDurationSeconds: 0,
    },
    filters: {
      query: "",
      departments: [],
      statuses: [],
      agents: [],
      owners: [],
      tags: [],
    },
  }
}

export function applyWorkflowFilters(workflows: WorkflowDefinition[], filters: WorkflowBuilderState["filters"]): WorkflowDefinition[] {
  const query = filters.query.trim().toLowerCase()

  return workflows.filter((workflow) => {
    if (query) {
      const blob = `${workflow.name} ${workflow.description} ${workflow.tags.join(" ")} ${workflow.owner}`.toLowerCase()
      if (!blob.includes(query)) {
        return false
      }
    }

    if (filters.departments.length > 0 && !filters.departments.includes(workflow.department)) {
      return false
    }

    if (filters.statuses.length > 0 && !filters.statuses.includes(workflow.status)) {
      return false
    }

    if (filters.owners.length > 0 && !filters.owners.includes(workflow.owner)) {
      return false
    }

    if (filters.tags.length > 0 && !filters.tags.some((tag) => workflow.tags.includes(tag))) {
      return false
    }

    if (filters.agents.length > 0) {
      const assigned = new Set(workflow.nodes.flatMap((node) => node.data.assignedAgents))
      if (!filters.agents.some((agent) => assigned.has(agent))) {
        return false
      }
    }

    return true
  })
}

export function buildExecutionSteps(nodes: WorkflowNode[]): WorkflowExecutionStep[] {
  return nodes.map((node) => ({
    id: `step-${node.id}`,
    nodeId: node.id,
    nodeTitle: node.data.title,
    status: "pending",
    assignedAgents: node.data.assignedAgents,
    estimatedSeconds: 25 + Math.round(Math.random() * 110),
  }))
}

export function snap(value: number, size: number): number {
  return Math.round(value / size) * size
}

export function edgePath(from: { x: number; y: number }, to: { x: number; y: number }): string {
  const dx = Math.abs(to.x - from.x)
  const c1x = from.x + Math.max(40, dx * 0.35)
  const c2x = to.x - Math.max(40, dx * 0.35)
  return `M ${from.x} ${from.y} C ${c1x} ${from.y}, ${c2x} ${to.y}, ${to.x} ${to.y}`
}
