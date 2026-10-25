"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Badge, Button, Card, CardContent, CardHeader, Input } from "@/components/ui";
import {
  archiveBusinessMemory,
  createBusinessMemory,
  searchAuthorizedBusinessMemory,
  type BusinessMemoryRecord,
  type BusinessMemorySourceType,
  type BusinessMemoryStatus,
  type BusinessMemoryState,
  type BusinessMemoryType,
} from "@/lib/business-memory/business-memory-engine";
import { demoBusinessMemory } from "@/lib/business-memory/demo-fixtures";
import type { PermissionKey } from "@/src/domain/security";

const sourceTypes: BusinessMemorySourceType[] = ["manual", "system", "document", "report", "workflow", "decision"];

export function BusinessMemoryExplorer({
  organizationId,
  grantedPermissions,
  canManageMemory,
}: {
  organizationId: string | undefined;
  grantedPermissions: readonly PermissionKey[];
  canManageMemory: boolean;
}) {
  const [state, setState] = useState<BusinessMemoryState>({ records: demoBusinessMemory, history: [] });
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<BusinessMemoryType | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<BusinessMemorySourceType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<BusinessMemoryStatus | "all">("active");
  const [createdAfter, setCreatedAfter] = useState("");
  const [createdBefore, setCreatedBefore] = useState("");
  const [selectedId, setSelectedId] = useState("memory-churn-fact");
  const [title, setTitle] = useState("");
  const [statement, setStatement] = useState("");
  const [error, setError] = useState("");
  const granted = useMemo(() => new Set(grantedPermissions), [grantedPermissions]);
  const invalidDateRange = Boolean(createdAfter && createdBefore && createdAfter > createdBefore);

  const visibleRecords = useMemo(() => {
    if (!organizationId || invalidDateRange) return [];
    return searchAuthorizedBusinessMemory(state.records, {
      organizationId,
      grantedPermissions: granted,
      query,
      status: statusFilter === "all" ? undefined : statusFilter,
      type: typeFilter === "all" ? undefined : typeFilter,
      sourceType: sourceFilter === "all" ? undefined : sourceFilter,
      createdAfter: createdAfter ? Date.parse(`${createdAfter}T00:00:00.000Z`) : undefined,
      createdBefore: createdBefore ? Date.parse(`${createdBefore}T23:59:59.999Z`) : undefined,
    });
  }, [createdAfter, createdBefore, granted, invalidDateRange, organizationId, query, sourceFilter, state.records, statusFilter, typeFilter]);
  const selected = visibleRecords.find((record) => record.id === selectedId) ?? visibleRecords[0];

  function createLocalRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!organizationId) return;
    const timestamp = new Date().toISOString();
    const id = `local-memory-${Date.now()}`;
    const record: BusinessMemoryRecord = {
      id,
      organizationId,
      type: "business_context",
      title: title.trim(),
      content: { statement: statement.trim() },
      source: { type: "manual", label: "Local demo note", recordId: id },
      createdAt: timestamp,
      updatedAt: timestamp,
      author: "Current demo user",
      verification: "unverified",
      confidence: 0,
      sensitivity: "internal",
      requiredPermissions: ["view_dashboard"],
      relatedRecordIds: [],
      relatedIntelligenceIds: [],
      status: "active",
    };
    try {
      const next = createBusinessMemory(state, record, organizationId, granted, "current-demo-user", timestamp);
      setState(next);
      setSelectedId(id);
      setTitle("");
      setStatement("");
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create a local memory record.");
    }
  }

  function archiveSelected() {
    if (!organizationId || !selected) return;
    try {
      setState(archiveBusinessMemory(state, selected.id, organizationId, granted, "current-demo-user", new Date().toISOString()));
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to archive this local memory record.");
    }
  }

  return (
    <Card className="border-border bg-white" aria-label="Business memory and context explorer">
      <CardHeader className="space-y-2 py-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-brand-navy">Business Memory &amp; Context</h3>
            <p className="text-xs text-text-secondary">Structured source records, lifecycle, and citations for grounded intelligence.</p>
          </div>
          <Badge tone="info">Synthetic demo · session only</Badge>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <label className="text-xs text-text-secondary">
            Search
            <Input className="mt-1 min-h-9" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search business memory" placeholder="Text or source reference" />
          </label>
          <label className="text-xs text-text-secondary">
            Type
            <select className="mt-1 min-h-9 w-full rounded-lg border border-border bg-white px-2 text-sm text-brand-navy" aria-label="Filter memory by type" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as BusinessMemoryType | "all")}>
              <option value="all">All types</option>
              {Array.from(new Set(demoBusinessMemory.map((record) => record.type))).sort().map((type) => <option key={type} value={type}>{type.replace(/_/g, " ")}</option>)}
            </select>
          </label>
          <label className="text-xs text-text-secondary">
            Source
            <select className="mt-1 min-h-9 w-full rounded-lg border border-border bg-white px-2 text-sm text-brand-navy" aria-label="Filter memory by source" value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value as BusinessMemorySourceType | "all")}>
              <option value="all">All sources</option>
              {sourceTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
          <label className="text-xs text-text-secondary">
            Lifecycle
            <select className="mt-1 min-h-9 w-full rounded-lg border border-border bg-white px-2 text-sm text-brand-navy" aria-label="Filter memory by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as BusinessMemoryStatus | "all")}>
              <option value="active">Active</option>
              <option value="superseded">Superseded</option>
              <option value="obsolete">Obsolete</option>
              <option value="archived">Archived</option>
              <option value="all">All lifecycle states</option>
            </select>
          </label>
          <label className="text-xs text-text-secondary">
            Recorded from
            <input type="date" max={createdBefore || undefined} className="mt-1 min-h-9 w-full rounded-lg border border-border bg-white px-2 text-sm text-brand-navy" value={createdAfter} onChange={(event) => setCreatedAfter(event.target.value)} aria-label="Filter memory from recorded date" />
          </label>
          <label className="text-xs text-text-secondary">
            Recorded through
            <input type="date" min={createdAfter || undefined} className="mt-1 min-h-9 w-full rounded-lg border border-border bg-white px-2 text-sm text-brand-navy" value={createdBefore} onChange={(event) => setCreatedBefore(event.target.value)} aria-label="Filter memory through recorded date" />
          </label>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-950" role="note">
          This is an in-memory demo fixture, not a persistent or server-authorized business memory service. Local changes reset when the page reloads.
        </p>
        {invalidDateRange ? <p className="text-sm text-red-700" role="alert">The recorded-from date must not be after the recorded-through date.</p> : null}
        {error ? <p className="text-sm text-red-700" role="alert">{error}</p> : null}
        <div className="grid min-w-0 gap-3 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="min-w-0 space-y-2" aria-label="Business memory records">
            <p className="text-xs text-text-muted">{visibleRecords.length} sample records matching the selected organization and current permission context</p>
            {visibleRecords.length ? visibleRecords.map((record) => (
              <button key={record.id} type="button" onClick={() => setSelectedId(record.id)} aria-pressed={selected?.id === record.id}
                className={`w-full min-w-0 rounded-xl border p-3 text-left ${selected?.id === record.id ? "border-brand-primary bg-brand-subtle/30" : "border-border bg-surface-canvas"}`}>
                <span className="flex flex-wrap justify-between gap-2">
                  <span className="break-words text-sm font-semibold text-brand-navy">{record.title}</span>
                  <Badge tone={record.verification === "verified" ? "success" : record.verification === "conflicted" ? "warning" : "default"}>{record.verification.replaceAll("_", " ")}</Badge>
                </span>
                <span className="mt-1 block text-xs text-text-secondary">{record.type.replace(/_/g, " ")} · {record.source.type} · {record.status}</span>
              </button>
            )) : <p className="rounded-lg border border-border p-4 text-sm text-text-secondary">No authorized records match these filters.</p>}
          </div>
          <div className="min-w-0 space-y-3">
            {selected ? (
              <article className="min-w-0 space-y-2 rounded-xl border border-border p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h4 className="break-words text-sm font-semibold text-brand-navy">{selected.title}</h4>
                  {canManageMemory && selected.status === "active" ? <Button type="button" size="sm" variant="secondary" onClick={archiveSelected}>Archive locally</Button> : null}
                </div>
                <p className="break-words text-sm text-text-secondary">{selected.content.statement}</p>
                {selected.type === "decision" ? <p className="text-xs text-text-secondary"><strong>Rationale:</strong> {selected.content.rationale} · Outcome: {selected.content.outcome}</p> : null}
                {selected.type === "commitment" ? <p className="text-xs text-text-secondary"><strong>Owner:</strong> {selected.content.owner ?? "Unassigned"} · <strong>Due:</strong> {selected.content.dueAt ?? "Not specified"} · {selected.content.commitmentStatus}</p> : null}
                {selected.type === "policy" ? <p className="text-xs text-text-secondary">Version {selected.content.version}</p> : null}
                <dl className="grid gap-2 text-xs sm:grid-cols-2">
                  <div><dt className="font-semibold text-text-muted">Source</dt><dd className="break-words text-text-secondary">{selected.source.label} · {selected.source.recordId}</dd></div>
                  <div><dt className="font-semibold text-text-muted">Recorded</dt><dd className="text-text-secondary">{new Date(selected.createdAt).toISOString().slice(0, 10)} · updated {new Date(selected.updatedAt).toISOString().slice(0, 10)}</dd></div>
                  <div><dt className="font-semibold text-text-muted">Effective period</dt><dd className="text-text-secondary">{selected.effectivePeriod ? `${selected.effectivePeriod.from.slice(0, 10)}${selected.effectivePeriod.to ? ` – ${selected.effectivePeriod.to.slice(0, 10)}` : " onward"}` : "Not specified"}</dd></div>
                  <div><dt className="font-semibold text-text-muted">Sensitivity / status</dt><dd className="text-text-secondary">{selected.sensitivity} · {selected.status}</dd></div>
                  <div><dt className="font-semibold text-text-muted">Verification / confidence</dt><dd className="text-text-secondary">{selected.verification}{selected.confidence === undefined ? "" : ` · ${selected.confidence}%`}</dd></div>
                  <div><dt className="font-semibold text-text-muted">Related records</dt><dd className="break-words text-text-secondary">{selected.relatedRecordIds.length ? selected.relatedRecordIds.join(", ") : "None linked"}</dd></div>
                </dl>
                {selected.verification === "conflicted" ? <p className="rounded-lg bg-amber-50 p-2 text-xs text-amber-900">Conflicting evidence is retained; this record is not treated as authoritative.</p> : null}
                {selected.status === "superseded" || selected.status === "obsolete" ? <p className="rounded-lg bg-surface-canvas p-2 text-xs text-text-secondary">Historical record retained; it is not returned as current context.</p> : null}
                <div className="border-t border-border pt-2">
                  <p className="text-xs font-semibold text-brand-navy">Local change history</p>
                  {state.history.filter((entry) => entry.recordId === selected.id).map((entry) => <p key={entry.id} className="mt-1 break-words text-xs text-text-secondary">{entry.action} · {entry.changedFields.join(", ")} · {entry.occurredAt}</p>)}
                  {!state.history.some((entry) => entry.recordId === selected.id) ? <p className="mt-1 text-xs text-text-muted">No edits in this page session. Source history is not connected.</p> : null}
                </div>
              </article>
            ) : <p className="rounded-lg border border-border p-4 text-sm text-text-secondary">Select an authorized memory record to inspect its source and lifecycle.</p>}
            {canManageMemory ? (
              <form className="space-y-2 rounded-xl border border-border p-3" onSubmit={createLocalRecord}>
                <h4 className="text-sm font-semibold text-brand-navy">Add a local context note</h4>
                <label className="block text-xs text-text-secondary">Title<Input required maxLength={120} className="mt-1" value={title} onChange={(event) => setTitle(event.target.value)} /></label>
                <label className="block text-xs text-text-secondary">Statement<Input required maxLength={500} className="mt-1" value={statement} onChange={(event) => setStatement(event.target.value)} /></label>
                <Button type="submit" size="sm" variant="secondary">Create local note</Button>
              </form>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
