import type {
  AIWorkforceMetric,
  AnalyticsSeries,
  BusinessUnitRecord,
  DepartmentRecord,
  EmployeeRecord,
  InsightItem,
  OrgActivityEvent,
  OrgChartNode,
  OrgSidebarSection,
  OrganizationOverviewMetric,
  PermissionLink,
  PermissionNode,
  RaciProcess,
} from "./types";

export const organizationOverviewMetrics: OrganizationOverviewMetric[] = [
  { id: "o1", label: "Employees", value: "4,280", detail: "Global workforce" },
  { id: "o2", label: "Departments", value: "18", detail: "Active departments" },
  { id: "o3", label: "Business Units", value: "7", detail: "Operating units" },
  { id: "o4", label: "AI Agents", value: "236", detail: "AI workforce" },
  { id: "o5", label: "Countries", value: "14", detail: "Regional footprint" },
  { id: "o6", label: "Locations", value: "31", detail: "Offices + hubs" },
  { id: "o7", label: "Reporting Chains", value: "612", detail: "Managerial links" },
];

export const organizationChart: OrgChartNode[] = [
  { id: "n1", label: "Ava Chen", role: "CEO", type: "ceo", agents: ["Executive Assistant AI"] },
  { id: "n2", label: "Liam Brooks", role: "COO", type: "executive", reportsTo: "n1", agents: ["Ops Orchestrator"] },
  { id: "n3", label: "Noah Patel", role: "CFO", type: "executive", reportsTo: "n1", agents: ["Finance Analyst AI"] },
  { id: "n4", label: "Maya Rivera", role: "CRO", type: "executive", reportsTo: "n1", agents: ["Revenue Strategist"] },
  { id: "n5", label: "Operations", role: "Department", type: "department", reportsTo: "n2", department: "Operations", agents: ["Capacity Planner", "Workflow Optimizer"] },
  { id: "n6", label: "Engineering", role: "Department", type: "department", reportsTo: "n2", department: "Engineering", agents: ["Platform Agent", "Release Guard"] },
  { id: "n7", label: "Finance", role: "Department", type: "department", reportsTo: "n3", department: "Finance", agents: ["Controls Agent", "Forecast Agent"] },
  { id: "n8", label: "Sales", role: "Department", type: "department", reportsTo: "n4", department: "Sales", agents: ["Pipeline Agent", "Account Risk AI"] },
  { id: "n9", label: "Ivy Morgan", role: "Operations Manager", type: "manager", reportsTo: "n5", department: "Operations", agents: ["Ops Copilot"] },
  { id: "n10", label: "Ethan Lee", role: "Platform Manager", type: "manager", reportsTo: "n6", department: "Engineering", agents: ["Reliability Agent"] },
  { id: "n11", label: "Sophia Grant", role: "Finance Manager", type: "manager", reportsTo: "n7", department: "Finance", agents: ["Spend Guard"] },
  { id: "n12", label: "Lucas Kim", role: "Sales Manager", type: "manager", reportsTo: "n8", department: "Sales", agents: ["Deal Coach"] },
  { id: "n13", label: "Nina Flores", role: "Senior Analyst", type: "employee", reportsTo: "n11", department: "Finance", agents: ["Forecast Agent"] },
  { id: "n14", label: "Kai Turner", role: "Account Executive", type: "employee", reportsTo: "n12", department: "Sales", agents: ["Account Risk AI"] },
];

export const departmentRecords: DepartmentRecord[] = [
  { id: "d1", name: "Operations", head: "Liam Brooks", employees: 840, agents: 38, performanceScore: 92, healthScore: 94, budget: "€24.3M", status: "active" },
  { id: "d2", name: "Engineering", head: "Priya Nair", employees: 1020, agents: 54, performanceScore: 95, healthScore: 91, budget: "€36.8M", status: "growing" },
  { id: "d3", name: "Finance", head: "Noah Patel", employees: 420, agents: 31, performanceScore: 89, healthScore: 88, budget: "€18.2M", status: "attention" },
  { id: "d4", name: "Sales", head: "Maya Rivera", employees: 760, agents: 46, performanceScore: 93, healthScore: 90, budget: "€29.5M", status: "active" },
  { id: "d5", name: "Customer Success", head: "Amelia Scott", employees: 510, agents: 32, performanceScore: 91, healthScore: 92, budget: "€16.4M", status: "stable" },
  { id: "d6", name: "Compliance", head: "Daniel Wright", employees: 190, agents: 18, performanceScore: 87, healthScore: 89, budget: "€9.7M", status: "attention" },
];

export const businessUnits: BusinessUnitRecord[] = [
  { id: "b1", name: "North America Enterprise", region: "NAMER", revenue: "€84.2M", employees: 1240, agents: 68, processes: 132, risk: "Low", growth: "+14%" },
  { id: "b2", name: "EMEA Strategic", region: "EMEA", revenue: "€52.9M", employees: 910, agents: 57, processes: 108, risk: "Medium", growth: "+9%" },
  { id: "b3", name: "APAC Expansion", region: "APAC", revenue: "€31.7M", employees: 640, agents: 41, processes: 84, risk: "Medium", growth: "+17%" },
  { id: "b4", name: "Public Sector", region: "Global", revenue: "€21.1M", employees: 390, agents: 24, processes: 62, risk: "Low", growth: "+8%" },
];

export const peopleDirectory: EmployeeRecord[] = [
  { id: "p1", name: "Ava Chen", role: "Chief Executive Officer", department: "Executive", country: "United States", office: "New York", reportsTo: "Board", skills: ["Strategy", "Leadership", "Growth"], status: "available", assignedAgents: ["Executive Assistant AI"], workload: 82, availability: "Today 3:00 PM", avatarSeed: "AC" },
  { id: "p2", name: "Noah Patel", role: "Chief Financial Officer", department: "Finance", country: "United States", office: "Chicago", reportsTo: "Ava Chen", skills: ["Finance", "Controls", "Forecasting"], status: "busy", assignedAgents: ["Finance Analyst AI", "Controls Agent"], workload: 91, availability: "Tomorrow 10:00 AM", avatarSeed: "NP" },
  { id: "p3", name: "Maya Rivera", role: "Chief Revenue Officer", department: "Sales", country: "United Kingdom", office: "London", reportsTo: "Ava Chen", skills: ["Revenue", "Sales Strategy", "Pricing"], status: "available", assignedAgents: ["Revenue Strategist", "Pipeline Agent"], workload: 78, availability: "Today 5:30 PM", avatarSeed: "MR" },
  { id: "p4", name: "Ivy Morgan", role: "Operations Manager", department: "Operations", country: "Germany", office: "Berlin", reportsTo: "Liam Brooks", skills: ["Operations", "Capacity", "Automation"], status: "busy", assignedAgents: ["Ops Copilot", "Capacity Planner"], workload: 88, availability: "Tomorrow 2:00 PM", avatarSeed: "IM" },
  { id: "p5", name: "Kai Turner", role: "Account Executive", department: "Sales", country: "Canada", office: "Toronto", reportsTo: "Lucas Kim", skills: ["Enterprise Sales", "Negotiation", "Renewals"], status: "available", assignedAgents: ["Deal Coach", "Account Risk AI"], workload: 73, availability: "Today 4:00 PM", avatarSeed: "KT" },
  { id: "p6", name: "Nina Flores", role: "Senior Finance Analyst", department: "Finance", country: "United States", office: "Austin", reportsTo: "Sophia Grant", skills: ["Forecasting", "Planning", "Controls"], status: "offline", assignedAgents: ["Forecast Agent"], workload: 69, availability: "Monday 9:00 AM", avatarSeed: "NF" },
  { id: "p7", name: "Ethan Lee", role: "Platform Manager", department: "Engineering", country: "Singapore", office: "Singapore", reportsTo: "Liam Brooks", skills: ["Architecture", "Reliability", "DevOps"], status: "busy", assignedAgents: ["Release Guard", "Reliability Agent"], workload: 86, availability: "Today 6:00 PM", avatarSeed: "EL" },
  { id: "p8", name: "Amelia Scott", role: "VP Customer Success", department: "Customer Success", country: "Ireland", office: "Dublin", reportsTo: "Maya Rivera", skills: ["Retention", "Onboarding", "CS Ops"], status: "available", assignedAgents: ["Onboarding Agent", "Retention AI"], workload: 75, availability: "Today 1:30 PM", avatarSeed: "AS" },
];

export const aiWorkforceMetrics: AIWorkforceMetric[] = [
  { id: "a1", label: "Human Employees", value: "4,280", detail: "Full-time + contractor" },
  { id: "a2", label: "AI Employees", value: "236", detail: "Active autonomous agents" },
  { id: "a3", label: "Hybrid Teams", value: "52", detail: "Human + AI pods" },
  { id: "a4", label: "AI Utilization", value: "74%", detail: "Avg daily utilization" },
  { id: "a5", label: "Automation %", value: "61%", detail: "Process automation share" },
  { id: "a6", label: "Agent Health", value: "96%", detail: "Healthy runtime status" },
  { id: "a7", label: "Agent Version", value: "v6.2.1", detail: "Current deployed baseline" },
  { id: "a8", label: "Runtime Status", value: "Stable", detail: "No critical incidents" },
];

export const raciMatrix: RaciProcess[] = [
  { id: "r1", process: "Quarterly Planning", responsible: "Operations", accountable: "COO", consulted: "Finance, Sales", informed: "Executive Team" },
  { id: "r2", process: "Pricing Update", responsible: "Sales", accountable: "CRO", consulted: "Finance, Legal", informed: "Customer Success" },
  { id: "r3", process: "Security Policy Review", responsible: "Compliance", accountable: "CISO", consulted: "Engineering, Legal", informed: "All Departments" },
  { id: "r4", process: "Hiring Plan", responsible: "HR", accountable: "CHRO", consulted: "Department Heads", informed: "Finance" },
  { id: "r5", process: "Agent Deployment", responsible: "Engineering", accountable: "CTO", consulted: "Operations, Compliance", informed: "Executive Team" },
];

export const permissionNodes: PermissionNode[] = [
  { id: "pn1", label: "Roles", group: "role", x: 90, y: 140 },
  { id: "pn2", label: "Groups", group: "group", x: 300, y: 80 },
  { id: "pn3", label: "Capabilities", group: "capability", x: 300, y: 240 },
  { id: "pn4", label: "Access Level", group: "access", x: 520, y: 120 },
  { id: "pn5", label: "Compliance", group: "compliance", x: 520, y: 260 },
];

export const permissionLinks: PermissionLink[] = [
  { id: "pl1", from: "pn1", to: "pn2", label: "assigns" },
  { id: "pl2", from: "pn1", to: "pn3", label: "grants" },
  { id: "pl3", from: "pn2", to: "pn4", label: "inherits" },
  { id: "pl4", from: "pn3", to: "pn4", label: "enables" },
  { id: "pl5", from: "pn4", to: "pn5", label: "verified by" },
];

export const organizationAnalytics: AnalyticsSeries[] = [
  { id: "an1", label: "Hiring Trend", value: "+12%", trend: "+3%", detail: "Quarter-over-quarter" },
  { id: "an2", label: "Department Growth", value: "+8%", trend: "+1.4%", detail: "Headcount expansion" },
  { id: "an3", label: "Attrition", value: "4.2%", trend: "-0.9%", detail: "Improved retention" },
  { id: "an4", label: "Performance", value: "91", trend: "+2", detail: "Composite score" },
  { id: "an5", label: "Capacity", value: "87%", trend: "+4%", detail: "Org utilization" },
  { id: "an6", label: "AI Adoption", value: "71%", trend: "+6%", detail: "Role-based usage" },
  { id: "an7", label: "Automation Maturity", value: "63", trend: "+5", detail: "Maturity index" },
];

export const organizationActivity: OrgActivityEvent[] = [
  { id: "ev1", type: "hiring", title: "Senior Platform Engineer hired", detail: "Engineering team in Singapore expanded by one FTE", timestamp: "2026-07-10T06:20:00Z" },
  { id: "ev2", type: "role-change", title: "Sales manager reassignment", detail: "EMEA manager now reports to CRO for regional alignment", timestamp: "2026-07-10T07:10:00Z" },
  { id: "ev3", type: "department", title: "Compliance unit updated", detail: "New policy review ownership mapped to Legal + Compliance", timestamp: "2026-07-10T07:45:00Z" },
  { id: "ev4", type: "agent", title: "Finance Analyst AI v6.2 deployed", detail: "Automation path enabled for spend approvals", timestamp: "2026-07-10T08:00:00Z" },
  { id: "ev5", type: "policy", title: "Permission model refreshed", detail: "Role-based capabilities updated for audit readiness", timestamp: "2026-07-10T08:25:00Z" },
  { id: "ev6", type: "org", title: "Business unit alignment complete", detail: "Public Sector unit now linked to strategic revenue model", timestamp: "2026-07-10T08:40:00Z" },
];

export const rightInsights: InsightItem[] = [
  { id: "i1", title: "Organization Health", detail: "Overall health score remains stable at 93 with finance and compliance needing attention.", tone: "success" },
  { id: "i2", title: "Team Performance", detail: "Engineering and Sales pods are above target; compliance review teams are below threshold.", tone: "warning" },
  { id: "i3", title: "Upcoming Reviews", detail: "Quarterly department reviews begin next week across Finance, Operations, and Legal.", tone: "default" },
  { id: "i4", title: "Hiring Alerts", detail: "Critical open roles in infrastructure and customer support remain unfilled for 21+ days.", tone: "critical" },
  { id: "i5", title: "Manager Notifications", detail: "Three managers have pending performance calibration actions.", tone: "warning" },
  { id: "i6", title: "Department Risks", detail: "Finance workflow saturation and compliance SLA risk are trending up.", tone: "critical" },
  { id: "i7", title: "Capacity Forecast", detail: "Warehouse and support teams are projected to exceed 95% capacity this month.", tone: "warning" },
  { id: "i8", title: "AI Suggestions", detail: "AI recommends automating expense approvals and onboarding checklists next.", tone: "success" },
];

export const orgSidebarSections: OrgSidebarSection[] = [
  {
    title: "Organization Views",
    items: [
      { id: "overview", label: "Organization Overview", href: "#", meta: "Live" },
      { id: "chart", label: "Interactive Chart", href: "#", meta: "Hierarchy" },
      { id: "departments", label: "Departments", href: "#", meta: "18" },
      { id: "units", label: "Business Units", href: "#", meta: "7" },
      { id: "directory", label: "People Directory", href: "#", meta: "4,280" },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { id: "workforce", label: "AI Workforce", href: "#", meta: "236" },
      { id: "raci", label: "Responsibility Matrix", href: "#", meta: "RACI" },
      { id: "permissions", label: "Permissions Overview", href: "#", meta: "RBAC" },
      { id: "analytics", label: "Organization Analytics", href: "#", meta: "Live" },
      { id: "timeline", label: "Activity Timeline", href: "#", meta: "Today" },
    ],
  },
];
