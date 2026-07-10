export type MemoryDepartment =
  | "Executive"
  | "Finance"
  | "Sales"
  | "Marketing"
  | "Legal"
  | "Operations"
  | "HR"
  | "Engineering"
  | "Customer Success";

export type MemoryType = "meeting" | "decision" | "project" | "customer" | "policy" | "knowledge" | "agent" | "workflow";

export type MemoryRecord = {
  id: string;
  title: string;
  summary: string;
  owner: string;
  department: MemoryDepartment;
  type: MemoryType;
  confidence: number;
  importance: number;
  tags: string[];
  relationships: string[];
  retention: string;
  updatedAt: string;
  aiSummary: string;
  permissions: string;
  selected?: boolean;
};

export type MemoryCollection = {
  id: string;
  title: string;
  count: number;
  detail: string;
  updatedAt: string;
};

export type MemoryMetric = {
  id: string;
  label: string;
  value: string;
  detail: string;
};

export type MemoryInsight = {
  id: string;
  title: string;
  detail: string;
};

export type MemoryTimelineEvent = {
  id: string;
  stage: string;
  description: string;
  timestamp: string;
};

export type MemoryGraphNode = {
  id: string;
  label: string;
  category: "People" | "Departments" | "Projects" | "Customers" | "Knowledge" | "Policies" | "Workflows" | "Agents" | "Decisions" | "Meetings";
  x: number;
  y: number;
};

export type MemoryGraphLink = {
  id: string;
  from: string;
  to: string;
  label: string;
};

export type MemoryContextItem = {
  id: string;
  label: string;
  value: string;
};

export type MemoryFilter = {
  id: string;
  label: string;
};

export type SavedSearch = {
  id: string;
  label: string;
  query: string;
};
