import type {
  BusinessEntityType,
  EntityInspectorModel,
  KnowledgeGraphEdge,
  KnowledgeGraphFilters,
  KnowledgeGraphNode,
  KnowledgeGraphState,
  KnowledgeTimelineEvent,
} from "@/types"

const defaultFilters: KnowledgeGraphFilters = {
  entityTypes: [],
  departments: [],
  businessUnits: [],
  statuses: [],
  priorities: [],
  owners: [],
  confidenceMin: 0,
}

function node(input: Omit<KnowledgeGraphNode, "radius"> & { radius?: number }): KnowledgeGraphNode {
  return {
    ...input,
    radius: input.radius ?? 26,
  }
}

export function createKnowledgeGraphDefaults(): KnowledgeGraphState {
  const nodes: KnowledgeGraphNode[] = [
    node({ id: "company-northwind", label: "Northwind Health", type: "company", department: "executive", businessUnit: "Enterprise Accounts", owner: "CRO", status: "active", priority: "critical", confidence: 93, summary: "Strategic enterprise customer connected to expansion, support, and workflow activity.", metadata: { industry: "Healthcare", arr: "€2.4M", region: "North America" }, x: 420, y: 220, radius: 34 }),
    node({ id: "deal-expansion", label: "Expansion Deal", type: "deal", department: "sales", businessUnit: "Revenue", owner: "VP Revenue", status: "active", priority: "high", confidence: 88, summary: "Expansion opportunity linked to executive outreach and product usage signals.", metadata: { stage: "Negotiation", value: "€640k" }, x: 640, y: 190 }),
    node({ id: "workflow-support-recovery", label: "Support Recovery Workflow", type: "workflow", department: "operations", businessUnit: "Automation", owner: "Operations Lead", status: "monitoring", priority: "high", confidence: 82, summary: "Workflow coordinating escalations, task creation, and account response actions.", metadata: { runs: 42, version: "v3.1" }, x: 610, y: 360 }),
    node({ id: "agent-retention", label: "Retention Agent", type: "agent", department: "support", businessUnit: "Agent Ops", owner: "AIOS", status: "active", priority: "high", confidence: 86, summary: "Agent responsible for retention analysis and escalation coordination.", metadata: { status: "running", tasks: 6 }, x: 360, y: 390 }),
    node({ id: "memory-escalation", label: "Escalation Memory", type: "memory-node", department: "knowledge", businessUnit: "Memory", owner: "Memory Layer", status: "active", priority: "medium", confidence: 79, summary: "Persistent memory node tracking escalation history and renewal sensitivity.", metadata: { lane: "long-term", updates: 18 }, x: 235, y: 280 }),
    node({ id: "event-runtime", label: "Runtime Event Stream", type: "event", department: "platform", businessUnit: "Runtime", owner: "Runtime Engine", status: "active", priority: "high", confidence: 90, summary: "Execution and queue activity feeding the semantic graph.", metadata: { queueDepth: 12, events: 1420 }, x: 230, y: 120 }),
    node({ id: "doc-retention-playbook", label: "Retention Playbook", type: "knowledge-document", department: "knowledge", businessUnit: "Knowledge", owner: "Knowledge Ops", status: "active", priority: "medium", confidence: 81, summary: "Knowledge source supporting decisions, workflows, and policy-aware reasoning.", metadata: { version: "2026.07", references: 24 }, x: 430, y: 60 }),
    node({ id: "policy-revenue-threshold", label: "Revenue Threshold Policy", type: "policy", department: "finance", businessUnit: "Governance", owner: "Compliance", status: "active", priority: "medium", confidence: 77, summary: "Policy governing executive approval thresholds for revenue-impacting actions.", metadata: { threshold: "€250k", framework: "SOC 2" }, x: 760, y: 95 }),
    node({ id: "goal-retention", label: "Retention Goal", type: "goal", department: "executive", businessUnit: "Strategy", owner: "COO", status: "active", priority: "critical", confidence: 84, summary: "Strategic goal linked to support recovery and customer health outcomes.", metadata: { target: "96% retention" }, x: 760, y: 295 }),
    node({ id: "project-onboarding", label: "Onboarding Project", type: "project", department: "operations", businessUnit: "Delivery", owner: "Program Manager", status: "monitoring", priority: "medium", confidence: 73, summary: "Project linked to customer workflows, tasks, and product activation milestones.", metadata: { phase: "Execution", milestones: 8 }, x: 520, y: 500 }),
    node({ id: "task-exec-review", label: "Executive Review Task", type: "task", department: "executive", businessUnit: "Task Ops", owner: "Chief Revenue Officer", status: "active", priority: "high", confidence: 80, summary: "Open action created by workflow and linked to decision and meeting context.", metadata: { due: "Today", assignee: "CRO" }, x: 760, y: 470 }),
    node({ id: "meeting-qbr", label: "QBR Meeting", type: "meeting", department: "sales", businessUnit: "Revenue", owner: "Account Team", status: "completed", priority: "medium", confidence: 71, summary: "Meeting connected to opportunity, contact, and executive planning context.", metadata: { date: "2026-07-08", attendees: 6 }, x: 540, y: 120 }),
  ]

  const edges: KnowledgeGraphEdge[] = [
    { id: "edge-company-deal", source: "company-northwind", target: "deal-expansion", label: "linked to deal", strength: 92, category: "direct", animated: true },
    { id: "edge-company-workflow", source: "company-northwind", target: "workflow-support-recovery", label: "owns workflow context", strength: 84, category: "workflow-dependency", animated: true },
    { id: "edge-agent-workflow", source: "agent-retention", target: "workflow-support-recovery", label: "executes", strength: 88, category: "direct", animated: true },
    { id: "edge-workflow-task", source: "workflow-support-recovery", target: "task-exec-review", label: "creates task", strength: 83, category: "workflow-dependency", animated: true },
    { id: "edge-memory-event", source: "memory-escalation", target: "event-runtime", label: "references event", strength: 74, category: "knowledge-dependency", animated: true },
    { id: "edge-doc-decision", source: "doc-retention-playbook", target: "workflow-support-recovery", label: "supports workflow", strength: 77, category: "knowledge-dependency", animated: false },
    { id: "edge-policy-deal", source: "policy-revenue-threshold", target: "deal-expansion", label: "governs", strength: 79, category: "decision-influence", animated: false },
    { id: "edge-goal-company", source: "goal-retention", target: "company-northwind", label: "tracks outcome", strength: 71, category: "indirect", animated: false },
    { id: "edge-project-workflow", source: "project-onboarding", target: "workflow-support-recovery", label: "depends on", strength: 68, category: "dependency", animated: true },
    { id: "edge-meeting-deal", source: "meeting-qbr", target: "deal-expansion", label: "influences opportunity", strength: 66, category: "decision-influence", animated: false },
    { id: "edge-company-memory", source: "company-northwind", target: "memory-escalation", label: "linked memory", strength: 82, category: "direct", animated: false },
    { id: "edge-goal-task", source: "goal-retention", target: "task-exec-review", label: "drives action", strength: 75, category: "indirect", animated: false },
  ]

  const timeline: KnowledgeTimelineEvent[] = [
    { id: "t1", entityId: "company-northwind", timestamp: Date.now() - 1000 * 60 * 54, type: "updated", title: "Company health updated", detail: "Customer health and expansion context refreshed from runtime and CRM signals." },
    { id: "t2", entityId: "workflow-support-recovery", timestamp: Date.now() - 1000 * 60 * 49, type: "executed", title: "Workflow executed", detail: "Support recovery workflow triggered after escalation threshold crossed." },
    { id: "t3", entityId: "memory-escalation", timestamp: Date.now() - 1000 * 60 * 44, type: "connected", title: "Memory linked", detail: "Escalation memory attached to company and event stream context." },
    { id: "t4", entityId: "deal-expansion", timestamp: Date.now() - 1000 * 60 * 39, type: "updated", title: "Deal reprioritized", detail: "Expansion opportunity linked to executive review task and meeting context." },
    { id: "t5", entityId: "task-exec-review", timestamp: Date.now() - 1000 * 60 * 26, type: "created", title: "Open action created", detail: "Executive review task created by workflow execution." },
    { id: "t6", entityId: "meeting-qbr", timestamp: Date.now() - 1000 * 60 * 12, type: "completed", title: "QBR completed", detail: "Meeting outcomes connected back to deal and goal nodes." },
  ]

  const inspectors: EntityInspectorModel[] = [
    {
      entityId: "company-northwind",
      metadata: [
        { label: "Type", value: "Company" },
        { label: "Business Unit", value: "Enterprise Accounts" },
        { label: "Owner", value: "CRO" },
        { label: "Status", value: "active" },
      ],
      relationships: [
        { id: "r1", label: "linked to deal", targetLabel: "Expansion Deal" },
        { id: "r2", label: "owns workflow context", targetLabel: "Support Recovery Workflow" },
        { id: "r3", label: "linked memory", targetLabel: "Escalation Memory" },
      ],
      linkedMemory: [
        { id: "m1", summary: "Renewal sensitivity and escalation notes retained in long-term memory.", timestamp: Date.now() - 1000 * 60 * 42 },
        { id: "m2", summary: "Champion engagement and expansion signals connected to deal priority.", timestamp: Date.now() - 1000 * 60 * 21 },
      ],
      recentActivity: [
        { id: "a1", title: "Support recovery workflow triggered", timestamp: Date.now() - 1000 * 60 * 49 },
        { id: "a2", title: "Executive review task opened", timestamp: Date.now() - 1000 * 60 * 26 },
      ],
      connectedWorkflows: ["Support Recovery Workflow"],
      responsibleAgents: ["Retention Agent", "Revenue Agent"],
      openActions: ["Executive Review Task", "Expansion outreach preparation"],
    },
    {
      entityId: "workflow-support-recovery",
      metadata: [
        { label: "Type", value: "Workflow" },
        { label: "Owner", value: "Operations Lead" },
        { label: "Version", value: "v3.1" },
        { label: "Runs", value: "42" },
      ],
      relationships: [
        { id: "r4", label: "executes", targetLabel: "Retention Agent" },
        { id: "r5", label: "creates task", targetLabel: "Executive Review Task" },
        { id: "r6", label: "depends on", targetLabel: "Onboarding Project" },
      ],
      linkedMemory: [
        { id: "m3", summary: "Workflow replay evidence and branch performance retained in memory.", timestamp: Date.now() - 1000 * 60 * 33 },
      ],
      recentActivity: [
        { id: "a3", title: "Workflow reroute reviewed", timestamp: Date.now() - 1000 * 60 * 18 },
      ],
      connectedWorkflows: ["Support Recovery Workflow"],
      responsibleAgents: ["Retention Agent"],
      openActions: ["Review approval branch efficiency"],
    },
  ]

  return {
    nodes,
    edges,
    timeline,
    inspectors,
    selectedNodeId: "company-northwind",
    search: { query: "", matchedNodeIds: [] },
    filters: defaultFilters,
    liveMode: true,
  }
}

export function filterKnowledgeGraphNodes(nodes: KnowledgeGraphNode[], filters: KnowledgeGraphFilters, matchedNodeIds: string[]) {
  return nodes.filter((node) => {
    if (filters.entityTypes.length > 0 && !filters.entityTypes.includes(node.type)) return false
    if (filters.departments.length > 0 && !filters.departments.includes(node.department)) return false
    if (filters.businessUnits.length > 0 && !filters.businessUnits.includes(node.businessUnit)) return false
    if (filters.statuses.length > 0 && !filters.statuses.includes(node.status)) return false
    if (filters.priorities.length > 0 && !filters.priorities.includes(node.priority)) return false
    if (filters.owners.length > 0 && !filters.owners.includes(node.owner)) return false
    if (node.confidence < filters.confidenceMin) return false
    if (matchedNodeIds.length > 0 && !matchedNodeIds.includes(node.id)) return false
    return true
  })
}

export function searchKnowledgeGraph(nodes: KnowledgeGraphNode[], query: string) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return { query, matchedNodeIds: [] }
  }

  const matchedNodeIds = nodes
    .filter((node) => `${node.label} ${node.summary} ${node.owner} ${node.type} ${node.businessUnit}`.toLowerCase().includes(normalized))
    .map((node) => node.id)

  return { query, matchedNodeIds }
}

export function visibleKnowledgeGraphEdges(edges: KnowledgeGraphEdge[], visibleNodeIds: string[]) {
  const visible = new Set(visibleNodeIds)
  return edges.filter((edge) => visible.has(edge.source) && visible.has(edge.target))
}

export function selectEntityInspector(inspectors: EntityInspectorModel[], entityId: string) {
  return inspectors.find((item) => item.entityId === entityId) ?? null
}

export function selectKnowledgeTimeline(timeline: KnowledgeTimelineEvent[], entityId: string) {
  return timeline.filter((item) => item.entityId === entityId).sort((left, right) => right.timestamp - left.timestamp)
}

export function graphPathForNodes(source: { x: number; y: number }, target: { x: number; y: number }) {
  const dx = target.x - source.x
  const controlOffset = Math.max(40, Math.abs(dx) * 0.28)
  return `M ${source.x} ${source.y} C ${source.x + controlOffset} ${source.y}, ${target.x - controlOffset} ${target.y}, ${target.x} ${target.y}`
}

export function entityTypeColor(type: BusinessEntityType) {
  switch (type) {
    case "company":
    case "deal":
      return "#1c82f2"
    case "workflow":
    case "task":
      return "#0f766e"
    case "agent":
    case "event":
      return "#7c3aed"
    case "knowledge-document":
    case "memory-node":
    case "policy":
      return "#ea580c"
    case "goal":
    case "kpi":
      return "#be123c"
    default:
      return "#334155"
  }
}