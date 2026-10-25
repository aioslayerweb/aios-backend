import type {
  BusinessConnectorAdapter,
  ConnectorDefinition,
  ConnectorDataCategory,
  ConnectorInstance,
  ConnectorPage,
  ConnectorRawRecord,
} from "./connector-types";

const fixtures: ConnectorRawRecord[] = [
  { sourceRecordId: "demo-opportunity-001", name: "Northwind renewal expansion (synthetic)", stage: "proposal", amount: 12500, currency: "EUR", sourceUpdatedAt: "2026-10-24T09:00:00.000Z" },
  { sourceRecordId: "demo-opportunity-002", name: "Helios operations pilot (synthetic)", stage: "qualification", amount: 7800, currency: "EUR", sourceUpdatedAt: "2026-10-20T09:00:00.000Z" },
  { sourceRecordId: "demo-opportunity-003", name: "Archived services opportunity (synthetic)", stage: "closed_lost", amount: 4200, currency: "EUR", sourceUpdatedAt: "2026-07-10T09:00:00.000Z", deleted: true },
];

export const syntheticOpportunityDefinition: ConnectorDefinition = {
  id: "synthetic-opportunity-fixture",
  name: "Synthetic CRM Opportunity Fixture",
  category: "test",
  mode: "test",
  authenticationMethod: "none",
  requiredScopes: ["opportunities.read"],
  dataCategories: ["opportunities"],
  dataPermission: "view_reports",
  metadata: { fixtureVersion: "1", dataClassification: "synthetic-only" },
};

export class SyntheticOpportunityAdapter implements BusinessConnectorAdapter {
  readonly definition = syntheticOpportunityDefinition;

  async validateConnection(instance: ConnectorInstance) {
    if (instance.definitionId !== this.definition.id || instance.organizationId.length === 0) {
      return { valid: false, errorCategory: "not_configured" as const };
    }
    return { valid: true };
  }

  async discoverResources(): Promise<ConnectorDataCategory[]> {
    return ["opportunities"];
  }

  async fetchPage(input: { instance: ConnectorInstance; cursor?: string; limit: number }): Promise<ConnectorPage> {
    if (input.instance.definitionId !== this.definition.id || input.instance.status !== "synchronizing") {
      throw Object.assign(new Error("Fixture connector is not verified for synchronization."), { category: "authorization_required" });
    }
    const offset = input.cursor ? Number.parseInt(input.cursor, 10) : 0;
    if (!Number.isInteger(offset) || offset < 0 || offset > fixtures.length) {
      throw Object.assign(new Error("Fixture cursor is invalid."), { category: "invalid_data" });
    }
    const records = fixtures.slice(offset, offset + input.limit);
    const nextOffset = offset + records.length;
    const complete = nextOffset >= fixtures.length;
    return { records, ...(complete ? {} : { nextCursor: String(nextOffset) }), complete };
  }
}
