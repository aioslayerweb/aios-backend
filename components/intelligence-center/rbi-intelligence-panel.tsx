"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, CardContent, CardHeader } from "@/components/ui";
import { retrieveBusinessContext, type BusinessMemoryRecord } from "@/lib/business-memory/business-memory-engine";
import { formatDemoEuro } from "@/lib/demo/currency";
import { rankIntelligence, type BusinessIntelligence, type IntelligenceStatus } from "@/lib/rbi/intelligence-engine";
import type { PermissionKey } from "@/src/domain/security";
import type { RoleId } from "@/types/role-intelligence";

const statuses: IntelligenceStatus[] = ["new", "acknowledged", "in_progress", "awaiting_approval"];

export function RbiIntelligencePanel({
  items,
  roleId,
  grantedPermissions,
  memoryRecords,
  organizationId,
}: {
  items: readonly BusinessIntelligence[];
  roleId: RoleId | undefined;
  grantedPermissions: readonly PermissionKey[];
  memoryRecords: readonly BusinessMemoryRecord[];
  organizationId: string | undefined;
}) {
  const [asOf, setAsOf] = useState<number | null>(null);
  const [kindFilter, setKindFilter] = useState<"all" | "risk" | "opportunity" | "process" | "governance">("all");
  const [functionFilter, setFunctionFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | IntelligenceStatus>("all");
  const [statusById, setStatusById] = useState<Record<string, IntelligenceStatus>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => setAsOf(Date.now()), []);

  const ranked = useMemo(() => {
    if (!roleId || asOf === null) return [];
    const withLocalStatus = items.map((item) => ({ ...item, status: statusById[item.id] ?? item.status }));
    return rankIntelligence(withLocalStatus, { roleId, grantedPermissions: new Set(grantedPermissions), asOf });
  }, [asOf, grantedPermissions, items, roleId, statusById]);
  const functions = useMemo(() => Array.from(new Set(ranked.map((item) => item.businessFunction))).sort(), [ranked]);
  const filtered = useMemo(() => ranked.filter((item) =>
    (kindFilter === "all" || item.kind === kindFilter)
    && (functionFilter === "all" || item.businessFunction === functionFilter)
    && (priorityFilter === "all" || item.priority === priorityFilter)
    && (statusFilter === "all" || item.status === statusFilter)
  ), [functionFilter, kindFilter, priorityFilter, ranked, statusFilter]);
  const selected = filtered.find((item) => item.id === selectedId) ?? filtered[0];
  const businessContext = useMemo(() => {
    if (!selected || !organizationId || asOf === null) return null;
    return retrieveBusinessContext(memoryRecords, {
      organizationId,
      grantedPermissions: new Set(grantedPermissions),
      question: `${selected.title} ${selected.summary} ${selected.businessFunction}`,
      intelligenceId: selected.id,
      entity: selected.entity,
      asOf,
      maxRecords: 5,
    });
  }, [asOf, grantedPermissions, memoryRecords, organizationId, selected]);

  const updateLocalStatus = (item: BusinessIntelligence, status: IntelligenceStatus) => {
    setStatusById((current) => ({ ...current, [item.id]: status }));
  };

  return (
    <Card className="border-border bg-white" aria-label="Role-based business intelligence">
      <CardHeader className="space-y-2 py-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-brand-navy">Role-Based Intelligence</h3>
            <p className="text-xs text-text-secondary">Deterministic triage of synthetic signals; role relevance changes ranking, not access.</p>
          </div>
          <Badge tone="info">Demo · local only</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="flex items-center gap-2 text-xs text-text-secondary">
            <span>Function</span>
            <select aria-label="Filter intelligence by business function" className="min-h-9 rounded-lg border border-border bg-white px-2 text-sm text-brand-navy" value={functionFilter} onChange={(event) => setFunctionFilter(event.target.value)}>
              <option value="all">All functions</option>
              {functions.map((businessFunction) => <option key={businessFunction} value={businessFunction}>{businessFunction}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 text-xs text-text-secondary">
            <span>Kind</span>
            <select aria-label="Filter intelligence by kind" className="min-h-9 rounded-lg border border-border bg-white px-2 text-sm text-brand-navy" value={kindFilter} onChange={(event) => setKindFilter(event.target.value as typeof kindFilter)}>
              <option value="all">All kinds</option>
              <option value="risk">Risk</option>
              <option value="opportunity">Opportunity</option>
              <option value="process">Process</option>
              <option value="governance">Governance</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-xs text-text-secondary">
            <span>Priority</span>
            <select aria-label="Filter intelligence by priority" className="min-h-9 rounded-lg border border-border bg-white px-2 text-sm text-brand-navy" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
              <option value="all">All priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-xs text-text-secondary">
            <span>Status</span>
            <select aria-label="Filter intelligence by status" className="min-h-9 rounded-lg border border-border bg-white px-2 text-sm text-brand-navy" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}>
              <option value="all">All active statuses</option>
              {statuses.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}
            </select>
          </label>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <p className="text-[11px] leading-5 text-text-muted">
          Relative triage only — weights: impact 20%, urgency 15%, risk 15%, opportunity 10%, evidence confidence 10%, freshness 10%, role relevance 20%.
          The score is not a measured business outcome. Acknowledged items are deprioritized; resolved or dismissed items are excluded.
        </p>
        {asOf === null ? <p className="text-sm text-text-secondary" role="status">Checking sample evidence freshness…</p> : null}
        {asOf !== null && filtered.length === 0 ? <p className="text-sm text-text-secondary">No authorized sample signals match this filter.</p> : null}
        {filtered.length > 0 ? (
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <ul className="min-w-0 space-y-2" aria-label="Ranked intelligence">
              {filtered.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    aria-pressed={(selected?.id ?? "") === item.id}
                    className={`w-full rounded-xl border p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${(selected?.id ?? "") === item.id ? "border-brand-primary bg-brand-subtle/30" : "border-border bg-surface-canvas"}`}
                  >
                    <span className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-brand-navy">{item.title}</span>
                      <span className="flex items-center gap-2">
                        <Badge tone={item.priority === "critical" || item.priority === "high" ? "warning" : "info"}>{item.priority}</Badge>
                        <span className="text-xs font-semibold text-brand-navy" aria-label={`Relative triage score ${item.score}`}>{item.score}</span>
                      </span>
                    </span>
                    <span className="mt-1 block text-xs text-text-secondary">{item.businessFunction} · {item.status.replace("_", " ")}</span>
                  </button>
                </li>
              ))}
            </ul>
            {selected ? (
              <article className="min-w-0 rounded-xl border border-border bg-white p-3" aria-live="polite">
                <h4 className="text-sm font-semibold text-brand-navy">{selected.title}</h4>
                <p className="mt-2 text-xs text-text-secondary"><strong>What happened:</strong> {selected.summary}</p>
                <p className="mt-2 text-xs text-text-secondary"><strong>Why it matters:</strong> {selected.kind} signal for {selected.businessFunction}; the role match affects ranking only.</p>
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-semibold text-brand-navy">Supporting evidence</p>
                  {selected.evidence.length ? selected.evidence.map((evidence) => (
                    <p key={evidence.id} className="break-words text-xs text-text-secondary">
                      {evidence.statement} <span className="text-text-muted">· {evidence.source} · {evidence.observedAt ? new Date(evidence.observedAt).toISOString().slice(0, 10) : "date unavailable"}</span>
                    </p>
                  )) : <p className="text-xs text-text-secondary">No source evidence; investigation is required.</p>}
                </div>
                <p className="mt-2 text-xs text-text-secondary"><strong>Next:</strong> {selected.nextAction}</p>
                <p className="mt-1 text-xs text-text-secondary"><strong>Uncertainty:</strong> {selected.uncertainty}</p>
                <section className="mt-3 rounded-lg border border-border bg-surface-canvas p-3" aria-label="Retrieved business memory context">
                  <h5 className="text-xs font-semibold text-brand-navy">Permission-filtered sample memory context</h5>
                  {businessContext?.evidence.length ? (
                    <div className="mt-2 space-y-2">
                      {businessContext.evidence.map((context) => (
                        <article key={context.record.id} className="border-l-2 border-brand-primary/50 pl-2">
                          <p className="text-xs font-semibold text-brand-navy">{context.record.title}</p>
                          <p className="mt-0.5 break-words text-xs text-text-secondary">{context.record.content.statement}</p>
                          <p className="mt-0.5 break-words text-[11px] text-text-muted">
                            Citation: {context.record.source.label} · {context.record.source.recordId} · {context.record.effectivePeriod ? `effective ${context.record.effectivePeriod.from.slice(0, 10)}${context.record.effectivePeriod.to ? ` to ${context.record.effectivePeriod.to.slice(0, 10)}` : ""}` : "effective period unspecified"} · {context.relevanceReason}
                          </p>
                          {context.record.type === "decision" ? <p className="mt-0.5 text-[11px] text-text-secondary">Historical rationale: {context.record.content.rationale}. Recorded outcome: {context.record.content.outcome}.</p> : null}
                          {context.record.type === "commitment" ? <p className="mt-0.5 text-[11px] text-text-secondary">Commitment: {context.record.content.commitmentStatus}; due {context.record.content.dueAt ?? "date not specified"}.</p> : null}
                          {context.stale || context.conflicting ? <p className="mt-1 text-[11px] font-medium text-amber-800">{context.conflicting ? "Conflicting evidence; no source selected as authoritative." : "Stale or unverified evidence; verify before acting."}</p> : null}
                        </article>
                      ))}
                    </div>
                  ) : <p className="mt-1 text-xs text-text-secondary">No authorized business memory is available for this signal. Historical context is not inferred.</p>}
                  {businessContext?.evidenceGaps.length ? <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] text-amber-900">{businessContext.evidenceGaps.map((gap) => <li key={gap}>{gap}</li>)}</ul> : null}
                  <p className="mt-2 text-[10px] text-text-muted">Client-context filtering only; not server authorization. Retrieval uses deterministic text and metadata matching, with no semantic search or model call.</p>
                </section>
                <p className="mt-1 text-xs text-text-secondary"><strong>Confidence:</strong> {selected.scoreBreakdown.confidence}% · <strong>Freshness:</strong> {selected.evidenceNeedsVerification ? "stale or unverified" : "current"}</p>
                <p className="mt-1 text-xs text-text-secondary"><strong>Approval:</strong> {selected.approvalRequired ? "required before consequential action" : "no consequential action offered"}</p>
                {selected.financialEstimate ? (
                  <p className="mt-1 text-xs text-text-secondary">
                    <strong>Estimated impact:</strong> {formatDemoEuro(selected.financialEstimate.amountEuro)} per {selected.financialEstimate.period}.
                    <span> Assumptions: {selected.financialEstimate.assumptions.join("; ")}</span>
                  </p>
                ) : <p className="mt-1 text-xs text-text-muted">Financial impact not estimated; source data does not support a defensible amount.</p>}
                {selected.evidenceNeedsVerification ? <p className="mt-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-900">Evidence is missing or older than 30 days. Verify before acting.</p> : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button type="button" size="sm" variant="secondary" onClick={() => updateLocalStatus(selected, "acknowledged")}>Acknowledge locally</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => updateLocalStatus(selected, "resolved")}>Mark resolved locally</Button>
                </div>
                <p className="mt-2 text-[11px] text-text-muted" role="status">Status changes are in-memory demo previews and reset when this page reloads.</p>
              </article>
            ) : null}
          </div>
        ) : null}
        {asOf !== null ? <p className="text-[11px] text-text-muted">Ranking evaluated {new Date(asOf).toISOString().slice(0, 10)} · authorized signals are filtered before scoring.</p> : null}
      </CardContent>
    </Card>
  );
}
