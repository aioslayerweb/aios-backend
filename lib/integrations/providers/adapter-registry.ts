import { mockIntegrationAdapters } from "../adapters/mock-adapters"

export function listIntegrationAdapters() {
  return mockIntegrationAdapters
}

export function getIntegrationAdapter(adapterId: string) {
  return mockIntegrationAdapters.find((adapter) => adapter.definition.id === adapterId)
}