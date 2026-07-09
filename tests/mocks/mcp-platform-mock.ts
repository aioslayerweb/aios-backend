export type MockMCPExecution = {
  requestId: string
  capability: string
  provider: string
  status: "success" | "failed" | "fallback"
  latencyMs: number
}

export const mockMcpExecutions: MockMCPExecution[] = [
  {
    requestId: "req-1",
    capability: "crm.search",
    provider: "salesforce",
    status: "success",
    latencyMs: 140,
  },
  {
    requestId: "req-2",
    capability: "ticket.lookup",
    provider: "zendesk",
    status: "fallback",
    latencyMs: 430,
  },
]
