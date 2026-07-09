import type { MCPConnectorDefinition } from "@/src/sdk/types"

export class ConnectorRegistry {
  private readonly connectors = new Map<string, MCPConnectorDefinition>()

  register(definition: MCPConnectorDefinition): void {
    this.connectors.set(definition.id, definition)
  }

  list(): MCPConnectorDefinition[] {
    return Array.from(this.connectors.values())
  }
}
