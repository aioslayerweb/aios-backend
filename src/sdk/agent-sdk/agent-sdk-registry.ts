import type { AgentSDKDefinition } from "@/src/sdk/types"

export class AgentSDKRegistry {
  private readonly agents = new Map<string, AgentSDKDefinition>()

  register(definition: AgentSDKDefinition): void {
    this.agents.set(definition.id, definition)
  }

  list(): AgentSDKDefinition[] {
    return Array.from(this.agents.values())
  }

  findById(id: string): AgentSDKDefinition | undefined {
    return this.agents.get(id)
  }
}
