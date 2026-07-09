import type { MCPServerExport } from "@/src/mcp/types"

export function createMCPServerExports(): MCPServerExport[] {
  return [
    { id: "srv-memory", name: "Memory", description: "Tenant-scoped memory retrieval and writes.", capability: "memory", requiredPermissions: ["manage_memory"], endpoint: "/mcp/memory", version: "1.0.0" },
    { id: "srv-knowledge", name: "Knowledge Graph", description: "Knowledge graph queries and context retrieval.", capability: "knowledge-graph", requiredPermissions: ["manage_knowledge"], endpoint: "/mcp/knowledge-graph", version: "1.0.0" },
    { id: "srv-workflows", name: "Workflow Engine", description: "Workflow execution and orchestration controls.", capability: "workflow-engine", requiredPermissions: ["manage_workflows", "execute_workflow"], endpoint: "/mcp/workflows", version: "1.0.0" },
    { id: "srv-replay", name: "Replay Engine", description: "Execution replay and timeline inspection.", capability: "replay-engine", requiredPermissions: ["view_audit_logs"], endpoint: "/mcp/replay", version: "1.0.0" },
    { id: "srv-planning", name: "Planning Engine", description: "Planning priorities and strategic objective context.", capability: "planning-engine", requiredPermissions: ["view_dashboard"], endpoint: "/mcp/planning", version: "1.0.0" },
    { id: "srv-decision", name: "Decision Engine", description: "Decision reasoning and recommendation interfaces.", capability: "decision-engine", requiredPermissions: ["approve_decisions"], endpoint: "/mcp/decisions", version: "1.0.0" },
    { id: "srv-exec-intelligence", name: "Executive Intelligence", description: "Executive summaries and strategic signals.", capability: "executive-intelligence", requiredPermissions: ["view_reports"], endpoint: "/mcp/executive-intelligence", version: "1.0.0" },
    { id: "srv-role-intelligence", name: "Role Intelligence", description: "Role-adapted AI context and priorities.", capability: "role-intelligence", requiredPermissions: ["view_dashboard"], endpoint: "/mcp/role-intelligence", version: "1.0.0" },
    { id: "srv-org-intelligence", name: "Organization Intelligence", description: "Org structure and operating model insights.", capability: "organization-intelligence", requiredPermissions: ["view_dashboard"], endpoint: "/mcp/organization-intelligence", version: "1.0.0" },
    { id: "srv-reports", name: "Reports", description: "Board and operational reporting exports.", capability: "reports", requiredPermissions: ["view_reports", "export_data"], endpoint: "/mcp/reports", version: "1.0.0" },
    { id: "srv-analytics", name: "Analytics", description: "KPI and metric retrieval interfaces.", capability: "analytics", requiredPermissions: ["view_dashboard"], endpoint: "/mcp/analytics", version: "1.0.0" },
    { id: "srv-search", name: "Search", description: "Cross-domain search and retrieval.", capability: "search", requiredPermissions: ["view_dashboard"], endpoint: "/mcp/search", version: "1.0.0" },
    { id: "srv-agent-registry", name: "Agent Registry", description: "Agent catalog and capability lookup.", capability: "agent-registry", requiredPermissions: ["manage_agents"], endpoint: "/mcp/agent-registry", version: "1.0.0" },
    { id: "srv-prompt-registry", name: "Prompt Registry", description: "Prompt versioning and approvals.", capability: "prompt-registry", requiredPermissions: ["manage_policies"], endpoint: "/mcp/prompt-registry", version: "1.0.0" },
    { id: "srv-model-registry", name: "Model Registry", description: "Model selection and governance metadata.", capability: "model-registry", requiredPermissions: ["manage_ai_models"], endpoint: "/mcp/model-registry", version: "1.0.0" },
    { id: "srv-business-context", name: "Business Context", description: "Business context for role- and tenant-aware execution.", capability: "business-context", requiredPermissions: ["view_dashboard"], endpoint: "/mcp/business-context", version: "1.0.0" },
  ]
}
