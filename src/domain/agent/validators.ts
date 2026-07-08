import type {
  AIModel,
  Agent,
  AgentCapability,
  AgentExecution,
  ExecutionContext,
  PromptTemplate,
  RuntimeSession,
} from "@/src/domain/agent/types"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

/** Type guard for PromptTemplate entities. */
export function isPromptTemplate(value: unknown): value is PromptTemplate {
  return isRecord(value) && typeof value.id === "string" && typeof value.prompt === "string"
}

/** Type guard for AIModel entities. */
export function isAIModel(value: unknown): value is AIModel {
  return isRecord(value) && typeof value.id === "string" && typeof value.provider === "string"
}

/** Type guard for AgentCapability entities. */
export function isAgentCapability(value: unknown): value is AgentCapability {
  return isRecord(value) && typeof value.id === "string" && Array.isArray(value.inputs)
}

/** Type guard for Agent entities. */
export function isAgent(value: unknown): value is Agent {
  return isRecord(value) && typeof value.id === "string" && Array.isArray(value.capabilityIds)
}

/** Type guard for RuntimeSession entities. */
export function isRuntimeSession(value: unknown): value is RuntimeSession {
  return isRecord(value) && typeof value.id === "string" && typeof value.agentId === "string"
}

/** Type guard for ExecutionContext entities. */
export function isExecutionContext(value: unknown): value is ExecutionContext {
  return isRecord(value) && typeof value.id === "string" && isRecord(value.input)
}

/** Type guard for AgentExecution entities. */
export function isAgentExecution(value: unknown): value is AgentExecution {
  return isRecord(value) && typeof value.id === "string" && typeof value.runtimeSessionId === "string"
}
