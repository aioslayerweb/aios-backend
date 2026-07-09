import type { OrganizationRecord, TeamRecord, UserRecord, WorkspaceRecord } from "@/types"
import type {
  OrgDecisionPath,
  OrgGraphEdge,
  OrgGraphNode,
  OrgImpactSummary,
  OrgIntelligenceSnapshot,
  OrgObjective,
  OrgStructureItem,
  OrgTeamHealth,
  OrgTimelineEvent,
} from "@/types"

export function createOrganizationIntelligenceDefaults() {
  const organizations: OrganizationRecord[] = [
    { id: "org-1", name: "Northwind Health", branding: "Northwind Blue", subscription: "Enterprise Plus", region: "US-East", environment: "production", status: "active", owner: "Ava Chen" },
    { id: "org-2", name: "Helios Commerce", branding: "Helios Gold", subscription: "Enterprise", region: "EU-West", environment: "staging", status: "trial", owner: "Nina Park" },
  ]

  const workspaces: WorkspaceRecord[] = [
    { id: "ws-1", organizationId: "org-1", name: "Executive Workspace", key: "executive", users: 18, agents: 9, workflows: 14, status: "active" },
    { id: "ws-2", organizationId: "org-1", name: "Sales Workspace", key: "sales", users: 42, agents: 7, workflows: 11, status: "active" },
    { id: "ws-3", organizationId: "org-1", name: "Support Workspace", key: "support", users: 34, agents: 6, workflows: 13, status: "restricted" },
    { id: "ws-4", organizationId: "org-1", name: "Finance Workspace", key: "finance", users: 16, agents: 4, workflows: 8, status: "active" },
    { id: "ws-5", organizationId: "org-2", name: "Operations Workspace", key: "operations", users: 22, agents: 5, workflows: 9, status: "provisioning" },
  ]

  const users: UserRecord[] = [
    { id: "user-1", organizationId: "org-1", workspaceId: "ws-1", departmentId: "dept-executive", teamIds: ["team-1"], name: "Ava Chen", email: "ava@northwind.ai", department: "executive", roleId: "role-owner", status: "active", lastLogin: "4 min ago", assignedAgents: ["Executive Analyst", "Revenue Agent"], assignedWorkflows: ["Quarterly Board Pack", "Executive Outreach"], serviceAccount: false },
    { id: "user-2", organizationId: "org-1", workspaceId: "ws-3", departmentId: "dept-support", teamIds: ["team-3"], name: "Nina Park", email: "nina@northwind.ai", department: "support", roleId: "role-manager", status: "active", lastLogin: "19 min ago", assignedAgents: ["Retention Agent"], assignedWorkflows: ["Support Recovery Workflow"], serviceAccount: false },
    { id: "user-3", organizationId: "org-1", workspaceId: "ws-4", departmentId: "dept-finance", teamIds: ["team-4"], name: "Marco Silva", email: "marco@northwind.ai", department: "finance", roleId: "role-admin", status: "active", lastLogin: "1 hr ago", assignedAgents: ["Finance Review Agent"], assignedWorkflows: ["Finance Approval Flow"], serviceAccount: false },
    { id: "user-4", organizationId: "org-2", workspaceId: "ws-5", departmentId: "dept-operations", teamIds: ["team-5"], name: "Lena Ortiz", email: "lena@helios.ai", department: "operations", roleId: "role-operator", status: "invited", lastLogin: "Pending invite", assignedAgents: ["Operations Agent"], assignedWorkflows: ["Operational Readiness"], serviceAccount: false },
  ]

  const teamRecords: TeamRecord[] = [
    { id: "team-1", organizationId: "org-1", workspaceId: "ws-1", departmentId: "dept-executive", name: "Executive Leadership", members: 8, lead: "Ava Chen" },
    { id: "team-2", organizationId: "org-1", workspaceId: "ws-2", departmentId: "dept-sales", name: "Revenue Ops", members: 14, lead: "Jon Mercer" },
    { id: "team-3", organizationId: "org-1", workspaceId: "ws-3", departmentId: "dept-support", name: "Support Control", members: 12, lead: "Nina Park" },
    { id: "team-4", organizationId: "org-1", workspaceId: "ws-4", departmentId: "dept-finance", name: "Finance Governance", members: 7, lead: "Marco Silva" },
    { id: "team-5", organizationId: "org-2", workspaceId: "ws-5", departmentId: "dept-operations", name: "Operations Core", members: 5, lead: "Lena Ortiz" },
  ]

  const teams: OrgStructureItem[] = teamRecords.map((team) => ({
    id: team.id,
    label: team.name,
    type: "team",
    parentId: team.departmentId,
    owner: team.lead,
    summary: `${team.members} members operating from workspace ${team.workspaceId}.`,
  }))

  const employees: UserRecord[] = users

  const departments: OrgStructureItem[] = [
    { id: "dept-executive", label: "Executive", type: "department", parentId: "org-1", owner: "Ava Chen", summary: "Company direction, board decisions, and executive coordination." },
    { id: "dept-sales", label: "Sales", type: "department", parentId: "org-1", owner: "Jon Mercer", summary: "Pipeline execution, revenue operations, and deal progression." },
    { id: "dept-support", label: "Support", type: "department", parentId: "org-1", owner: "Nina Park", summary: "Escalation handling, customer recovery, and knowledge coverage." },
    { id: "dept-finance", label: "Finance", type: "department", parentId: "org-1", owner: "Marco Silva", summary: "Cash flow, approvals, controls, and forecasting." },
    { id: "dept-operations", label: "Operations", type: "department", parentId: "org-2", owner: "Lena Ortiz", summary: "Delivery execution, process health, and operational reliability." },
    { id: "dept-marketing", label: "Marketing", type: "department", parentId: "org-1", owner: "Priya Das", summary: "Demand generation, market signal, and campaign performance." },
    { id: "dept-people", label: "People", type: "department", parentId: "org-1", owner: "Maya Lopez", summary: "Capacity planning, org health, and hiring flow." },
    { id: "dept-technology", label: "Technology", type: "department", parentId: "org-1", owner: "Iris Stone", summary: "Infrastructure health, deployments, and engineering velocity." },
  ]

  const businessUnits: OrgStructureItem[] = [
    { id: "bu-enterprise", label: "Enterprise", type: "business-unit", parentId: "org-1", owner: "Ava Chen", summary: "Enterprise customers and executive operations." },
    { id: "bu-growth", label: "Growth", type: "business-unit", parentId: "org-1", owner: "Priya Das", summary: "Demand creation and revenue expansion." },
  ]

  const regions: OrgStructureItem[] = [
    { id: "region-na", label: "North America", type: "region", parentId: "org-1", owner: "Ava Chen", summary: "Primary revenue and support footprint." },
    { id: "region-eu", label: "Europe", type: "region", parentId: "org-2", owner: "Lena Ortiz", summary: "Expansion, localization, and compliance signal." },
  ]

  const squads: OrgStructureItem[] = [
    { id: "squad-board", label: "Board Readiness Squad", type: "squad", parentId: "dept-executive", owner: "Ava Chen", summary: "Prepares board materials, major decisions, and executive summaries." },
    { id: "squad-recovery", label: "Customer Recovery Squad", type: "squad", parentId: "dept-support", owner: "Nina Park", summary: "Handles high-value customer escalations." },
    { id: "squad-forecast", label: "Forecast Squad", type: "squad", parentId: "dept-finance", owner: "Marco Silva", summary: "Maintains forecast confidence and approval discipline." },
  ]

  const externalPartners: OrgStructureItem[] = [
    { id: "partner-1", label: "Cloud Analytics Partner", type: "external-partner", parentId: "org-1", owner: "Platform", summary: "Supports analytics and data exchange workflows." },
  ]

  const contractors: OrgStructureItem[] = [
    { id: "contractor-1", label: "Integration Contractor", type: "contractor", parentId: "dept-technology", owner: "Technology", summary: "Assists with infrastructure and integration work." },
  ]

  const customers: OrgStructureItem[] = [
    { id: "customer-1", label: "Northwind Health", type: "customer", parentId: "org-1", owner: "Ava Chen", summary: "Anchor account requiring executive visibility." },
    { id: "customer-2", label: "Helios Commerce", type: "customer", parentId: "org-2", owner: "Lena Ortiz", summary: "Expansion customer tracking operational health." },
  ]

  const vendors: OrgStructureItem[] = [
    { id: "vendor-1", label: "Security Systems Vendor", type: "vendor", parentId: "org-1", owner: "Marco Silva", summary: "Provides identity and compliance tooling." },
  ]

  const chartNodes: OrgGraphNode[] = [
    { id: "org-1", name: "Northwind Health", type: "organization", department: "executive", importance: 100 },
    { id: "dept-executive", name: "Executive", type: "department", department: "executive", importance: 95 },
    { id: "dept-sales", name: "Sales", type: "department", department: "sales", importance: 88 },
    { id: "dept-support", name: "Support", type: "department", department: "support", importance: 84 },
    { id: "dept-finance", name: "Finance", type: "department", department: "finance", importance: 90 },
    { id: "dept-technology", name: "Technology", type: "department", department: "platform", importance: 92 },
    { id: "dept-operations", name: "Operations", type: "department", department: "operations", importance: 89 },
    { id: "dept-marketing", name: "Marketing", type: "department", department: "marketing", importance: 80 },
    { id: "dept-people", name: "People", type: "department", department: "hr", importance: 78 },
    { id: "team-revenue", name: "Revenue Ops", type: "team", department: "sales", importance: 76 },
    { id: "team-support", name: "Support Control", type: "team", department: "support", importance: 74 },
    { id: "team-finance", name: "Finance Governance", type: "team", department: "finance", importance: 81 },
    { id: "team-exec", name: "Executive Leadership", type: "team", department: "executive", importance: 93 },
  ]

  const chartEdges: OrgGraphEdge[] = [
    { id: "edge-1", from: "org-1", to: "dept-executive", label: "governs", weight: 100 },
    { id: "edge-2", from: "dept-executive", to: "dept-sales", label: "coordinates", weight: 82 },
    { id: "edge-3", from: "dept-executive", to: "dept-support", label: "oversees", weight: 76 },
    { id: "edge-4", from: "dept-finance", to: "dept-operations", label: "approves", weight: 68 },
    { id: "edge-5", from: "dept-technology", to: "dept-support", label: "enables", weight: 64 },
    { id: "edge-6", from: "dept-sales", to: "dept-marketing", label: "shares pipeline", weight: 71 },
    { id: "edge-7", from: "dept-support", to: "dept-people", label: "shares capacity", weight: 58 },
    { id: "edge-8", from: "dept-operations", to: "dept-finance", label: "reports", weight: 64 },
  ]

  const teamHealth: OrgTeamHealth[] = [
    { id: "health-exec", name: "Executive Leadership", department: "executive", workload: 74, capacity: 88, velocity: 81, taskCompletion: 92, openRisks: 2, dependencies: 3, knowledgeCoverage: 90, aiAdoption: 88 },
    { id: "health-sales", name: "Revenue Ops", department: "sales", workload: 82, capacity: 78, velocity: 76, taskCompletion: 84, openRisks: 4, dependencies: 5, knowledgeCoverage: 83, aiAdoption: 84 },
    { id: "health-support", name: "Support Control", department: "support", workload: 88, capacity: 73, velocity: 71, taskCompletion: 79, openRisks: 5, dependencies: 6, knowledgeCoverage: 76, aiAdoption: 82 },
    { id: "health-finance", name: "Finance Governance", department: "finance", workload: 65, capacity: 91, velocity: 85, taskCompletion: 94, openRisks: 1, dependencies: 2, knowledgeCoverage: 88, aiAdoption: 80 },
    { id: "health-operations", name: "Operations", department: "operations", workload: 87, capacity: 69, velocity: 68, taskCompletion: 77, openRisks: 6, dependencies: 7, knowledgeCoverage: 74, aiAdoption: 79 },
  ]

  const objectives: OrgObjective[] = [
    { id: "obj-company", title: "Company health and growth", level: "company", owner: "Executive Leadership", linkedKpis: ["Revenue", "Retention", "Uptime"], linkedWorkflows: ["Board pack refresh", "Forecast review"], linkedInitiatives: ["Quarterly planning", "Growth operating rhythm"], progress: 72 },
    { id: "obj-sales", title: "Pipeline conversion", level: "department", owner: "Revenue Ops", linkedKpis: ["Pipeline coverage", "Forecast confidence"], linkedWorkflows: ["Deal escalation", "Forecast refresh"], linkedInitiatives: ["Rep coaching", "Opportunity recovery"], progress: 68 },
    { id: "obj-support", title: "SLA recovery", level: "department", owner: "Support Control", linkedKpis: ["SLA health", "Customer satisfaction"], linkedWorkflows: ["Escalation review", "Knowledge refresh"], linkedInitiatives: ["Escalation triage", "Knowledge coverage"], progress: 61 },
    { id: "obj-finance", title: "Cash discipline", level: "department", owner: "Finance Governance", linkedKpis: ["Cash flow", "Approval rate"], linkedWorkflows: ["Budget approval", "Quarterly forecast"], linkedInitiatives: ["Spend controls", "Budget review"], progress: 81 },
    { id: "obj-tech", title: "Platform reliability", level: "department", owner: "Technology", linkedKpis: ["System health", "Deployment velocity"], linkedWorkflows: ["System health check", "Release review"], linkedInitiatives: ["Incident reduction", "Engineering velocity"], progress: 76 },
  ]

  const decisionPaths: OrgDecisionPath[] = [
    { id: "dec-1", title: "Executive investment approval", owner: "CEO", approvers: ["CFO", "COO"], escalationPath: ["Board", "Executive Team"], blocked: false },
    { id: "dec-2", title: "Support escalation threshold", owner: "Support Manager", approvers: ["Customer Success", "Operations"], escalationPath: ["COO", "Executive Leadership"], blocked: true },
    { id: "dec-3", title: "Infrastructure rollout", owner: "CTO", approvers: ["Finance", "Operations"], escalationPath: ["Executive Team"], blocked: false },
  ]

  const timeline: OrgTimelineEvent[] = [
    { id: "timeline-1", date: "Today", title: "Support team rebalanced", detail: "Workload shifted toward the highest-risk escalations.", impact: "Reduced SLA risk" },
    { id: "timeline-2", date: "Yesterday", title: "Finance approval process tightened", detail: "Approval routing was updated for larger spend items.", impact: "Improved cash control" },
    { id: "timeline-3", date: "This week", title: "Executive review scheduled", detail: "Board summary and strategic risk narrative prepared.", impact: "Stronger decision flow" },
  ]

  return {
    organizations,
    workspaces,
    users,
    teams,
    departments,
    businessUnits,
    regions,
    squads,
    employees,
    externalPartners,
    contractors,
    customers,
    vendors,
    chartNodes,
    chartEdges,
    teamHealth,
    objectives,
    decisionPaths,
    collaborationEdges: chartEdges,
    timeline,
    impactSummary: {
      departmentId: departments[0]?.id ?? "dept-executive",
      affectedWorkflows: ["Board pack refresh", "Forecast review", "Workflow escalation"],
      businessImpact: "Changes in the selected department alter leadership cadence, approvals, and downstream work.",
      dependencies: ["Executive coordination", "Workflow Builder", "Decision Engine"],
      risks: ["Escalation backlog", "Capacity mismatch", "Knowledge gaps"],
      initiatives: ["Quarterly planning", "Operating rhythm", "Governance refinement"],
      relatedKpis: ["SLA health", "Forecast confidence", "System health"],
    },
    selectedOrganizationId: organizations[0]?.id ?? "",
    selectedDepartmentId: departments[0]?.id ?? "dept-executive",
    selectedTeamId: teams[0]?.id ?? "team-1",
    query: "",
    liveMode: true,
  }
}

export function buildOrganizationSnapshot(input: {
  organizations: OrganizationRecord[]
  workspaces: WorkspaceRecord[]
  users: UserRecord[]
  teams: TeamRecord[]
  integrationCount: number
  integrationHealthCount: number
  runtimeQueueDepth: number
  runtimePendingTasks: number
  runtimeRunningAgents: number
  memoryEntries: number
  decisionSummary: string
  decisionConfidence: number | null
  planningObjective: string
  planningConfidence: number | null
  knowledgeNodes: number
  knowledgeEdges: number
  workflowName: string | null
  workflowRunning: boolean
  boardReportName: string | null
  currentRoleLabel: string
  currentRoleId: string
}): OrgIntelligenceSnapshot {
  return {
    organizationCount: input.organizations.length,
    workspaceCount: input.workspaces.length,
    userCount: input.users.length,
    teamCount: input.teams.length,
    integrationCount: input.integrationCount,
    integrationHealthCount: input.integrationHealthCount,
    runtimeQueueDepth: input.runtimeQueueDepth,
    runtimePendingTasks: input.runtimePendingTasks,
    runtimeRunningAgents: input.runtimeRunningAgents,
    memoryEntries: input.memoryEntries,
    decisionSummary: input.decisionSummary,
    decisionConfidence: input.decisionConfidence,
    planningObjective: input.planningObjective,
    planningConfidence: input.planningConfidence,
    knowledgeNodes: input.knowledgeNodes,
    knowledgeEdges: input.knowledgeEdges,
    workflowName: input.workflowName,
    workflowRunning: input.workflowRunning,
    boardReportName: input.boardReportName,
    currentRoleLabel: input.currentRoleLabel,
    currentRoleId: input.currentRoleId,
  }
}

export function selectOrganizationItem(items: OrgStructureItem[], id: string) {
  return items.find((item) => item.id === id) ?? items[0] ?? null
}

export function filterOrgItems<T extends { label?: string; summary?: string; title?: string; owner?: string }>(items: T[], query: string) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return items
  }

  return items.filter((item) => {
    const text = [item.label, item.summary, item.title, item.owner].filter(Boolean).join(" ")
    return text.toLowerCase().includes(normalized)
  })
}
