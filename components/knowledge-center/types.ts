import type { KnowledgeGraphEdge, KnowledgeGraphNode, KnowledgeTimelineEvent } from "@/types";

export type KnowledgeStatus = "draft" | "review" | "approved" | "published" | "referenced" | "updated" | "deprecated" | "archived";

export type KnowledgeRecord = {
  id: string;
  title: string;
  description: string;
  executiveSummary: string;
  aiSummary: string;
  businessPurpose: string;
  owner: string;
  department: string;
  knowledgeType: "policy" | "standard" | "process" | "template" | "playbook" | "framework" | "procedure" | "rule";
  businessArea: string;
  status: KnowledgeStatus;
  version: string;
  confidence: number;
  aiReadiness: number;
  updatedAt: string;
  policy: string;
  standard: string;
  permissions: string;
  approvals: string;
  compliance: string;
  tags: string[];
  relationships: string[];
  linkedMemories: string[];
  linkedWorkflows: string[];
  linkedDecisions: string[];
  relatedPolicies: string[];
  relatedStandards: string[];
  reviewers: string[];
  editors: string[];
  comments: number;
  mentions: number;
};

export type KnowledgeMetric = {
  id: string;
  label: string;
  value: string;
  detail: string;
  trend: string;
  tone: "success" | "warning" | "critical" | "default";
};

export type KnowledgeRibbonMetric = {
  id: string;
  label: string;
  value: string;
  status: string;
  trend: string;
  tone: "success" | "warning" | "critical" | "default";
};

export type KnowledgeDomain = {
  id: string;
  title: string;
  detail: string;
  documents: number;
  owner: string;
  status: string;
  tags: string[];
};

export type KnowledgeInsight = {
  id: string;
  title: string;
  detail: string;
  recommendation: string;
  confidence: number;
};

export type KnowledgeGovernanceItem = {
  id: string;
  label: string;
  value: string;
  detail: string;
};

export type KnowledgeCollaborationItem = {
  id: string;
  label: string;
  value: string;
  detail: string;
};

export type KnowledgeSavedSearch = {
  id: string;
  label: string;
  query: string;
};

export type KnowledgeFilter = {
  id: string;
  label: string;
};

export type KnowledgeContextItem = {
  id: string;
  label: string;
  value: string;
};

export type KnowledgeConstellationData = {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
};

export type KnowledgeLifecycleEvent = KnowledgeTimelineEvent;
