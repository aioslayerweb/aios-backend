import type { PermissionKey } from "@/src/domain/security";
import type {
  BusinessConnectorAdapter,
  ConnectorErrorCategory,
  ConnectorInstance,
  ConnectorPage,
  ConnectorSyncResult,
  NormalizedOpportunity,
} from "./connector-types";

const MAX_PAGE_SIZE = 100;
const MAX_PAGES = 20;
const MAX_NAME_LENGTH = 240;
const MAX_SOURCE_ID_LENGTH = 240;

function assertAdapterMatches(instance: ConnectorInstance, adapter: BusinessConnectorAdapter): void {
  if (instance.definitionId !== adapter.definition.id) throw new Error("Connector definition does not match the adapter.");
}

export function createConnectorInstance(input: {
  id: string;
  definitionId: string;
  organizationId: string;
  displayName: string;
  scopes: string[];
  metadata?: Record<string, string>;
  createdAt: string;
}): ConnectorInstance {
  if (!input.id.trim() || !input.definitionId.trim() || !input.organizationId.trim()
    || !input.displayName.trim() || input.displayName.length > MAX_NAME_LENGTH) {
    throw new TypeError("Connector identity and organization are required.");
  }
  if (!Number.isFinite(Date.parse(input.createdAt))) throw new TypeError("Connector creation timestamp is invalid.");
  if (!Array.isArray(input.scopes)
    || input.scopes.some((scope) => typeof scope !== "string" || !scope.trim() || /token|secret|password|credential|api.?key/i.test(scope))) {
    throw new TypeError("Connector scopes must not contain credentials.");
  }
  if (input.metadata !== undefined && (typeof input.metadata !== "object" || input.metadata === null || Array.isArray(input.metadata))) {
    throw new TypeError("Connector metadata must be a flat object.");
  }
  if (Object.entries(input.metadata ?? {}).some(([key, value]) =>
    /token|secret|password|credential|authorization|(?:api|private|access|client)[._ -]?key/i.test(key)
    || typeof value !== "string"
    || /(?:bearer\s+\S+|(?:access|refresh)?_?token\s*[:=]|api[_ -]?key\s*[:=]|secret\s*[:=]|password\s*[:=]|\b(?:sk|pk|rk)_(?:live|test)_[A-Za-z0-9]+|(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}|xox[baprs]-[A-Za-z0-9-]{10,})/i.test(value)
  )) {
    throw new TypeError("Connector metadata must not contain credential fields.");
  }
  return {
    id: input.id,
    definitionId: input.definitionId,
    organizationId: input.organizationId,
    displayName: input.displayName,
    status: "not_connected",
    syncStatus: "idle",
    scopes: [...input.scopes],
    createdAt: input.createdAt,
    updatedAt: input.createdAt,
    metadata: { ...(input.metadata ?? {}) },
  };
}

function requirePermission(granted: ReadonlySet<PermissionKey>, permission: PermissionKey): void {
  if (!granted.has(permission)) throw new Error(`Permission required: ${permission}.`);
}

export async function verifyConnectorConnection(input: {
  instance: ConnectorInstance;
  adapter: BusinessConnectorAdapter;
  organizationId: string;
  grantedPermissions: ReadonlySet<PermissionKey>;
  now: string;
}): Promise<ConnectorInstance> {
  requirePermission(input.grantedPermissions, "manage_integrations");
  if (input.instance.organizationId !== input.organizationId) throw new Error("Connector not found for the active organization.");
  assertAdapterMatches(input.instance, input.adapter);
  if (!Number.isFinite(Date.parse(input.now))) throw new TypeError("Connection validation timestamp is invalid.");
  const initiating: ConnectorInstance = { ...input.instance, status: "connection_initiated", updatedAt: input.now };
  let result: Awaited<ReturnType<BusinessConnectorAdapter["validateConnection"]>>;
  try {
    result = await input.adapter.validateConnection(initiating);
  } catch (error) {
    return {
      ...initiating,
      status: "failed",
      lastErrorCategory: sanitizeFailure(error),
    };
  }
  if (!result || typeof result !== "object" || typeof result.valid !== "boolean") {
    return {
      ...initiating,
      status: "failed",
      lastErrorCategory: "invalid_data",
    };
  }
  if (!result.valid) {
    const category = result.errorCategory ? sanitizeFailure({ category: result.errorCategory }) : "not_configured";
    const authorizationStatus = input.instance.status === "connected_verified"
      ? "reauthorization_required"
      : "awaiting_authorization";
    return {
      ...initiating,
      status: category === "authorization_required"
        ? authorizationStatus
        : "failed",
      lastErrorCategory: category,
    };
  }
  return {
    ...initiating,
    status: "connected_verified",
    updatedAt: input.now,
    lastErrorCategory: undefined,
  };
}

function sanitizeFailure(error: unknown): ConnectorErrorCategory {
  if (error && typeof error === "object" && "category" in error) {
    const category = (error as { category?: unknown }).category;
    if (category === "not_configured"
      || category === "authorization_required"
      || category === "forbidden"
      || category === "rate_limited"
      || category === "provider_unavailable"
      || category === "invalid_data"
      || category === "disconnected"
      || category === "unknown") {
      return category;
    }
  }
  return "provider_unavailable";
}

function normalizeRecord(
  raw: ConnectorPage["records"][number],
  instance: ConnectorInstance,
  adapter: BusinessConnectorAdapter,
  importedAt: string,
  staleAfterMs: number,
): NormalizedOpportunity {
  if (!raw
    || typeof raw !== "object"
    || typeof raw.sourceRecordId !== "string"
    || typeof raw.name !== "string"
    || typeof raw.stage !== "string"
    || typeof raw.currency !== "string"
    || typeof raw.sourceUpdatedAt !== "string"
    || !raw.sourceRecordId.trim()
    || raw.sourceRecordId.length > MAX_SOURCE_ID_LENGTH
    || !raw.name.trim()
    || raw.name.length > MAX_NAME_LENGTH
    || (raw.deleted !== undefined && typeof raw.deleted !== "boolean")
    || !["qualification", "proposal", "negotiation", "closed_won", "closed_lost"].includes(raw.stage)
    || !Number.isFinite(raw.amount)
    || raw.amount < 0
    || !/^[A-Z]{3}$/.test(raw.currency)
    || !Number.isFinite(Date.parse(raw.sourceUpdatedAt))) {
    throw Object.assign(new Error("Connector returned invalid normalized data."), { category: "invalid_data" });
  }
  const sourceUpdatedAt = new Date(raw.sourceUpdatedAt).toISOString();
  const importedTimestamp = Date.parse(importedAt);
  return {
    id: `${adapter.definition.id}:${raw.sourceRecordId}`,
    organizationId: instance.organizationId,
    kind: "opportunity",
    name: raw.name.trim(),
    stage: raw.stage,
    amount: raw.amount,
    currency: raw.currency,
    source: {
      system: adapter.definition.id,
      recordId: raw.sourceRecordId,
      updatedAt: sourceUpdatedAt,
      importedAt,
    },
    freshness: importedTimestamp - Date.parse(sourceUpdatedAt) > staleAfterMs ? "stale" : "current",
    lifecycle: raw.deleted === true ? "deleted" : "active",
  };
}

export async function synchronizeConnector(input: {
  instance: ConnectorInstance;
  adapter: BusinessConnectorAdapter;
  organizationId: string;
  grantedPermissions: ReadonlySet<PermissionKey>;
  existingRecords: readonly NormalizedOpportunity[];
  now: string;
  pageSize?: number;
  staleAfterMs?: number;
}): Promise<ConnectorSyncResult> {
  requirePermission(input.grantedPermissions, "manage_integrations");
  if (input.instance.organizationId !== input.organizationId) throw new Error("Connector not found for the active organization.");
  assertAdapterMatches(input.instance, input.adapter);
  if (input.instance.status !== "connected_verified") {
    throw new Error("Connector must be verified before synchronization.");
  }
  if (!Number.isFinite(Date.parse(input.now))) throw new TypeError("Synchronization timestamp is invalid.");
  requirePermission(input.grantedPermissions, input.adapter.definition.dataPermission);
  const pageSize = input.pageSize ?? 50;
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > MAX_PAGE_SIZE) throw new RangeError("Page size must be between 1 and 100.");
  const staleAfterMs = input.staleAfterMs ?? 7 * 86_400_000;
  if (!Number.isFinite(staleAfterMs) || staleAfterMs < 0) throw new RangeError("Freshness threshold cannot be negative.");

  let instance: ConnectorInstance = { ...input.instance, status: "synchronizing", syncStatus: "running", lastAttemptedSyncAt: input.now, updatedAt: input.now };
  const records = new Map<string, NormalizedOpportunity>();
  for (const existing of input.existingRecords) {
    if (existing.organizationId === input.organizationId) {
      records.set(existing.id, {
        ...existing,
        freshness: Date.parse(input.now) - Date.parse(existing.source.updatedAt) > staleAfterMs ? "stale" : "current",
      });
    }
  }
  let inserted = 0;
  let updated = 0;
  let unchanged = 0;
  let deleted = 0;
  let cursor: string | undefined;
  let complete = false;
  let pageCount = 0;
  let errorCategory: ConnectorErrorCategory | undefined;

  try {
    const resources = await input.adapter.discoverResources();
    if (!Array.isArray(resources) || !resources.includes("opportunities")) {
      throw Object.assign(new Error("Required resource is unavailable."), { category: "invalid_data" });
    }
    while (!complete && pageCount < MAX_PAGES) {
      const page = await input.adapter.fetchPage({ instance, category: "opportunities", cursor, limit: pageSize });
      if (!page || typeof page !== "object" || !Array.isArray(page.records) || typeof page.complete !== "boolean"
        || (page.nextCursor !== undefined && (typeof page.nextCursor !== "string" || !page.nextCursor))) {
        throw Object.assign(new Error("Connector returned an invalid page."), { category: "invalid_data" });
      }
      if (page.records.length > pageSize) throw Object.assign(new Error("Connector exceeded the requested page size."), { category: "invalid_data" });
      for (const raw of page.records) {
        const normalized = normalizeRecord(raw, instance, input.adapter, input.now, staleAfterMs);
        if (normalized.organizationId !== input.organizationId) throw Object.assign(new Error("Connector record organization scope mismatch."), { category: "forbidden" });
        const existing = records.get(normalized.id);
        if (!existing) inserted += 1;
        else if (Date.parse(normalized.source.updatedAt) < Date.parse(existing.source.updatedAt)) {
          unchanged += 1;
          continue;
        } else if (Date.parse(normalized.source.updatedAt) === Date.parse(existing.source.updatedAt)
          && normalized.name === existing.name
          && normalized.stage === existing.stage
          && normalized.amount === existing.amount
          && normalized.currency === existing.currency
          && normalized.freshness === existing.freshness
          && normalized.lifecycle === existing.lifecycle) {
          unchanged += 1;
          continue;
        } else updated += 1;
        if (normalized.lifecycle === "deleted") deleted += 1;
        records.set(normalized.id, normalized);
      }
      pageCount += 1;
      complete = page.complete;
      cursor = page.nextCursor;
      if (!complete && !cursor) throw Object.assign(new Error("Connector pagination cursor is missing."), { category: "invalid_data" });
    }
  } catch (error) {
    errorCategory = sanitizeFailure(error);
  }

  const status: ConnectorSyncResult["status"] = errorCategory
    ? (inserted + updated + deleted > 0 ? "partial" : "failed")
    : complete ? "complete" : "partial";
  instance = {
    ...instance,
    status: errorCategory ? (errorCategory === "authorization_required" ? "reauthorization_required" : "temporarily_degraded") : "connected_verified",
    syncStatus: status,
    updatedAt: input.now,
    ...(status === "complete" ? { lastSuccessfulSyncAt: input.now } : {}),
    ...(errorCategory ? { lastErrorCategory: errorCategory } : { lastErrorCategory: undefined }),
  };
  return {
    instance,
    records: Array.from(records.values()).filter((record) => record.organizationId === input.organizationId),
    inserted,
    updated,
    unchanged,
    deleted,
    status,
    ...(errorCategory ? { errorCategory } : {}),
  };
}

export async function disconnectConnector(input: {
  instance: ConnectorInstance;
  adapter: BusinessConnectorAdapter;
  organizationId: string;
  grantedPermissions: ReadonlySet<PermissionKey>;
  now: string;
}): Promise<ConnectorInstance> {
  requirePermission(input.grantedPermissions, "manage_integrations");
  if (input.instance.organizationId !== input.organizationId) throw new Error("Connector not found for the active organization.");
  assertAdapterMatches(input.instance, input.adapter);
  if (!Number.isFinite(Date.parse(input.now))) throw new TypeError("Disconnect timestamp is invalid.");
  try {
    await input.adapter.disconnect?.(input.instance);
  } catch (error) {
    return {
      ...input.instance,
      status: "temporarily_degraded",
      updatedAt: input.now,
      lastErrorCategory: sanitizeFailure(error),
    };
  }
  return {
    ...input.instance,
    status: "disconnected",
    syncStatus: "idle",
    updatedAt: input.now,
    lastErrorCategory: undefined,
  };
}
