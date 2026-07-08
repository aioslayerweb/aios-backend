import type { IntegrationAdapterDefinition } from "../types"

export interface EnterpriseIntegrationAdapter {
  readonly definition: IntegrationAdapterDefinition
  connect(): Promise<{ state: "connected" | "configured" }>
  sync(): Promise<{ accepted: boolean }>
}

export class MockEnterpriseIntegrationAdapter implements EnterpriseIntegrationAdapter {
  constructor(readonly definition: IntegrationAdapterDefinition) {}

  async connect(): Promise<{ state: "connected" | "configured" }> {
    return { state: this.definition.authState === "required" ? "configured" : "connected" }
  }

  async sync(): Promise<{ accepted: boolean }> {
    return { accepted: true }
  }
}