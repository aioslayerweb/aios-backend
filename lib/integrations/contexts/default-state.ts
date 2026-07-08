import { listIntegrationAdapters } from "../providers/adapter-registry"
import { createIntegrationState } from "../services/create-integration-state"

export function createDefaultIntegrationState() {
  return createIntegrationState(listIntegrationAdapters())
}