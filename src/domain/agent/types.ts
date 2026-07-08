import type { Entity, OwnedEntity, SearchableEntity, TaggableEntity, Timestamped, VersionedEntity } from "@/src/domain/common/base"
import { Priority, RuntimeStatus, Status } from "@/src/domain/common/enums"
import type {
  AgentCapabilityId,
  AgentExecutionId,
  AgentId,
  AIModelId,
  PromptTemplateId,
  RuntimeSessionId,
  UserId,
  WorkspaceId,
} from "@/src/domain/types/ids"

/** Prompt template used by AI agents for deterministic reasoning entry points. */
export interface PromptTemplate extends Entity<PromptTemplateId>, Timestamped {
  readonly name: string
  readonly description?: string
  readonly prompt: string
  readonly version: number
}

/** AI model metadata used for execution routing and governance. */
export interface AIModel extends Entity<AIModelId>, Timestamped {
  readonly name: string
  readonly provider: "openai" | "anthropic" | "custom"
  readonly contextWindow: number
  readonly supportsTools: boolean
}

/** Agent capability declares modular responsibilities and constraints. */
export interface AgentCapability extends Entity<AgentCapabilityId>, Timestamped {
  readonly name: string
  readonly description: string
  readonly inputs: ReadonlyArray<string>
  readonly outputs: ReadonlyArray<string>
}

/** Agent entity models autonomous execution participants. */
export interface Agent
  extends Entity<AgentId>,
    Timestamped,
    OwnedEntity<UserId>,
    VersionedEntity,
    SearchableEntity,
    TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly name: string
  readonly description: string
  readonly status: Status
  readonly priority: Priority
  readonly capabilityIds: ReadonlyArray<AgentCapabilityId>
  readonly promptTemplateId?: PromptTemplateId
  readonly modelId?: AIModelId
}

/** Runtime session tracks active agent runtime context. */
export interface RuntimeSession extends Entity<RuntimeSessionId>, Timestamped, OwnedEntity<UserId> {
  readonly workspaceId: WorkspaceId
  readonly agentId: AgentId
  readonly status: RuntimeStatus
  readonly startedAt: string
  readonly endedAt?: string
}

/** Execution context captures input/output envelope for executions. */
export interface ExecutionContext extends Entity<string>, Timestamped {
  readonly runtimeSessionId: RuntimeSessionId
  readonly input: Record<string, unknown>
  readonly output?: Record<string, unknown>
  readonly metadata: Record<string, unknown>
}

/** Agent execution represents a concrete run lifecycle. */
export interface AgentExecution extends Entity<AgentExecutionId>, Timestamped, OwnedEntity<UserId> {
  readonly workspaceId: WorkspaceId
  readonly agentId: AgentId
  readonly runtimeSessionId: RuntimeSessionId
  readonly status: RuntimeStatus
  readonly summary: string
}
