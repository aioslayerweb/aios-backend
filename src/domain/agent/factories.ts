import { Priority, RuntimeStatus, Status } from "@/src/domain/common/enums"
import type {
  AIModel,
  Agent,
  AgentCapability,
  AgentExecution,
  ExecutionContext,
  PromptTemplate,
  RuntimeSession,
} from "@/src/domain/agent/types"
import { createId } from "@/src/domain/utils/id"

/** Creates a reusable prompt template. */
export function createPromptTemplate(partial: Partial<PromptTemplate> = {}): PromptTemplate {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("prompt_template"),
    name: partial.name ?? "Executive Insight Prompt",
    description: partial.description ?? "Generate concise executive-grade insight and recommendation.",
    prompt: partial.prompt ?? "Summarize key business signals and recommend next action.",
    version: partial.version ?? 1,
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates an AI model descriptor. */
export function createAIModel(partial: Partial<AIModel> = {}): AIModel {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("ai_model"),
    name: partial.name ?? "gpt-5.3-codex",
    provider: partial.provider ?? "openai",
    contextWindow: partial.contextWindow ?? 200000,
    supportsTools: partial.supportsTools ?? true,
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates an agent capability. */
export function createAgentCapability(partial: Partial<AgentCapability> = {}): AgentCapability {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("agent_capability"),
    name: partial.name ?? "Signal Interpretation",
    description: partial.description ?? "Interprets business signals into actionable insights.",
    inputs: partial.inputs ?? ["signals", "context"],
    outputs: partial.outputs ?? ["insight", "recommendation"],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates an agent entity. */
export function createAgent(partial: Partial<Agent> = {}): Agent {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("agent"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    name: partial.name ?? "Revenue Strategy Agent",
    description: partial.description ?? "Optimizes revenue decisions based on multi-source signals.",
    status: partial.status ?? Status.Active,
    priority: partial.priority ?? Priority.High,
    capabilityIds: partial.capabilityIds ?? [],
    promptTemplateId: partial.promptTemplateId,
    modelId: partial.modelId,
    version: partial.version ?? 1,
    searchText: partial.searchText ?? "revenue strategy agent",
    searchKeywords: partial.searchKeywords ?? ["revenue", "strategy", "agent"],
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates a runtime session. */
export function createRuntimeSession(partial: Partial<RuntimeSession> = {}): RuntimeSession {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("runtime_session"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    agentId: partial.agentId ?? createId("agent"),
    status: partial.status ?? RuntimeStatus.Running,
    startedAt: partial.startedAt ?? now,
    endedAt: partial.endedAt,
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates an execution context envelope. */
export function createExecutionContext(partial: Partial<ExecutionContext> = {}): ExecutionContext {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("execution_context"),
    runtimeSessionId: partial.runtimeSessionId ?? createId("runtime_session"),
    input: partial.input ?? {},
    output: partial.output,
    metadata: partial.metadata ?? {},
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates an agent execution record. */
export function createAgentExecution(partial: Partial<AgentExecution> = {}): AgentExecution {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("agent_execution"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    agentId: partial.agentId ?? createId("agent"),
    runtimeSessionId: partial.runtimeSessionId ?? createId("runtime_session"),
    status: partial.status ?? RuntimeStatus.Running,
    summary: partial.summary ?? "Agent execution started and processing signal graph.",
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}
