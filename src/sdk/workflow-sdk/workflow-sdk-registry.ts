import type { WorkflowSDKDefinition } from "@/src/sdk/types"

export class WorkflowSDKRegistry {
  private readonly workflows = new Map<string, WorkflowSDKDefinition>()

  register(definition: WorkflowSDKDefinition): void {
    this.workflows.set(definition.id, definition)
  }

  list(): WorkflowSDKDefinition[] {
    return Array.from(this.workflows.values())
  }

  findById(id: string): WorkflowSDKDefinition | undefined {
    return this.workflows.get(id)
  }
}
