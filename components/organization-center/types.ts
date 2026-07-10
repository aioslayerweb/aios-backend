import type { WorkspaceMetric } from "@/components/workspace";

export type OrganizationOverviewMetric = WorkspaceMetric;

export type OrganizationStatus = "active" | "attention" | "stable" | "growing";

export type OrgNodeType = "ceo" | "executive" | "department" | "manager" | "employee" | "agent";

export type OrgChartNode = {
  id: string;
  label: string;
  role: string;
  type: OrgNodeType;
  reportsTo?: string;
  department?: string;
  agents: string[];
  expanded?: boolean;
};

export type DepartmentRecord = {
  id: string;
  name: string;
  head: string;
  employees: number;
  agents: number;
  performanceScore: number;
  healthScore: number;
  budget: string;
  status: OrganizationStatus;
};

export type BusinessUnitRecord = {
  id: string;
  name: string;
  region: string;
  revenue: string;
  employees: number;
  agents: number;
  processes: number;
  risk: string;
  growth: string;
};

export type EmployeeStatus = "available" | "busy" | "offline";

export type EmployeeRecord = {
  id: string;
  name: string;
  role: string;
  department: string;
  country: string;
  office: string;
  reportsTo: string;
  skills: string[];
  status: EmployeeStatus;
  assignedAgents: string[];
  workload: number;
  availability: string;
  avatarSeed: string;
};

export type AIWorkforceMetric = {
  id: string;
  label: string;
  value: string;
  detail: string;
};

export type RaciProcess = {
  id: string;
  process: string;
  responsible: string;
  accountable: string;
  consulted: string;
  informed: string;
};

export type PermissionNode = {
  id: string;
  label: string;
  group: "role" | "group" | "capability" | "access" | "compliance";
  x: number;
  y: number;
};

export type PermissionLink = {
  id: string;
  from: string;
  to: string;
  label: string;
};

export type AnalyticsSeries = {
  id: string;
  label: string;
  value: string;
  trend: string;
  detail: string;
};

export type OrgActivityEvent = {
  id: string;
  type: "hiring" | "role-change" | "department" | "agent" | "policy" | "org";
  title: string;
  detail: string;
  timestamp: string;
};

export type InsightItem = {
  id: string;
  title: string;
  detail: string;
  tone: "default" | "success" | "warning" | "critical";
};

export type OrgSidebarSection = {
  title: string;
  items: Array<{ id: string; label: string; href: string; meta?: string }>;
};
