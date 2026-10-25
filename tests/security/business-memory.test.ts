import assert from "node:assert/strict";
import { test } from "node:test";
import {
  archiveBusinessMemory,
  createBusinessMemory,
  getAuthorizedBusinessMemoryById,
  linkBusinessMemory,
  retrieveBusinessContext,
  searchAuthorizedBusinessMemory,
  updateBusinessMemory,
  validateBusinessMemoryRecord,
  type BusinessMemoryRecord,
  type BusinessMemoryState,
} from "@/lib/business-memory/business-memory-engine";
import { demoBusinessMemory } from "@/lib/business-memory/demo-fixtures";
import type { PermissionKey } from "@/src/domain/security";

const now = Date.parse("2026-10-25T10:00:00.000Z");
const readOnly = new Set<PermissionKey>(["view_dashboard"]);
const financeReadOnly = new Set<PermissionKey>(["view_dashboard", "view_reports"]);
const memoryManager = new Set<PermissionKey>(["view_dashboard", "manage_memory"]);
const fullManager = new Set<PermissionKey>(["view_dashboard", "view_reports", "manage_memory"]);
const initialState: BusinessMemoryState = { records: demoBusinessMemory, history: [] };

function request(overrides: Partial<Parameters<typeof retrieveBusinessContext>[1]> = {}) {
  return retrieveBusinessContext(demoBusinessMemory, {
    organizationId: "org-1",
    grantedPermissions: readOnly,
    question: "Customer renewal intent",
    intelligenceId: "demo-rbi-a3",
    entity: { type: "business_signal", id: "a3" },
    asOf: now,
    ...overrides,
  });
}

function newNote(id: string, organizationId = "org-1"): BusinessMemoryRecord {
  return {
    id,
    organizationId,
    type: "business_context",
    title: "A local note",
    content: { statement: "A new unverified note for the current synthetic organization." },
    source: { type: "manual", label: "Local form", recordId: `source-${id}` },
    createdAt: "2026-10-25T10:00:00.000Z",
    updatedAt: "2026-10-25T10:00:00.000Z",
    verification: "unverified",
    sensitivity: "internal",
    requiredPermissions: ["view_dashboard"],
    relatedRecordIds: [],
    relatedIntelligenceIds: [],
    status: "active",
  };
}

test("business memory fixtures validate typed content and source metadata", () => {
  assert.equal(validateBusinessMemoryRecord(demoBusinessMemory[0]).id, "memory-churn-fact");
  assert.throws(() => validateBusinessMemoryRecord({ ...demoBusinessMemory[0], content: { rationale: "wrong type" } }), /schema/);
  assert.throws(() => validateBusinessMemoryRecord({ ...demoBusinessMemory[0], requiredPermissions: ["manage_fake"] }), /schema/);
  assert.throws(() => validateBusinessMemoryRecord({ ...demoBusinessMemory[0], effectivePeriod: { from: "2026-12-01", to: "2026-01-01" } }), /schema/);
});

test("context retrieval filters tenant and permissions before returning record content", () => {
  const result = request();
  assert.deepEqual(result.evidence.map((entry) => entry.record.id), [
    "memory-churn-fact",
    "memory-churn-commitment",
    "memory-churn-decision",
  ]);
  assert.ok(result.evidence.every((entry) => entry.record.organizationId === "org-1"));
  assert.ok(!result.evidence.some((entry) => entry.record.title.includes("private sample")));

  const financeRestricted = request({ grantedPermissions: readOnly, intelligenceId: "demo-rbi-a1", entity: { type: "business_signal", id: "a1" } });
  assert.deepEqual(financeRestricted.evidence, []);
  const financeAllowed = request({ grantedPermissions: financeReadOnly, intelligenceId: "demo-rbi-a1", entity: { type: "business_signal", id: "a1" } });
  assert.deepEqual(financeAllowed.evidence.map((entry) => entry.record.id), ["memory-stale-revenue"]);
});

test("context citations include sources and stale, expired, unverified and conflicting evidence is flagged", () => {
  const renewal = request();
  assert.equal(renewal.citations[0].sourceRecordId, "report-churn-intent-03");
  assert.ok(renewal.evidence.some((entry) => entry.record.type === "commitment" && entry.stale));
  assert.ok(renewal.evidence.some((entry) => entry.record.type === "decision" && entry.stale));
  assert.ok(renewal.evidenceGaps.some((gap) => gap.includes("stale, unverified")));

  const conflicting = request({
    question: "warehouse capacity utilization",
    intelligenceId: "demo-rbi-a2",
    entity: { type: "business_signal", id: "a2" },
  });
  const conflictingRecords = conflicting.evidence.filter((entry) => entry.conflicting);
  assert.deepEqual(conflictingRecords.map((entry) => entry.record.id), ["memory-conflict-source-a", "memory-conflict-source-b"]);
  assert.ok(conflicting.evidenceGaps.some((gap) => gap.includes("no source was selected")));
});

test("context retrieval excludes superseded policies and communicates missing evidence", () => {
  const policy = request({
    question: "current finance approval policy",
    intelligenceId: undefined,
    entity: { type: "policy", id: "finance-approvals" },
    grantedPermissions: financeReadOnly,
  });
  assert.deepEqual(policy.evidence.map((entry) => entry.record.id), ["memory-policy-current"]);
  const missing = request({
    question: "no-match-token-qzx",
    intelligenceId: undefined,
    entity: undefined,
  });
  assert.equal(missing.evidence.length, 0);
  assert.ok(missing.evidenceGaps[0].includes("No authorized"));
});

test("context request validates time period and maximum package size", () => {
  assert.throws(() => request({ maxRecords: 21 }), /between 1 and 20/);
  assert.throws(() => request({ period: { from: now, to: now - 1 } }), /period is invalid/);
  const scoped = request({ period: { from: Date.parse("2026-07-01"), to: Date.parse("2026-07-31") } });
  assert.ok(scoped.evidence.length > 0);
  assert.equal(request({ maxRecords: 1 }).evidence.length, 1);
});

test("reversed decisions remain traceable and explicitly unverified", () => {
  const context = request({
    question: "warehouse response decision",
    intelligenceId: "demo-rbi-a2",
    entity: { type: "business_signal", id: "a2" },
  });
  const reversed = context.evidence.find((entry) => entry.record.id === "memory-warehouse-reversed-decision");
  assert.equal(reversed?.record.type, "decision");
  assert.equal(reversed?.record.content.outcome, "reversed");
  assert.equal(reversed?.record.verification, "unverified");
  assert.equal(reversed?.stale, true);
});

test("authorized record lookup and structured search filter before matching content", () => {
  assert.equal(getAuthorizedBusinessMemoryById(demoBusinessMemory, "memory-churn-fact", "org-1", readOnly)?.id, "memory-churn-fact");
  assert.equal(getAuthorizedBusinessMemoryById(demoBusinessMemory, "memory-policy-current", "org-1", readOnly), undefined);
  assert.equal(getAuthorizedBusinessMemoryById(demoBusinessMemory, "memory-churn-fact", "org-2", fullManager), undefined);
  const search = searchAuthorizedBusinessMemory(demoBusinessMemory, {
    organizationId: "org-1",
    grantedPermissions: readOnly,
    query: "declining renewal",
    type: "business_fact",
    status: "active",
    createdAfter: Date.parse("2026-07-01T00:00:00.000Z"),
    createdBefore: Date.parse("2026-07-02T00:00:00.000Z"),
  });
  assert.deepEqual(search.map((record) => record.id), ["memory-churn-fact"]);
  assert.throws(() => searchAuthorizedBusinessMemory(demoBusinessMemory, {
    organizationId: "org-1",
    grantedPermissions: readOnly,
    createdAfter: now,
    createdBefore: now - 1,
  }), /date range is invalid/);
});

test("create requires manage permission and same-tenant scope, and change history omits record content", () => {
  assert.throws(() => createBusinessMemory(initialState, newNote("new-note"), "org-1", readOnly, "actor-a", new Date(now).toISOString()), /manage_memory/);
  assert.throws(() => createBusinessMemory(initialState, newNote("cross-tenant-note", "org-2"), "org-1", memoryManager, "actor-a", new Date(now).toISOString()), /outside the active organization/);
  const created = createBusinessMemory(initialState, newNote("new-note"), "org-1", memoryManager, "actor-a", new Date(now).toISOString());
  assert.equal(created.records[0].id, "new-note");
  assert.deepEqual(created.history[0].changedFields, ["record"]);
  assert.equal("statement" in created.history[0], false);
});

test("updates preserve source provenance and verified historical statements cannot be overwritten", () => {
  const updated = updateBusinessMemory(initialState, "memory-churn-decision", "org-1", memoryManager, "actor-a", new Date(now).toISOString(), { title: "Reviewed synthetic decision" });
  const record = updated.records.find((entry) => entry.id === "memory-churn-decision")!;
  assert.equal(record.title, "Reviewed synthetic decision");
  assert.equal(record.source.recordId, "decision-demo-retention-review");
  assert.deepEqual(updated.history[0].changedFields, ["title"]);

  assert.throws(() => updateBusinessMemory(initialState, "memory-churn-fact", "org-1", memoryManager, "actor-a", new Date(now).toISOString(), { statement: "rewritten history" }), /cannot be rewritten/);
  assert.throws(() => updateBusinessMemory(initialState, "memory-policy-current", "org-1", readOnly, "actor-a", new Date(now).toISOString(), { title: "Not allowed" }), /manage_memory/);
  assert.throws(() => updateBusinessMemory(initialState, "memory-policy-current", "org-2", fullManager, "actor-a", new Date(now).toISOString(), { title: "Cross tenant" }), /not found/);
});

test("archive and link operations preserve traceability and emit material change history", () => {
  const archived = archiveBusinessMemory(initialState, "memory-churn-commitment", "org-1", memoryManager, "actor-a", new Date(now).toISOString());
  assert.equal(archived.records.find((entry) => entry.id === "memory-churn-commitment")?.status, "archived");
  assert.equal(archived.history[0].action, "archived");
  const linked = linkBusinessMemory(initialState, "memory-churn-fact", "memory-churn-decision", "org-1", memoryManager, "actor-a", new Date(now).toISOString());
  assert.ok(linked.records.find((entry) => entry.id === "memory-churn-fact")?.relatedRecordIds.includes("memory-churn-decision"));
  assert.equal(linked.history[0].action, "linked");
  assert.throws(() => linkBusinessMemory(initialState, "memory-churn-fact", "memory-policy-current", "org-1", memoryManager, "actor-a", new Date(now).toISOString()), /not found/);
});

test("demo fixture data is synthetic and isolated from current app persistence", () => {
  assert.ok(demoBusinessMemory.every((record) => record.source.label.startsWith("Synthetic") || record.source.label === "Synthetic Follow-up Register"));
  assert.ok(demoBusinessMemory.some((record) => record.organizationId !== "org-1"));
});
