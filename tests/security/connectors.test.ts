import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createConnectorInstance,
  ConnectorDataCategory,
  disconnectConnector,
  synchronizeConnector,
  SyntheticOpportunityAdapter,
  verifyConnectorConnection,
  type BusinessConnectorAdapter,
  type ConnectorInstance,
  type ConnectorPage,
  type ConnectorRawRecord,
  type NormalizedOpportunity,
} from "@/lib/integrations/connectors";
import { createDefaultIntegrationState, listIntegrationAdapters } from "@/lib/integrations";
import type { PermissionKey } from "@/src/domain/security";

const organizationId = "org-connector-test";
const now = "2026-10-25T10:00:00.000Z";
const fullPermissions = new Set<PermissionKey>(["manage_integrations", "view_reports"]);
const managerOnly = new Set<PermissionKey>(["manage_integrations"]);

function instanceFor(organization = organizationId) {
  const adapter = new SyntheticOpportunityAdapter();
  return createConnectorInstance({
    id: `${organization}:synthetic`,
    definitionId: adapter.definition.id,
    organizationId: organization,
    displayName: adapter.definition.name,
    scopes: adapter.definition.requiredScopes,
    metadata: adapter.definition.metadata,
    createdAt: now,
  });
}

function adapter(overrides: Partial<BusinessConnectorAdapter> = {}): BusinessConnectorAdapter {
  return {
    definition: new SyntheticOpportunityAdapter().definition,
    validateConnection: async () => ({ valid: true }),
    discoverResources: async (): Promise<ConnectorDataCategory[]> => ["opportunities"],
    fetchPage: async () => ({ records: [], complete: true }),
    ...overrides,
  };
}

async function verified(
  testAdapter: BusinessConnectorAdapter = new SyntheticOpportunityAdapter(),
  instance = instanceFor(),
  permissions = fullPermissions,
): Promise<ConnectorInstance> {
  return verifyConnectorConnection({
    instance,
    adapter: testAdapter,
    organizationId: instance.organizationId,
    grantedPermissions: permissions,
    now,
  });
}

function normalizedRecord(overrides: Partial<NormalizedOpportunity> = {}): NormalizedOpportunity {
  return {
    id: "synthetic-opportunity-fixture:demo-opportunity-003",
    organizationId,
    kind: "opportunity",
    name: "Existing opportunity",
    stage: "closed_lost",
    amount: 4200,
    currency: "EUR",
    source: {
      system: "synthetic-opportunity-fixture",
      recordId: "demo-opportunity-003",
      updatedAt: "2026-06-01T09:00:00.000Z",
      importedAt: now,
    },
    freshness: "stale",
    lifecycle: "active",
    ...overrides,
  };
}

test("connector instances validate identity and reject credentials in scopes or metadata", () => {
  assert.throws(() => createConnectorInstance({
    id: "i",
    definitionId: "d",
    organizationId,
    displayName: "Test",
    scopes: ["api_key"],
    createdAt: now,
  }), /must not contain credentials/);
  assert.throws(() => createConnectorInstance({
    id: "i",
    definitionId: "d",
    organizationId,
    displayName: "Test",
    scopes: [],
    metadata: { apiToken: "sensitive-value" },
    createdAt: now,
  }), /must not contain credential fields/);
  assert.throws(() => createConnectorInstance({
    id: "i",
    definitionId: "d",
    organizationId,
    displayName: "Test",
    scopes: [],
    metadata: { note: "sk_live_sensitive-value" },
    createdAt: now,
  }), /must not contain credential fields/);
  assert.throws(() => createConnectorInstance({
    id: "i",
    definitionId: "d",
    organizationId,
    displayName: "Test",
    scopes: [],
    metadata: { description: "Bearer sensitive-value" },
    createdAt: now,
  }), /must not contain credential fields/);
});

test("connection verification checks permission and tenant before invoking the adapter", async () => {
  let validations = 0;
  const testAdapter = adapter({ validateConnection: async () => { validations += 1; return { valid: true }; } });
  await assert.rejects(() => verifyConnectorConnection({
    instance: instanceFor(),
    adapter: testAdapter,
    organizationId,
    grantedPermissions: new Set(),
    now,
  }), /manage_integrations/);
  await assert.rejects(() => verifyConnectorConnection({
    instance: instanceFor(),
    adapter: testAdapter,
    organizationId: "another-org",
    grantedPermissions: fullPermissions,
    now,
  }), /active organization/);
  assert.equal(validations, 0);

  const unavailableAdapter = adapter({
    validateConnection: async () => ({ valid: false, errorCategory: "not_configured" }),
  });
  const notConfigured = await verified(unavailableAdapter);
  assert.equal(notConfigured.status, "failed");
  assert.equal(notConfigured.lastErrorCategory, "not_configured");

  const authorizationRequired = await verified(adapter({
    validateConnection: async () => ({ valid: false, errorCategory: "authorization_required" }),
  }));
  assert.equal(authorizationRequired.status, "awaiting_authorization");

  const throwingAdapter = adapter({
    validateConnection: async () => { throw new Error("provider token should not escape"); },
  });
  const failed = await verified(throwingAdapter);
  assert.equal(failed.status, "failed");
  assert.equal(failed.lastErrorCategory, "provider_unavailable");
});

test("synthetic sync is tenant-filtered, provenance-rich, bounded and idempotent", async () => {
  const testAdapter = new SyntheticOpportunityAdapter();
  const instance = await verified(testAdapter);
  assert.equal(instance.status, "connected_verified");
  const foreignRecord = normalizedRecord({ id: "foreign", organizationId: "other-org" });
  const first = await synchronizeConnector({
    instance,
    adapter: testAdapter,
    organizationId,
    grantedPermissions: fullPermissions,
    existingRecords: [foreignRecord],
    now,
    pageSize: 2,
  });
  assert.equal(first.status, "complete");
  assert.equal(first.inserted, 3);
  assert.equal(first.deleted, 1);
  assert.equal(first.records.length, 3);
  assert.ok(first.records.every((record) => record.organizationId === organizationId));
  assert.ok(first.records.every((record) => record.source.system === testAdapter.definition.id));
  assert.ok(first.records.every((record) => record.source.importedAt === now));
  assert.equal(first.records.find((record) => record.lifecycle === "deleted")?.freshness, "stale");

  const second = await synchronizeConnector({
    instance: first.instance,
    adapter: testAdapter,
    organizationId,
    grantedPermissions: fullPermissions,
    existingRecords: first.records,
    now,
    pageSize: 2,
  });
  assert.equal(second.status, "complete");
  assert.equal(second.inserted, 0);
  assert.equal(second.updated, 0);
  assert.equal(second.unchanged, 3);
});

test("older source updates cannot overwrite current records and deletions are retained as tombstones", async () => {
  const existingRecords = [
    normalizedRecord({
      id: "synthetic-opportunity-fixture:demo-opportunity-001",
      name: "Newer opportunity",
      stage: "proposal",
      amount: 12500,
      source: {
        system: "synthetic-opportunity-fixture",
        recordId: "demo-opportunity-001",
        updatedAt: "2026-10-24T09:00:00.000Z",
        importedAt: now,
      },
      freshness: "current",
    }),
    normalizedRecord(),
  ];
  const rawRecords: ConnectorRawRecord[] = [
    { sourceRecordId: "demo-opportunity-001", name: "Older stale overwrite", stage: "qualification", amount: 1, currency: "EUR", sourceUpdatedAt: "2026-10-23T09:00:00.000Z" },
    { sourceRecordId: "demo-opportunity-003", name: "Deleted source record", stage: "closed_lost", amount: 4200, currency: "EUR", sourceUpdatedAt: "2026-07-10T09:00:00.000Z", deleted: true },
  ];
  const testAdapter = adapter({
    fetchPage: async (): Promise<ConnectorPage> => ({ records: rawRecords, complete: true }),
  });
  const result = await synchronizeConnector({
    instance: await verified(testAdapter),
    adapter: testAdapter,
    organizationId,
    grantedPermissions: fullPermissions,
    existingRecords,
    now,
  });
  assert.equal(result.unchanged, 1);
  assert.equal(result.updated, 1);
  assert.equal(result.deleted, 1);
  assert.equal(result.records.find((record) => record.id.endsWith("demo-opportunity-001"))?.name, "Newer opportunity");
  assert.equal(result.records.find((record) => record.id.endsWith("demo-opportunity-003"))?.lifecycle, "deleted");
});

test("freshness ages from the source timestamp during later synchronization", async () => {
  const testAdapter = new SyntheticOpportunityAdapter();
  const first = await synchronizeConnector({
    instance: await verified(testAdapter),
    adapter: testAdapter,
    organizationId,
    grantedPermissions: fullPermissions,
    existingRecords: [],
    now,
  });
  assert.equal(first.records.find((record) => record.id.endsWith("demo-opportunity-001"))?.freshness, "current");

  const later = await synchronizeConnector({
    instance: first.instance,
    adapter: testAdapter,
    organizationId,
    grantedPermissions: fullPermissions,
    existingRecords: first.records,
    now: "2026-11-02T10:00:00.000Z",
  });
  assert.equal(later.records.find((record) => record.id.endsWith("demo-opportunity-001"))?.freshness, "stale");
});

test("invalid provider records fail safely instead of being normalized", async () => {
  const testAdapter = adapter({
    fetchPage: async (): Promise<ConnectorPage> => ({
      records: [{
        sourceRecordId: "x".repeat(241),
        name: "Invalid synthetic record",
        stage: "proposal",
        amount: 100,
        currency: "EUR",
        sourceUpdatedAt: now,
      }],
      complete: true,
    }),
  });
  const result = await synchronizeConnector({
    instance: await verified(testAdapter),
    adapter: testAdapter,
    organizationId,
    grantedPermissions: fullPermissions,
    existingRecords: [],
    now,
  });
  assert.equal(result.status, "failed");
  assert.equal(result.errorCategory, "invalid_data");
  assert.deepEqual(result.records, []);
});

test("synchronization enforces data permission, page limits, and page caps", async () => {
  let fetches = 0;
  const testAdapter = adapter({
    fetchPage: async (): Promise<ConnectorPage> => {
      fetches += 1;
      return { records: [], nextCursor: String(fetches), complete: false };
    },
  });
  const instance = await verified(testAdapter);
  await assert.rejects(() => synchronizeConnector({
    instance,
    adapter: testAdapter,
    organizationId,
    grantedPermissions: managerOnly,
    existingRecords: [],
    now,
  }), /view_reports/);
  await assert.rejects(() => synchronizeConnector({
    instance,
    adapter: testAdapter,
    organizationId,
    grantedPermissions: fullPermissions,
    existingRecords: [],
    now,
    pageSize: 101,
  }), /between 1 and 100/);
  assert.equal(fetches, 0);

  const capped = await synchronizeConnector({
    instance,
    adapter: testAdapter,
    organizationId,
    grantedPermissions: fullPermissions,
    existingRecords: [],
    now,
    pageSize: 1,
  });
  assert.equal(fetches, 20);
  assert.equal(capped.status, "partial");
  assert.equal(capped.instance.syncStatus, "partial");
});

test("provider failures are categorized without exposing raw messages and partial data is returned safely", async () => {
  let page = 0;
  const testAdapter = adapter({
    fetchPage: async (): Promise<ConnectorPage> => {
      page += 1;
      if (page === 1) {
        return {
          records: [{
            sourceRecordId: "partial-record",
            name: "Synthetic partial record",
            stage: "proposal",
            amount: 100,
            currency: "EUR",
            sourceUpdatedAt: now,
          }],
          nextCursor: "next",
          complete: false,
        };
      }
      throw new Error("private token value");
    },
  });
  const result = await synchronizeConnector({
    instance: await verified(testAdapter),
    adapter: testAdapter,
    organizationId,
    grantedPermissions: fullPermissions,
    existingRecords: [],
    now,
  });
  assert.equal(result.status, "partial");
  assert.equal(result.errorCategory, "provider_unavailable");
  assert.equal(result.records.length, 1);
  assert.equal(JSON.stringify(result).includes("private token value"), false);
});

test("adapter mismatch and disconnect block further synchronization", async () => {
  const testAdapter = new SyntheticOpportunityAdapter();
  const connected = await verified(testAdapter);
  const wrongAdapter = adapter({ definition: { ...testAdapter.definition, id: "other-definition" } });
  await assert.rejects(() => synchronizeConnector({
    instance: connected,
    adapter: wrongAdapter,
    organizationId,
    grantedPermissions: fullPermissions,
    existingRecords: [],
    now,
  }), /does not match/);

  const disconnected = await disconnectConnector({
    instance: connected,
    adapter: testAdapter,
    organizationId,
    grantedPermissions: fullPermissions,
    now,
  });
  assert.equal(disconnected.status, "disconnected");
  await assert.rejects(() => synchronizeConnector({
    instance: disconnected,
    adapter: testAdapter,
    organizationId,
    grantedPermissions: fullPermissions,
    existingRecords: [],
    now,
  }), /verified before synchronization/);
});

test("external provider catalogue does not claim connections, sync activity, or successful mock operations", async () => {
  const state = createDefaultIntegrationState();
  assert.ok(state.connectedSystems.every((system) =>
    system.mock
    && system.authState === "required"
    && system.health === "auth-required"
    && system.lastSync === "never"
    && system.synchronizedObjects === 0
  ));
  assert.ok(state.availableIntegrations.every((integration) => integration.status === "available"));
  assert.deepEqual(state.syncJobs, []);
  assert.deepEqual(state.activities, []);
  assert.deepEqual(state.logs, []);
  assert.ok(state.touchpoints.every((touchpoint) => touchpoint.state === "planned"));

  for (const integrationAdapter of listIntegrationAdapters()) {
    await assert.rejects(() => integrationAdapter.connect(), /no provider authorization implementation/);
    await assert.rejects(() => integrationAdapter.sync(), /no provider synchronization implementation/);
  }
});
