import assert from "node:assert/strict";
import { test } from "node:test";
import { formatDemoEuro } from "@/lib/demo/currency";
import {
  rankIntelligence,
  validateBusinessIntelligence,
  type BusinessIntelligence,
} from "@/lib/rbi/intelligence-engine";
import type { PermissionKey } from "@/src/domain/security";

const now = Date.parse("2026-10-25T12:00:00Z");

function item(overrides: Partial<BusinessIntelligence> = {}): BusinessIntelligence {
  return {
    id: "signal-a",
    duplicateKey: "issue-a",
    title: "Sample operational signal",
    summary: "Synthetic source signal for deterministic engine tests.",
    kind: "process",
    entity: { type: "business_signal", id: "signal-a" },
    businessFunction: "Operations",
    relevantRoles: ["coo"],
    priority: "medium",
    confidence: 80,
    evidence: [{
      id: "evidence-a",
      source: "Synthetic test fixture",
      recordId: "source-a",
      statement: "A synthetic observation supports this sample signal.",
      observedAt: "2026-10-24T12:00:00Z",
      kind: "observed",
    }],
    uncertainty: "Synthetic data; verify the condition before acting.",
    nextAction: "Review the source evidence.",
    approvalRequired: false,
    requiredPermissions: ["view_dashboard"],
    status: "new",
    triage: { impact: 50, urgency: 50, risk: 50, opportunity: 50 },
    ...overrides,
  };
}

function rank(items: BusinessIntelligence[], roleId: "coo" | "cfo" = "coo") {
  return rankIntelligence(items, {
    roleId,
    grantedPermissions: new Set<PermissionKey>(["view_dashboard", "view_reports"]),
    asOf: now,
  });
}

test("business impact and urgency change relative ranking", () => {
  const baseline = item({ id: "baseline", duplicateKey: "baseline" });
  const higherImpact = item({ id: "impact", duplicateKey: "impact", triage: { ...baseline.triage, impact: 100 } });
  const higherUrgency = item({ id: "urgent", duplicateKey: "urgent", triage: { ...baseline.triage, urgency: 100 } });

  assert.ok(rank([baseline, higherImpact]).find((entry) => entry.id === "impact")!.score > rank([baseline, higherImpact]).find((entry) => entry.id === "baseline")!.score);
  assert.ok(rank([baseline, higherUrgency]).find((entry) => entry.id === "urgent")!.score > rank([baseline, higherUrgency]).find((entry) => entry.id === "baseline")!.score);
});

test("role relevance changes ordering without acting as an authorization rule", () => {
  const operations = item({ id: "operations", duplicateKey: "operations", relevantRoles: ["coo"] });
  const finance = item({ id: "finance", duplicateKey: "finance", relevantRoles: ["cfo"] });

  assert.equal(rank([operations, finance], "coo")[0].id, "operations");
  assert.equal(rank([operations, finance], "cfo")[0].id, "finance");
});

test("confidence and stale evidence affect the score transparently", () => {
  const highConfidence = item({ id: "confident", duplicateKey: "confident", confidence: 95 });
  const lowConfidence = item({ id: "uncertain", duplicateKey: "uncertain", confidence: 35 });
  const recent = item({ id: "recent", duplicateKey: "recent" });
  const old = item({
    id: "old",
    duplicateKey: "old",
    evidence: [{ ...recent.evidence[0], observedAt: "2026-08-01T12:00:00Z" }],
  });
  const ranked = rank([highConfidence, lowConfidence, recent, old]);

  assert.ok(ranked.find((entry) => entry.id === "confident")!.score > ranked.find((entry) => entry.id === "uncertain")!.score);
  assert.ok(ranked.find((entry) => entry.id === "recent")!.score > ranked.find((entry) => entry.id === "old")!.score);
  assert.equal(ranked.find((entry) => entry.id === "old")!.evidenceNeedsVerification, true);
  assert.equal(ranked.find((entry) => entry.id === "recent")!.scoreBreakdown.freshness, 97);
});

test("restricted records are filtered before scoring and deduplication", () => {
  const visible = item({ id: "visible", duplicateKey: "shared-issue" });
  const restrictedDuplicate = item({
    id: "restricted",
    duplicateKey: "shared-issue",
    requiredPermissions: ["view_reports"],
    triage: { impact: 100, urgency: 100, risk: 100, opportunity: 100 },
  });
  const restricted = item({ id: "restricted-only", requiredPermissions: ["manage_billing"] });

  const result = rankIntelligence([visible, restrictedDuplicate, restricted], {
    roleId: "coo",
    grantedPermissions: new Set<PermissionKey>(["view_dashboard"]),
    asOf: now,
  });

  assert.deepEqual(result.map((entry) => entry.id), ["visible"]);
});

test("duplicate issues retain one deterministic highest-ranked item", () => {
  const lower = item({ id: "b-copy", duplicateKey: "shared", triage: { impact: 10, urgency: 10, risk: 10, opportunity: 10 } });
  const higher = item({ id: "a-copy", duplicateKey: "shared", triage: { impact: 90, urgency: 90, risk: 90, opportunity: 90 } });

  assert.deepEqual(rank([lower, higher]).map((entry) => entry.id), ["a-copy"]);
  assert.deepEqual(rank([higher, lower]).map((entry) => entry.id), ["a-copy"]);
});

test("acknowledged items are deprioritized and dismissed or resolved items are excluded", () => {
  const fresh = item({ id: "fresh", duplicateKey: "fresh" });
  const acknowledged = item({ id: "ack", duplicateKey: "ack", status: "acknowledged" });
  const resolved = item({ id: "resolved", duplicateKey: "resolved", status: "resolved" });
  const dismissed = item({ id: "dismissed", duplicateKey: "dismissed", status: "dismissed" });
  const result = rank([fresh, acknowledged, resolved, dismissed]);

  assert.ok(result.findIndex((entry) => entry.id === "fresh") < result.findIndex((entry) => entry.id === "ack"));
  assert.deepEqual(result.map((entry) => entry.id), ["fresh", "ack"]);
});

test("missing evidence is marked for investigation and confidence is capped", () => {
  const result = rank([item({ evidence: [], confidence: 100 })])[0];

  assert.equal(result.evidenceNeedsVerification, true);
  assert.equal(result.scoreBreakdown.confidence, 20);
  assert.equal(result.scoreBreakdown.freshness, 0);
});

test("invalid scores and financial estimates fail validation", () => {
  assert.throws(() => validateBusinessIntelligence(item({ confidence: 101 })), /supported schema/);
  assert.throws(() => validateBusinessIntelligence(item({
    financialEstimate: { amountEuro: Number.NaN, period: "quarter", assumptions: ["synthetic"] },
  })), /supported schema/);
  assert.throws(() => validateBusinessIntelligence({ ...item(), relevantRoles: ["unknown-role"] }), /supported schema/);
  assert.throws(() => validateBusinessIntelligence({ ...item(), requiredPermissions: ["unknown_permission"] }), /supported schema/);
});

test("financial formatting uses euro currency without inventing an estimate", () => {
  assert.match(formatDemoEuro(1234.5), /€/);
  assert.equal(item().financialEstimate, undefined);
});

test("approval-required items remain review recommendations, not executable actions", () => {
  const [result] = rank([item({ approvalRequired: true })]);

  assert.equal(result.approvalRequired, true);
  assert.equal("execute" in result, false);
  assert.equal("onAction" in result, false);
});
