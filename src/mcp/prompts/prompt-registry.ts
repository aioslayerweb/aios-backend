import type { MCPPromptRegistryEntry, MCPServerConnection } from "@/src/mcp/types"

export function createMCPPromptRegistry(servers: MCPServerConnection[]): MCPPromptRegistryEntry[] {
  return servers.flatMap((server) =>
    server.prompts.map((promptId, index) => ({
      id: promptId,
      name: promptId.replace(/-/g, " "),
      version: `1.0.${index}`,
      author: "AIOS Platform",
      approvals: [{ approver: "Security Council", approvedAt: new Date().toISOString(), status: server.approvalStatus === "approved" ? "approved" : "pending" }],
      changes: ["Initial enterprise MCP prompt registration"],
      releaseHistory: [{ version: `1.0.${index}`, releasedAt: new Date().toISOString(), releasedBy: "AIOS Platform", summary: "Initial MCP prompt release" }],
      associatedAgents: ["Prompt OS"],
      associatedModels: ["gpt-5.4-mini"],
      status: server.status === "connected" ? "active" : "draft",
    }))
  )
}
