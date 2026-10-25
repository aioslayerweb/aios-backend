import type { PermissionKey } from "@/src/domain/security";

export type BusinessMemoryType =
  | "business_fact"
  | "decision"
  | "commitment"
  | "event"
  | "policy"
  | "knowledge_reference"
  | "business_context"
  | "lesson_learned";
export type BusinessMemorySourceType = "manual" | "system" | "document" | "report" | "workflow" | "decision";
export type BusinessMemoryStatus = "active" | "superseded" | "obsolete" | "archived";
export type BusinessMemoryVerification = "verified" | "unverified" | "conflicted" | "ai_generated";
export type BusinessMemorySensitivity = "public" | "internal" | "confidential" | "restricted";

type MemoryContentByType = {
  business_fact: { statement: string; value?: string; unit?: string };
  decision: { statement: string; rationale: string; outcome: "pending" | "approved" | "rejected" | "reversed" | "unknown" };
  commitment: { statement: string; owner?: string; dueAt?: string; commitmentStatus: "open" | "completed" | "cancelled" };
  event: { statement: string };
  policy: { statement: string; version: string };
  knowledge_reference: { statement: string; locator?: string };
  business_context: { statement: string };
  lesson_learned: { statement: string; outcome?: string };
};

export type BusinessMemoryRecord = {
  [Type in BusinessMemoryType]: {
    id: string;
    organizationId: string;
    type: Type;
    title: string;
    content: MemoryContentByType[Type];
    source: { type: BusinessMemorySourceType; label: string; recordId: string };
    createdAt: string;
    updatedAt: string;
    effectivePeriod?: { from: string; to?: string };
    author?: string;
    verification: BusinessMemoryVerification;
    confidence?: number;
    sensitivity: BusinessMemorySensitivity;
    requiredPermissions: PermissionKey[];
    entity?: { type: string; id: string; department?: string };
    relatedRecordIds: string[];
    relatedIntelligenceIds: string[];
    conflictKey?: string;
    status: BusinessMemoryStatus;
    reviewAt?: string;
    expiresAt?: string;
  };
}[BusinessMemoryType];

export type BusinessMemoryAuditEntry = {
  id: string;
  recordId: string;
  organizationId: string;
  actorId: string;
  action: "created" | "updated" | "archived" | "linked";
  changedFields: string[];
  occurredAt: string;
};

export type BusinessMemoryState = {
  records: BusinessMemoryRecord[];
  history: BusinessMemoryAuditEntry[];
};

export type BusinessContextRequest = {
  organizationId: string;
  grantedPermissions: ReadonlySet<PermissionKey>;
  question: string;
  asOf: number;
  intelligenceId?: string;
  entity?: { type: string; id: string };
  period?: { from: number; to: number };
  sourceTypes?: readonly BusinessMemorySourceType[];
  maxRecords?: number;
};

export type BusinessMemorySearchRequest = {
  organizationId: string;
  grantedPermissions: ReadonlySet<PermissionKey>;
  query?: string;
  type?: BusinessMemoryType;
  sourceType?: BusinessMemorySourceType;
  status?: BusinessMemoryStatus;
  createdAfter?: number;
  createdBefore?: number;
};

export type BusinessContextEvidence = {
  record: BusinessMemoryRecord;
  relevance: number;
  stale: boolean;
  conflicting: boolean;
  relevanceReason: string;
};

export type BusinessContextPackage = {
  evidence: BusinessContextEvidence[];
  citations: Array<{ recordId: string; sourceLabel: string; sourceRecordId: string }>;
  evidenceGaps: string[];
  period: { from: string | null; to: string | null };
  retrieval: "deterministic_text_and_metadata";
};

const memoryTypes = new Set<string>([
  "business_fact", "decision", "commitment", "event", "policy", "knowledge_reference", "business_context", "lesson_learned",
]);
const sourceTypes = new Set<string>(["manual", "system", "document", "report", "workflow", "decision"]);
const statuses = new Set<string>(["active", "superseded", "obsolete", "archived"]);
const verifications = new Set<string>(["verified", "unverified", "conflicted", "ai_generated"]);
const sensitivities = new Set<string>(["public", "internal", "confidential", "restricted"]);
const permissions = new Set<string>([
  "view_dashboard", "manage_agents", "manage_memory", "manage_users", "manage_roles", "manage_workflows",
  "manage_integrations", "view_audit_logs", "manage_api_keys", "export_data", "manage_policies",
  "manage_sessions", "manage_departments", "manage_teams", "manage_organizations", "manage_workspaces",
  "view_runtime", "manage_runtime", "approve_decisions", "view_reports", "manage_knowledge",
  "manage_billing", "manage_ai_models", "execute_workflow",
]);
const contentKeys: Record<BusinessMemoryType, readonly string[]> = {
  business_fact: ["statement", "value", "unit"],
  decision: ["statement", "rationale", "outcome"],
  commitment: ["statement", "owner", "dueAt", "commitmentStatus"],
  event: ["statement"],
  policy: ["statement", "version"],
  knowledge_reference: ["statement", "locator"],
  business_context: ["statement"],
  lesson_learned: ["statement", "outcome"],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isTimestamp(value: unknown): value is string {
  return isText(value) && Number.isFinite(Date.parse(value));
}

function isBusinessMemoryType(value: unknown): value is BusinessMemoryType {
  return typeof value === "string" && memoryTypes.has(value);
}

function isValidContent(type: BusinessMemoryType, content: Record<string, unknown>): boolean {
  if (Object.keys(content).some((key) => !contentKeys[type].includes(key)) || !isText(content.statement)) return false;
  switch (type) {
    case "decision":
      return isText(content.rationale) && ["pending", "approved", "rejected", "reversed", "unknown"].includes(String(content.outcome));
    case "commitment":
      return (content.commitmentStatus === "open" || content.commitmentStatus === "completed" || content.commitmentStatus === "cancelled")
        && (content.owner === undefined || isText(content.owner))
        && (content.dueAt === undefined || isTimestamp(content.dueAt));
    case "policy":
      return isText(content.version);
    case "business_fact":
      return (content.value === undefined || isText(content.value)) && (content.unit === undefined || isText(content.unit));
    case "knowledge_reference":
      return content.locator === undefined || isText(content.locator);
    case "lesson_learned":
      return content.outcome === undefined || isText(content.outcome);
    case "event":
    case "business_context":
      return true;
  }
}

function isBusinessMemoryRecord(value: unknown): value is BusinessMemoryRecord {
  if (!isRecord(value)
    || !isText(value.id)
    || !isText(value.organizationId)
    || !isBusinessMemoryType(value.type)
    || !isText(value.title)
    || !isRecord(value.content)
    || !isValidContent(value.type, value.content)
    || !isRecord(value.source)
    || typeof value.source.type !== "string"
    || !sourceTypes.has(value.source.type)
    || !isText(value.source.label)
    || !isText(value.source.recordId)
    || !isTimestamp(value.createdAt)
    || !isTimestamp(value.updatedAt)
    || typeof value.verification !== "string"
    || !verifications.has(value.verification)
    || typeof value.sensitivity !== "string"
    || !sensitivities.has(value.sensitivity)
    || !Array.isArray(value.requiredPermissions)
    || !value.requiredPermissions.every((permission) => typeof permission === "string" && permissions.has(permission))
    || !Array.isArray(value.relatedRecordIds)
    || !value.relatedRecordIds.every(isText)
    || !Array.isArray(value.relatedIntelligenceIds)
    || !value.relatedIntelligenceIds.every(isText)
    || typeof value.status !== "string"
    || !statuses.has(value.status)
    || (value.author !== undefined && !isText(value.author))
    || (value.confidence !== undefined && (typeof value.confidence !== "number" || !Number.isFinite(value.confidence) || value.confidence < 0 || value.confidence > 100))
    || (value.reviewAt !== undefined && !isTimestamp(value.reviewAt))
    || (value.expiresAt !== undefined && !isTimestamp(value.expiresAt))) return false;
  if ((value.sensitivity === "confidential" || value.sensitivity === "restricted")
    && !value.requiredPermissions.includes("view_reports")) return false;
  if (value.effectivePeriod !== undefined && (!isRecord(value.effectivePeriod)
    || !isTimestamp(value.effectivePeriod.from)
    || (value.effectivePeriod.to !== undefined && !isTimestamp(value.effectivePeriod.to))
    || (value.effectivePeriod.to !== undefined && Date.parse(value.effectivePeriod.to) < Date.parse(value.effectivePeriod.from)))) return false;
  return value.entity === undefined || (isRecord(value.entity) && isText(value.entity.type) && isText(value.entity.id)
    && (value.entity.department === undefined || isText(value.entity.department)));
}

export function validateBusinessMemoryRecord(value: unknown): BusinessMemoryRecord {
  if (!isBusinessMemoryRecord(value)) throw new TypeError("Business memory record does not match the supported schema.");
  return value;
}

function requirePermission(granted: ReadonlySet<PermissionKey>, permission: PermissionKey): void {
  if (!granted.has(permission)) throw new Error(`Permission required: ${permission}.`);
}

function canRead(record: BusinessMemoryRecord, organizationId: string, granted: ReadonlySet<PermissionKey>): boolean {
  return record.organizationId === organizationId && record.requiredPermissions.every((permission) => granted.has(permission));
}

export function getAuthorizedBusinessMemoryById(
  records: readonly BusinessMemoryRecord[],
  id: string,
  organizationId: string,
  granted: ReadonlySet<PermissionKey>,
): BusinessMemoryRecord | undefined {
  if (!isText(id) || !isText(organizationId)) throw new TypeError("A record and organization ID are required.");
  return records.map(validateBusinessMemoryRecord).find((record) => record.id === id && canRead(record, organizationId, granted));
}

export function searchAuthorizedBusinessMemory(
  records: readonly BusinessMemoryRecord[],
  request: BusinessMemorySearchRequest,
): BusinessMemoryRecord[] {
  if (!isText(request.organizationId)) throw new TypeError("An organization ID is required for memory search.");
  if ((request.type !== undefined && !memoryTypes.has(request.type))
    || (request.sourceType !== undefined && !sourceTypes.has(request.sourceType))
    || (request.status !== undefined && !statuses.has(request.status))) {
    throw new TypeError("Memory search filters contain an unsupported value.");
  }
  if ((request.createdAfter !== undefined && request.createdBefore !== undefined && request.createdAfter > request.createdBefore)) {
    throw new RangeError("Memory search date range is invalid.");
  }
  if (request.createdAfter !== undefined && !Number.isFinite(request.createdAfter)) throw new RangeError("Created-after date must be a valid timestamp.");
  if (request.createdBefore !== undefined && !Number.isFinite(request.createdBefore)) throw new RangeError("Created-before date must be a valid timestamp.");
  if (request.createdAfter !== undefined && request.createdBefore !== undefined && request.createdAfter > request.createdBefore) {
    throw new RangeError("Memory search date range is invalid.");
  }
  const queryTokens = tokenize(request.query ?? "");
  return records.map(validateBusinessMemoryRecord)
    .filter((record) => canRead(record, request.organizationId, request.grantedPermissions))
    .filter((record) => request.type === undefined || record.type === request.type)
    .filter((record) => request.sourceType === undefined || record.source.type === request.sourceType)
    .filter((record) => request.status === undefined || record.status === request.status)
    .filter((record) => request.createdAfter === undefined || Date.parse(record.createdAt) >= request.createdAfter)
    .filter((record) => request.createdBefore === undefined || Date.parse(record.createdAt) <= request.createdBefore)
    .filter((record) => {
      if (!queryTokens.length) return true;
      const searchable = tokenize([
        record.title,
        record.content.statement,
        record.type,
        record.source.label,
        record.source.recordId,
        record.entity?.department ?? "",
        record.relatedRecordIds.join(" "),
      ].join(" "));
      return queryTokens.every((token) => searchable.includes(token));
    })
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt) || a.id.localeCompare(b.id));
}

function assertMutableRecord(
  record: BusinessMemoryRecord | undefined,
  organizationId: string,
  granted: ReadonlySet<PermissionKey>,
): asserts record is BusinessMemoryRecord {
  requirePermission(granted, "manage_memory");
  if (!record || !canRead(record, organizationId, granted)) throw new Error("Business memory record not found.");
}

function auditEntry(
  record: BusinessMemoryRecord,
  actorId: string,
  action: BusinessMemoryAuditEntry["action"],
  changedFields: string[],
  occurredAt: string,
): BusinessMemoryAuditEntry {
  if (!isText(actorId) || !isTimestamp(occurredAt)) throw new TypeError("A valid actor and audit timestamp are required.");
  return {
    id: `${record.id}:${action}:${occurredAt}`,
    recordId: record.id,
    organizationId: record.organizationId,
    actorId,
    action,
    changedFields,
    occurredAt,
  };
}

export function createBusinessMemory(
  state: BusinessMemoryState,
  record: BusinessMemoryRecord,
  organizationId: string,
  granted: ReadonlySet<PermissionKey>,
  actorId: string,
  occurredAt: string,
): BusinessMemoryState {
  requirePermission(granted, "manage_memory");
  const validated = validateBusinessMemoryRecord(record);
  if (validated.organizationId !== organizationId) throw new Error("Cannot create business memory outside the active organization.");
  if (state.records.some((current) => current.id === validated.id)) {
    throw new Error("Business memory record already exists.");
  }
  return {
    records: [validated, ...state.records],
    history: [auditEntry(validated, actorId, "created", ["record"], occurredAt), ...state.history],
  };
}

export function updateBusinessMemory(
  state: BusinessMemoryState,
  id: string,
  organizationId: string,
  granted: ReadonlySet<PermissionKey>,
  actorId: string,
  occurredAt: string,
  patch: { title?: string; statement?: string; status?: BusinessMemoryStatus },
): BusinessMemoryState {
  const current = state.records.find((record) => record.id === id && record.organizationId === organizationId);
  assertMutableRecord(current, organizationId, granted);
  if (patch.statement !== undefined && current.verification === "verified") {
    throw new Error("Verified historical statements cannot be rewritten; create a superseding record instead.");
  }
  const updated = validateBusinessMemoryRecord({
    ...current,
    ...(patch.title === undefined ? {} : { title: patch.title }),
    ...(patch.statement === undefined ? {} : { content: { ...current.content, statement: patch.statement } }),
    ...(patch.status === undefined ? {} : { status: patch.status }),
    updatedAt: occurredAt,
  });
  const changedFields = [
    ...(patch.title === undefined ? [] : ["title"]),
    ...(patch.statement === undefined ? [] : ["statement"]),
    ...(patch.status === undefined ? [] : ["status"]),
  ];
  return {
    records: state.records.map((record) => record.id === id && record.organizationId === organizationId ? updated : record),
    history: changedFields.length
      ? [auditEntry(updated, actorId, "updated", changedFields, occurredAt), ...state.history]
      : state.history,
  };
}

export function archiveBusinessMemory(
  state: BusinessMemoryState,
  id: string,
  organizationId: string,
  granted: ReadonlySet<PermissionKey>,
  actorId: string,
  occurredAt: string,
): BusinessMemoryState {
  const archivedState = updateBusinessMemory(state, id, organizationId, granted, actorId, occurredAt, { status: "archived" });
  const archived = archivedState.records.find((record) => record.id === id && record.organizationId === organizationId);
  if (!archived) throw new Error("Business memory record not found.");
  return {
    ...archivedState,
    history: [
      auditEntry(archived, actorId, "archived", ["status"], occurredAt),
      ...state.history,
    ],
  };
}

export function linkBusinessMemory(
  state: BusinessMemoryState,
  fromId: string,
  toId: string,
  organizationId: string,
  granted: ReadonlySet<PermissionKey>,
  actorId: string,
  occurredAt: string,
): BusinessMemoryState {
  if (fromId === toId) throw new Error("A business memory record cannot be linked to itself.");
  const from = state.records.find((record) => record.id === fromId && record.organizationId === organizationId);
  const to = state.records.find((record) => record.id === toId && record.organizationId === organizationId);
  assertMutableRecord(from, organizationId, granted);
  assertMutableRecord(to, organizationId, granted);
  const updatedFrom = validateBusinessMemoryRecord({ ...from, relatedRecordIds: Array.from(new Set([...from.relatedRecordIds, to.id])), updatedAt: occurredAt });
  const updatedTo = validateBusinessMemoryRecord({ ...to, relatedRecordIds: Array.from(new Set([...to.relatedRecordIds, from.id])), updatedAt: occurredAt });
  return {
    records: state.records.map((record) => record.id === from.id && record.organizationId === organizationId
      ? updatedFrom
      : record.id === to.id && record.organizationId === organizationId
        ? updatedTo
        : record),
    history: [
      auditEntry(updatedFrom, actorId, "linked", ["relatedRecordIds"], occurredAt),
      auditEntry(updatedTo, actorId, "linked", ["relatedRecordIds"], occurredAt),
      ...state.history,
    ],
  };
}

function tokenize(value: string): string[] {
  return value.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 2);
}

function isStale(record: BusinessMemoryRecord, asOf: number): boolean {
  const periodExpired = record.effectivePeriod?.to !== undefined && Date.parse(record.effectivePeriod.to) < asOf;
  return record.status !== "active"
    || record.verification === "unverified"
    || record.verification === "conflicted"
    || periodExpired
    || (record.reviewAt !== undefined && Date.parse(record.reviewAt) < asOf)
    || (record.expiresAt !== undefined && Date.parse(record.expiresAt) < asOf);
}

export function retrieveBusinessContext(
  records: readonly BusinessMemoryRecord[],
  request: BusinessContextRequest,
): BusinessContextPackage {
  if (!isText(request.organizationId) || !Number.isFinite(request.asOf) || request.asOf <= 0) {
    throw new TypeError("A valid organization and as-of timestamp are required for context retrieval.");
  }
  if (typeof request.question !== "string"
    || (request.intelligenceId !== undefined && !isText(request.intelligenceId))
    || (request.entity !== undefined && (!isText(request.entity.type) || !isText(request.entity.id)))
    || request.sourceTypes?.some((sourceType) => !sourceTypes.has(sourceType))) {
    throw new TypeError("Context request contains invalid relevance or source filters.");
  }
  if (request.period && (!Number.isFinite(request.period.from) || !Number.isFinite(request.period.to) || request.period.from > request.period.to)) {
    throw new RangeError("Context period is invalid.");
  }
  const maxRecords = request.maxRecords ?? 6;
  if (!Number.isInteger(maxRecords) || maxRecords < 1 || maxRecords > 20) throw new RangeError("Context size must be between 1 and 20 records.");

  const authorized = records.map(validateBusinessMemoryRecord)
    .filter((record) => canRead(record, request.organizationId, request.grantedPermissions))
    .filter((record) => record.status === "active")
    .filter((record) => !request.sourceTypes || request.sourceTypes.includes(record.source.type))
    .filter((record) => !request.period || (
      (!record.effectivePeriod?.to || Date.parse(record.effectivePeriod.to) >= request.period.from)
      && (!record.effectivePeriod || Date.parse(record.effectivePeriod.from) <= request.period.to)
    ));

  const questionTokens = new Set(tokenize(request.question));
  const candidates = authorized.flatMap((record) => {
    const linkedToSignal = request.intelligenceId !== undefined && record.relatedIntelligenceIds.includes(request.intelligenceId);
    const matchesEntity = request.entity !== undefined && record.entity?.type === request.entity.type && record.entity.id === request.entity.id;
    if (request.intelligenceId && !linkedToSignal) return [];
    if (!request.intelligenceId && request.entity && !matchesEntity) return [];
    if (!request.intelligenceId && !request.entity && !request.question.trim()) return [];
    const text = `${record.title} ${record.content.statement} ${record.type} ${record.entity?.department ?? ""}`;
    const matchedTokens = tokenize(text).filter((token) => questionTokens.has(token));
    const relevance = linkedToSignal ? 100 : matchesEntity ? 90 : Math.min(80, matchedTokens.length * 20);
    if (relevance === 0) return [];
    return [{
      record,
      relevance,
      stale: isStale(record, request.asOf),
      conflicting: record.verification === "conflicted",
      relevanceReason: linkedToSignal ? "Linked to this intelligence signal"
        : matchesEntity ? "Matches the referenced business entity"
          : `Matches ${matchedTokens.length} question terms`,
      conflictKey: record.conflictKey,
    }];
  }).sort((a, b) =>
    b.relevance - a.relevance
    || Number(isStale(a.record, request.asOf)) - Number(isStale(b.record, request.asOf))
    || Number(b.record.verification === "verified") - Number(a.record.verification === "verified")
    || (b.record.confidence ?? 0) - (a.record.confidence ?? 0)
    || Date.parse(b.record.updatedAt) - Date.parse(a.record.updatedAt)
    || a.record.id.localeCompare(b.record.id)
  );

  const conflictCounts = new Map<string, number>();
  for (const candidate of candidates) {
    if (candidate.conflictKey) conflictCounts.set(candidate.conflictKey, (conflictCounts.get(candidate.conflictKey) ?? 0) + 1);
  }
  const evidence = candidates.slice(0, maxRecords).map(({ conflictKey, ...candidate }) => ({
    ...candidate,
    conflicting: candidate.conflicting || (conflictKey !== undefined && (conflictCounts.get(conflictKey) ?? 0) > 1),
  }));
  const evidenceGaps: string[] = [];
  if (!evidence.length) evidenceGaps.push("No authorized, relevant business memory is available for this question.");
  if (evidence.some((item) => item.stale)) evidenceGaps.push("Some matching memory is stale, unverified, superseded, or due for review.");
  if (evidence.some((item) => item.conflicting)) evidenceGaps.push("Conflicting sources exist; no source was selected as authoritative.");
  if (evidence.some((item) => item.record.verification === "ai_generated")) evidenceGaps.push("AI-generated context is not verified business fact.");
  if (evidence.some((item) => !item.record.effectivePeriod)) evidenceGaps.push("Some records do not specify the period to which they apply.");

  const dates = evidence.flatMap((item) => item.record.effectivePeriod
    ? [item.record.effectivePeriod.from, ...(item.record.effectivePeriod.to ? [item.record.effectivePeriod.to] : [])]
    : []).sort((a, b) => Date.parse(a) - Date.parse(b));
  return {
    evidence,
    citations: evidence.map((item) => ({
      recordId: item.record.id,
      sourceLabel: item.record.source.label,
      sourceRecordId: item.record.source.recordId,
    })),
    evidenceGaps,
    period: { from: dates[0] ?? null, to: dates[dates.length - 1] ?? null },
    retrieval: "deterministic_text_and_metadata",
  };
}
