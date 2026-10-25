import type { IntegrationAdapterDefinition } from "../types"

export interface EnterpriseIntegrationAdapter {
  readonly definition: IntegrationAdapterDefinition
  connect(): Promise<{ state: "connected" | "configured" }>
  sync(): Promise<{ accepted: boolean }>
}

export class MockEnterpriseIntegrationAdapter implements EnterpriseIntegrationAdapter {
  readonly definition: IntegrationAdapterDefinition

  constructor(definition: IntegrationAdapterDefinition) {
    this.definition = {
      ...definition,
      health: "auth-required",
      authState: "required",
      lastSync: "never",
      synchronizedObjects: 0,
      errors: 0,
      statusDetail: "Catalog example only. Provider credentials and synchronization infrastructure are not configured.",
      mock: true,
    }
  }

  async connect(): Promise<{ state: "connected" | "configured" }> {
    throw new Error("Connect unavailable: this mock adapter has no provider authorization implementation.")
  }

  async sync(): Promise<{ accepted: boolean }> {
    throw new Error("Sync unavailable: this mock adapter has no provider synchronization implementation.")
  }
}